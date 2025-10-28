"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { User, Loader2, KeyRound, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { api, ApiError } from "@/lib/api-client"
import { useTranslation } from "@/hooks/useTranslation"

// Schema functions will be created inside component to access t()

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const { t } = useTranslation('profile-settings')
  const [isSavingProfile, setIsSavingProfile] = React.useState(false)
  const [isSavingPassword, setIsSavingPassword] = React.useState(false)

  // Create schemas with translations
  const profileSchema = z.object({
    name: z.string().min(2, t('validation.nameMin', 'Name must be at least 2 characters')),
    email: z.string().email(t('validation.invalidEmail', 'Invalid email address')),
  })

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, t('validation.currentPasswordRequired', 'Current password is required')),
    newPassword: z.string().min(8, t('validation.newPasswordMin', 'New password must be at least 8 characters')),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t('validation.passwordsMatch', "Passwords don't match"),
    path: ["confirmPassword"],
  })

  type ProfileFormData = z.infer<typeof profileSchema>
  type PasswordFormData = z.infer<typeof passwordSchema>

  // Debug logging
  React.useEffect(() => {
    console.log('[ProfilePage] Session:', session)
    console.log('[ProfilePage] AuthProvider:', session?.user?.authProvider)
  }, [session])

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Update form when session loads
  React.useEffect(() => {
    if (session?.user) {
      profileForm.reset({
        name: session.user.name || "",
        email: session.user.email || "",
      })
    }
  }, [session, profileForm])

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSavingProfile(true)

    try {
      const result = await api.patch<{
        message: string
        user: {
          id: string
          name: string
          email: string
        }
      }>("/dashboard/api/profile", data)

      // Update session - pass empty object to force trigger
      await update({})
      
      // Update the form with the new values
      profileForm.reset({
        name: result.user.name,
        email: result.user.email,
      })
      
      toast.success(t('toast.profileUpdated', 'Profile updated successfully'))
    } catch (error) {
      console.error("Error updating profile:", error)
      const message = error instanceof ApiError ? error.message : t('toast.profileFailed', 'Failed to update profile')
      toast.error(message)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsSavingPassword(true)

    try {
      await api.patch<{ message: string }>("/dashboard/api/profile/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      passwordForm.reset()
      toast.success(t('toast.passwordChanged', 'Password changed successfully'))
    } catch (error) {
      console.error("Error changing password:", error)
      const message = error instanceof ApiError ? error.message : t('toast.unexpectedError', 'An unexpected error occurred')
      toast.error(message)
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title', 'Profile Settings')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('subtitle', 'Manage your personal information and security')}
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>{t('profile.title', 'Personal Information')}</CardTitle>
          </div>
          <CardDescription>
            {t('profile.description', 'Update your name and email address')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('profile.name', 'Name')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder={t('profile.namePlaceholder', 'Your name')}
                {...profileForm.register("name")}
              />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {t('profile.email', 'Email')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('profile.emailPlaceholder', 'your@email.com')}
                {...profileForm.register("email")}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                {t('profile.emailDisabled', 'Email cannot be changed at this time')}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSavingProfile || !profileForm.formState.isDirty}
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('profile.saving', 'Saving...')}
                  </>
                ) : (
                  t('profile.saveChanges', 'Save Changes')
                )}
              </Button>
              {profileForm.formState.isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => profileForm.reset()}
                  disabled={isSavingProfile}
                >
                  {t('profile.cancel', 'Cancel')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change or OAuth Status */}
      {session?.user?.authProvider === 'google' ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>{t('security.title', 'Account Security')}</CardTitle>
            </div>
            <CardDescription>
              {t('security.googleDescription', "You signed in with Google. Your account is secured through Google's authentication.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">{t('security.googleSignedIn', 'Signed in with Google')}</p>
                <p className="text-xs text-green-600">{t('security.googleSecured', "Your account is secured through Google's authentication system.")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              <CardTitle>{t('password.title', 'Change Password')}</CardTitle>
            </div>
            <CardDescription>
              {t('password.description', 'Update your password to keep your account secure')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  {t('password.currentPassword', 'Current Password')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder={t('password.currentPasswordPlaceholder', 'Enter your current password')}
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  {t('password.newPassword', 'New Password')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder={t('password.newPasswordPlaceholder', 'Enter your new password (min 8 characters)')}
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t('password.confirmPassword', 'Confirm New Password')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('password.confirmPasswordPlaceholder', 'Confirm your new password')}
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSavingPassword || !passwordForm.formState.isDirty}
                >
                  {isSavingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('password.changing', 'Changing...')}
                    </>
                  ) : (
                    t('password.changePassword', 'Change Password')
                  )}
                </Button>
                {passwordForm.formState.isDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => passwordForm.reset()}
                    disabled={isSavingPassword}
                  >
                    {t('password.cancel', 'Cancel')}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
