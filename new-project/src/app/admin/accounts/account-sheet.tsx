"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Account } from "./columns"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type TeamMember = {
  id: string
  userId: string
  name: string | null
  email: string
  role: "EDITOR" | "VIEWER"
  permissions: ("VIEW" | "EDIT")[]
  isEmailVerified: boolean
  joinedAt: Date
}

const accountSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  ownerEmail: z.string().email("Invalid email address"),
  plan: z.enum(["FREE", "DELUXE", "ONE_TIME"]),
  isEmailVerified: z.boolean(),
  isActive: z.boolean(),
})

type AccountFormData = z.infer<typeof accountSchema>

interface AccountSheetProps {
  account: Account | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: AccountFormData) => Promise<void>
}

export function AccountSheet({ account, isOpen, onClose, onSave }: AccountSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [members, setMembers] = React.useState<TeamMember[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      accountName: "",
      ownerName: "",
      ownerEmail: "",
      plan: "FREE",
      isEmailVerified: false,
      isActive: true,
    },
  })

  // Fetch account details including members when editing
  React.useEffect(() => {
    if (account) {
      reset({
        accountName: account.name,
        ownerName: account.ownerName || "",
        ownerEmail: account.ownerEmail,
        plan: account.plan,
        isEmailVerified: account.isEmailVerified,
        isActive: account.isActive,
      })
      
      // Fetch full account details with members
      setIsLoadingMembers(true)
      fetch(`/admin/api/accounts/${account.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.account?.members) {
            setMembers(data.account.members)
          }
        })
        .catch(error => {
          console.error("Error fetching members:", error)
        })
        .finally(() => {
          setIsLoadingMembers(false)
        })
    } else {
      reset({
        accountName: "",
        ownerName: "",
        ownerEmail: "",
        plan: "FREE",
        isEmailVerified: false,
        isActive: true,
      })
      setMembers([])
    }
  }, [account, reset])

  const onSubmit = async (data: AccountFormData) => {
    setIsSubmitting(true)
    try {
      await onSave(data)
      onClose()
      reset()
    } catch (error) {
      console.error("Error saving account:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const plan = watch("plan")
  const isEmailVerified = watch("isEmailVerified")
  const isActive = watch("isActive")

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{account ? "Edit Account" : "Create Account"}</SheetTitle>
          <SheetDescription>
            {account
              ? "Make changes to the account here. Click save when you're done."
              : "Add a new account to the system. Click save when you're done."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto space-y-6 p-6 pt-0">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                {...register("accountName")}
                placeholder="Acme Inc Workspace"
              />
              {errors.accountName && (
                <p className="text-sm text-red-600">{errors.accountName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                {...register("ownerName")}
                placeholder="John Doe"
                disabled={!!account}
              />
              {errors.ownerName && (
                <p className="text-sm text-red-600">{errors.ownerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Owner Email</Label>
              <Input
                id="ownerEmail"
                type="email"
                {...register("ownerEmail")}
                placeholder="john@example.com"
                disabled={!!account}
              />
              {errors.ownerEmail && (
                <p className="text-sm text-red-600">{errors.ownerEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Select value={plan} onValueChange={(value) => setValue("plan", value as "FREE" | "DELUXE" | "ONE_TIME")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="DELUXE">Deluxe</SelectItem>
                  <SelectItem value="ONE_TIME">One-Time</SelectItem>
                </SelectContent>
              </Select>
              {errors.plan && (
                <p className="text-sm text-red-600">{errors.plan.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isEmailVerified" className="cursor-pointer">
                Owner Email Verified
              </Label>
              <Switch
                id="isEmailVerified"
                checked={isEmailVerified}
                onCheckedChange={(checked) => setValue("isEmailVerified", !!checked)}
                disabled={!!account}
              />
            </div>

            <div className="flex items-center justify-between space-x-2 pt-2 border-t">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="cursor-pointer font-medium">
                  Account Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isActive ? "Account is active and can be used" : "Account is inactive and cannot be used"}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", !!checked)}
              />
            </div>

            {account && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label>Team Members ({members.length})</Label>
                  {isLoadingMembers && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                
                {isLoadingMembers ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Loading members...
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No team members yet
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-md border bg-muted/30"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {member.name || "Unnamed"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {member.email}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {member.permissions.map((permission) => (
                              <Badge
                                key={permission}
                                variant="outline"
                                className="text-xs px-1.5 py-0"
                              >
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge
                          variant={member.role === "EDITOR" ? "default" : "secondary"}
                          className="ml-2 shrink-0"
                        >
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <SheetFooter className="flex-shrink-0 border-t pt-6 gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

