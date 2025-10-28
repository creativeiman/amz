"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Building2, Loader2 } from "lucide-react"

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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingPage } from "@/components/loading"
import { api, ApiError } from "@/lib/api-client"
import { useTranslation } from "@/hooks/useTranslation"

// Schema will be created inside component to access t()

interface AccountData {
  id: string
  name: string
  slug: string
  plan: string
  businessName: string | null
  billingEmail: string | null
}

export default function AccountSettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { t } = useTranslation('account-settings')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [accountData, setAccountData] = React.useState<AccountData | null>(null)

  const isOwner = Boolean((session?.user as { isOwner?: boolean })?.isOwner)
  const isSessionLoading = status === 'loading'

  // Create schema with translations
  const accountSchema = z.object({
    name: z.string().min(2, t('validation.nameMin', 'Account name must be at least 2 characters')),
    businessName: z.string().optional(),
    billingEmail: z.string().email(t('validation.invalidEmail', 'Invalid email address')).optional().or(z.literal("")),
  })

  type AccountFormData = z.infer<typeof accountSchema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  })

  // Fetch account data
  React.useEffect(() => {
    async function fetchAccountData() {
      // Wait for session to load
      if (isSessionLoading) return
      
      if (!isOwner) {
        setIsLoading(false)
        return
      }

      try {
        const data = await api.get<{ account: AccountData }>("/dashboard/api/account")
        setAccountData(data.account)
        reset({
          name: data.account.name,
          businessName: data.account.businessName || "",
          billingEmail: data.account.billingEmail || "",
        })
      } catch (error) {
        console.error("Error fetching account:", error)
        const message = error instanceof ApiError ? error.message : t('toast.failedToLoad', 'Failed to load account settings')
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccountData()
  }, [isOwner, isSessionLoading, reset, t])

  // Redirect non-owners (only after session has loaded)
  React.useEffect(() => {
    if (isSessionLoading) return
    
    if (!isLoading && !isOwner) {
      toast.error(t('error.ownersOnly', 'Only account owners can access account settings'))
      router.push("/dashboard/settings/profile")
    }
  }, [isOwner, isLoading, isSessionLoading, router, t])

  const onSubmit = async (data: AccountFormData) => {
    setIsSaving(true)

    try {
      const result = await api.patch<{
        message: string
        account: AccountData
      }>("/dashboard/api/account", data)
      
      setAccountData(result.account)
      reset(data)
      
      // Update session to refresh any cached data
      await update()
      
      toast.success(t('toast.updateSuccess', 'Account settings updated successfully'))
    } catch (error) {
      console.error("Error updating account:", error)
      const message = error instanceof ApiError ? error.message : t('toast.updateFailed', 'Failed to update account')
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  // Show loading while session or account data is loading
  if (isSessionLoading || isLoading) {
    return <LoadingPage />
  }

  // This should rarely render since we redirect non-owners
  if (!isOwner) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title', 'Account Settings')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('subtitle', 'Manage your workspace and account information')}
        </p>
      </div>

      <Alert>
        <Building2 className="h-4 w-4" />
        <AlertDescription>
          {t('alert.workspaceSettings', 'These settings apply to your entire workspace and will be visible to all team members.')}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t('workspace.title', 'Workspace Information')}</CardTitle>
          <CardDescription>
            {t('workspace.description', 'Update your workspace name and business details')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('workspace.name', 'Workspace Name')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder={t('workspace.namePlaceholder', 'e.g., My Business, ACME Corp')}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {t('workspace.nameHint', 'This name will be displayed in the sidebar and throughout your dashboard')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">{t('workspace.businessName', 'Business Name (Optional)')}</Label>
              <Input
                id="businessName"
                placeholder={t('workspace.businessNamePlaceholder', 'Legal business name')}
                {...register("businessName")}
              />
              {errors.businessName && (
                <p className="text-sm text-red-600">{errors.businessName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingEmail">{t('workspace.billingEmail', 'Billing Email (Optional)')}</Label>
              <Input
                id="billingEmail"
                type="email"
                placeholder={t('workspace.billingEmailPlaceholder', 'billing@example.com')}
                {...register("billingEmail")}
              />
              {errors.billingEmail && (
                <p className="text-sm text-red-600">{errors.billingEmail.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {t('workspace.billingEmailHint', 'Used for invoices and billing notifications')}
              </p>
            </div>

            {accountData && (
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('workspace.plan', 'Plan')}</p>
                    <p className="font-medium capitalize">{accountData.plan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('workspace.workspaceId', 'Workspace ID')}</p>
                    <p className="font-mono text-xs">{accountData.slug}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving || !isDirty}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('workspace.saving', 'Saving...')}
                  </>
                ) : (
                  t('workspace.saveChanges', 'Save Changes')
                )}
              </Button>
              {isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={isSaving}
                >
                  {t('workspace.cancel', 'Cancel')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

