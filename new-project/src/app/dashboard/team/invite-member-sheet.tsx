"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTranslation } from "@/hooks/useTranslation"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["EDITOR", "VIEWER"]),
})

type InviteFormData = z.infer<typeof inviteSchema>

type AccountPermission = "SCAN_CREATE" | "SCAN_VIEW" | "SCAN_EDIT" | "SCAN_DELETE" | "TEAM_VIEW" | "TEAM_INVITE" | "TEAM_REMOVE"

interface InviteMemberSheetProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (data: InviteFormData & { permissions: AccountPermission[] }) => Promise<boolean>
}

export function InviteMemberSheet({ isOpen, onClose, onInvite }: InviteMemberSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { t } = useTranslation('dashboard-team')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "VIEWER",
    },
  })

  const role = watch("role")

  const onSubmit = async (data: InviteFormData) => {
    setIsSubmitting(true)
    
    // Auto-assign permissions based on role
    const permissions: AccountPermission[] = data.role === "EDITOR" 
      ? ["SCAN_CREATE", "SCAN_VIEW", "SCAN_EDIT", "TEAM_VIEW"]
      : ["SCAN_VIEW", "TEAM_VIEW"]
    
    const success = await onInvite({ ...data, permissions })
    
    // Only reset and close if successful
    if (success) {
      reset()
      onClose()
    }
    // If failed, keep form open with entered values
    
    setIsSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{t('sheet.title', 'Invite Team Member')}</SheetTitle>
          <SheetDescription>
            {t('sheet.description', "Send an invitation to join your team. They'll receive an email with instructions.")}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto space-y-6 p-6 pt-0">
            <div className="space-y-2">
              <Label htmlFor="email">{t('sheet.emailLabel', 'Email Address')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('sheet.emailPlaceholder', 'colleague@example.com')}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t('sheet.roleLabel', 'Role')}</Label>
              <Select
                value={role}
                onValueChange={(value) => setValue("role", value as "EDITOR" | "VIEWER")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('sheet.rolePlaceholder', 'Select a role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEWER">
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{t('role.viewer', 'Viewer')}</div>
                      <div className="text-xs text-muted-foreground">{t('role.viewerDesc', 'Can view scans and reports')}</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="EDITOR">
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{t('role.editor', 'Editor')}</div>
                      <div className="text-xs text-muted-foreground">{t('role.editorDesc', 'Can view and create scans')}</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">{t('sheet.noteTitle', 'Note:')}</p>
              <p>
                {t('sheet.noteDescription', 'The invitation will be sent via email and will expire in 7 days. The recipient must accept the invitation to join your team.')}
              </p>
            </div>
          </div>

          <SheetFooter className="flex-shrink-0 border-t pt-6 gap-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              {t('cancel', 'Cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? t('sheet.sending', 'Sending...') : t('sheet.sendInvitation', 'Send Invitation')}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

