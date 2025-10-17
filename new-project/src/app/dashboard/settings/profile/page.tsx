"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { User, Loader2, KeyRound } from "lucide-react"

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

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [isSavingProfile, setIsSavingProfile] = React.useState(false)
  const [isSavingPassword, setIsSavingPassword] = React.useState(false)

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
      const response = await fetch("/dashboard/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      const result = await response.json()

      // Update session - pass empty object to force trigger
      await update({})
      
      // Update the form with the new values
      profileForm.reset({
        name: result.user.name,
        email: result.user.email,
      })
      
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsSavingProfile(false)
    }
  }

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsSavingPassword(true)

    try {
      const response = await fetch("/dashboard/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to change password")
        setIsSavingPassword(false)
        return
      }

      passwordForm.reset()
      toast.success("Password changed successfully")
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and security
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Personal Information</CardTitle>
          </div>
          <CardDescription>
            Update your name and email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Your name"
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
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...profileForm.register("email")}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed at this time
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              {profileForm.formState.isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => profileForm.reset()}
                  disabled={isSavingProfile}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                Current Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
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
                New Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password (min 8 characters)"
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
                Confirm New Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
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
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
              {passwordForm.formState.isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => passwordForm.reset()}
                  disabled={isSavingPassword}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
