"use client"

import * as React from "react"
import { Plus, Mail, UserCheck, Trash2, MoreHorizontal, UserX, UserPlus, Copy, Crown } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getPlanLimits, canAddTeamMember } from "@/config/plans"
import { api, ApiError } from "@/lib/api-client"
import { useFreshAccount } from "@/hooks/use-fresh-account"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { InviteMemberSheet } from "./invite-member-sheet"
import { LoadingPage } from "@/components/loading"

type AccountPermission = "SCAN_CREATE" | "SCAN_VIEW" | "SCAN_EDIT" | "SCAN_DELETE" | "TEAM_VIEW" | "TEAM_INVITE" | "TEAM_REMOVE"

type Member = {
  id: string
  userId: string
  name: string | null
  email: string
  role: "EDITOR" | "VIEWER"
  permissions: AccountPermission[]
  isActive: boolean
  joinedAt: Date
}

type Invitation = {
  id: string
  email: string
  role: "EDITOR" | "VIEWER"
  permissions: AccountPermission[]
  invitedBy: string
  invitedByName: string | null
  token: string
  expiresAt: Date
  createdAt: Date
}

export default function TeamPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { account } = useFreshAccount() // ✅ Use centralized hook
  const [members, setMembers] = React.useState<Member[]>([])
  const [invitations, setInvitations] = React.useState<Invitation[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false)
  const [memberToRemove, setMemberToRemove] = React.useState<Member | null>(null)
  const [inviteToCancel, setInviteToCancel] = React.useState<Invitation | null>(null)

  // Check if user is an account owner
  const isAccountOwner = Boolean((session?.user as { isOwner?: boolean })?.isOwner)

  // Get current plan from fresh account data
  const currentPlan = account?.plan || 'FREE'

  // Redirect non-owners to dashboard
  React.useEffect(() => {
    if (status === 'loading') return
    
    if (!session || !isAccountOwner) {
      toast.error('Access denied. Only account owners can manage team members.')
      router.push('/dashboard')
    }
  }, [session, isAccountOwner, status, router])

  // Fetch team members
  const fetchMembers = React.useCallback(async () => {
    // Only fetch if user is an account owner
    if (!isAccountOwner) return
    
    try {
      const data = await api.get<{ members: typeof members }>("/dashboard/api/team/members")
      setMembers(data.members || [])
    } catch (error) {
      console.error("Error fetching members:", error)
      const message = error instanceof ApiError ? error.message : "Failed to load team members"
      toast.error(message)
    }
  }, [isAccountOwner])

  // Fetch invitations
  const fetchInvitations = React.useCallback(async () => {
    // Only fetch if user is an account owner
    if (!isAccountOwner) return
    
    try {
      const data = await api.get<{ invitations: typeof invitations }>("/dashboard/api/team/invitations")
      setInvitations(data.invitations || [])
    } catch (error) {
      console.error("Error fetching invitations:", error)
      const message = error instanceof ApiError ? error.message : "Failed to load invitations"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [isAccountOwner])

  React.useEffect(() => {
    // Only fetch data if user is an account owner (plan fetched by hook)
    if (status !== 'loading' && isAccountOwner) {
      fetchMembers()
      fetchInvitations()
    } else if (status !== 'loading' && !isAccountOwner) {
      setIsLoading(false)
    }
  }, [fetchMembers, fetchInvitations, isAccountOwner, status])

  // Handle invite member
  const handleInvite = async (data: {
    email: string
    role: "EDITOR" | "VIEWER"
    permissions: AccountPermission[]
  }): Promise<boolean> => {
    try {
      await api.post("/dashboard/api/team/invitations", data)
      
      toast.success("Invitation sent successfully")
      fetchInvitations()
      setIsInviteDialogOpen(false)
      return true
    } catch (error) {
      console.error("Error sending invitation:", error)
      const errorMessage = error instanceof ApiError ? error.message : "Failed to send invitation"
      
      // Check for specific error types in the message
      if (errorMessage.includes("Upgrade") || errorMessage.includes("not available")) {
        toast.error(errorMessage, {
          duration: 5000,
          action: {
            label: 'Upgrade',
            onClick: () => router.push('/dashboard/billing'),
          },
        })
      } else {
        toast.error(errorMessage, {
          duration: 5000,
        })
      }
      
      return false
    }
  }

  // Handle toggle member status
  const handleToggleMemberStatus = async (memberId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/dashboard/api/team/members/${memberId}`, { isActive: !currentStatus })
      toast.success(`Member ${!currentStatus ? "activated" : "deactivated"} successfully`)
      fetchMembers()
    } catch (error) {
      console.error("Error updating member status:", error)
      const message = error instanceof ApiError ? error.message : "Failed to update member status"
      toast.error(message)
    }
  }

  // Handle remove member
  const handleRemoveMember = async (memberId: string) => {
    try {
      await api.delete(`/dashboard/api/team/members/${memberId}`)
      toast.success("Member removed successfully")
      fetchMembers()
      setMemberToRemove(null)
    } catch (error) {
      console.error("Error removing member:", error)
      const message = error instanceof ApiError ? error.message : "Failed to remove member"
      toast.error(message)
    }
  }

  // Handle cancel invitation
  const handleCancelInvite = async (inviteId: string) => {
    try {
      await api.delete(`/dashboard/api/team/invitations/${inviteId}`)
      toast.success("Invitation cancelled")
      fetchInvitations()
      setInviteToCancel(null)
    } catch (error) {
      console.error("Error cancelling invitation:", error)
      const message = error instanceof ApiError ? error.message : "Failed to cancel invitation"
      toast.error(message)
    }
  }

  // Handle resend invitation
  const handleResendInvite = async (inviteId: string) => {
    try {
      await api.post(`/dashboard/api/team/invitations/${inviteId}/resend`)
      toast.success("Invitation resent successfully")
      fetchInvitations()
    } catch (error) {
      console.error("Error resending invitation:", error)
      const message = error instanceof ApiError ? error.message : "Failed to resend invitation"
      toast.error(message)
    }
  }

  // Handle copy invitation link
  const handleCopyInviteLink = async (token: string) => {
    try {
      const baseUrl = window.location.origin
      const inviteLink = `${baseUrl}/accept-invite?token=${token}`
      
      await navigator.clipboard.writeText(inviteLink)
      toast.success("Invitation link copied to clipboard!")
    } catch (error) {
      console.error("Error copying link:", error)
      toast.error("Failed to copy link")
    }
  }

  // Show loading while checking session
  if (status === 'loading' || isLoading) {
    return <LoadingPage />
  }

  // Don't render anything if not an owner (will redirect)
  if (!isAccountOwner) {
    return null
  }

  // Get current plan limits (using fresh API data, not JWT!)
  const planLimits = getPlanLimits(currentPlan)
  const totalMembers = members.length + invitations.length
  const canInvite = canAddTeamMember(currentPlan, totalMembers)
  const remainingSlots = planLimits.maxTeamMembers - totalMembers

  console.log('[Team Page] Plan limits:', { currentPlan, maxTeamMembers: planLimits.maxTeamMembers, canInvite })

  return (
    <div className="space-y-6">
      {/* Plan limits banner - only show for FREE plan */}
      {currentPlan === 'FREE' && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <Crown className="h-5 w-5" />
              Upgrade for Team Collaboration
            </CardTitle>
            <CardDescription className="text-amber-800 dark:text-amber-200">
              Team collaboration is not available on your current plan. Upgrade to Deluxe ($29.99/month) or One-Time ($99.99 forever) to invite up to 2 team members and unlock unlimited scans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" asChild>
              <a href="/pricing">
                <Crown className="mr-2 h-4 w-4" />
                View Plans
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and invitations
            {planLimits.maxTeamMembers > 0 && (
              <span className="block mt-1 text-sm">
                <strong>{remainingSlots}</strong> of <strong>{planLimits.maxTeamMembers}</strong> team slots available
              </span>
            )}
          </p>
        </div>
        <Button 
          onClick={() => setIsInviteDialogOpen(true)}
          disabled={!canInvite}
        >
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">
            <UserCheck className="mr-2 h-4 w-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="invitations">
            <Mail className="mr-2 h-4 w-4" />
            Invitations ({invitations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                People who have access to this account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No team members yet. Invite someone to get started!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id} className={!member.isActive ? "opacity-60" : ""}>
                        <TableCell className="font-medium">
                          {member.name || "Unnamed"}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge variant={member.role === "EDITOR" ? "default" : "secondary"}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.isActive ? "default" : "secondary"}>
                            {member.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleToggleMemberStatus(member.id, member.isActive)}
                              >
                                {member.isActive ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setMemberToRemove(member)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Invitations sent to join your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending invitations
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited By</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invite) => {
                      const isExpired = new Date(invite.expiresAt) < new Date()
                      return (
                        <TableRow key={invite.id} className={isExpired ? "opacity-60" : ""}>
                          <TableCell className="font-medium">{invite.email}</TableCell>
                          <TableCell>
                            <Badge variant={invite.role === "EDITOR" ? "default" : "secondary"}>
                              {invite.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{invite.invitedByName || "N/A"}</TableCell>
                          <TableCell>
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {new Date(invite.expiresAt).toLocaleDateString()}
                              {isExpired && (
                                <Badge variant="destructive" className="text-xs">
                                  Expired
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleCopyInviteLink(invite.token)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleResendInvite(invite.id)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Resend
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setInviteToCancel(invite)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Member Sheet */}
      <InviteMemberSheet
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        onInvite={handleInvite}
      />

      {/* Remove Member Confirmation */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <div>
                  Are you sure you want to remove this team member? They will lose access to the account.
                </div>
                {memberToRemove && (
                  <div className="mt-4 rounded-md bg-muted p-3 space-y-1">
                    <div className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">Name:</span> {memberToRemove.name || "Unnamed"}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">Email:</span> {memberToRemove.email}
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && handleRemoveMember(memberToRemove.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Invitation Confirmation */}
      <AlertDialog
        open={!!inviteToCancel}
        onOpenChange={(open) => !open && setInviteToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <div>
                  Are you sure you want to cancel this invitation?
                </div>
                {inviteToCancel && (
                  <div className="mt-4 rounded-md bg-muted p-3">
                    <div className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">Email:</span> {inviteToCancel.email}
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => inviteToCancel && handleCancelInvite(inviteToCancel.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
