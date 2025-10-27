import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'
import { canAddTeamMember, getPlanLimits } from '@/config/plans'

// GET all invitations for the user's account (Owner only)
export async function GET() {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Only account owners can view invitations
    if (!context.isOwner) {
      return ApiHandler.forbidden('Only account owners can access invitations')
    }

    // Get all invitations for this account
    const invitations = await prisma.accountInvite.findMany({
      where: { accountId: context.accountId! },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get unique user IDs who sent invitations
    const inviterIds = [...new Set(invitations.map(inv => inv.invitedBy))]
    
    // Fetch inviter details
    const inviters = await prisma.user.findMany({
      where: { id: { in: inviterIds } },
      select: { id: true, name: true },
    })
    
    const inviterMap = new Map(inviters.map(u => [u.id, u.name]))

    const formattedInvitations = invitations.map(invite => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      permissions: invite.permissions,
      invitedBy: invite.invitedBy,
      invitedByName: inviterMap.get(invite.invitedBy) || null,
      token: invite.token,
      expiresAt: invite.expiresAt,
      createdAt: invite.createdAt,
    }))

    return { invitations: formattedInvitations }
  })
}

// POST create a new invitation (Owner only)
export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Only account owners can send invitations
    if (!context.isOwner) {
      return ApiHandler.forbidden('Only account owners can send invitations')
    }

    const body = await request.json()
    const { email, role, permissions } = body

    // Validation
    if (!email || !role || !permissions || !Array.isArray(permissions)) {
      return ApiHandler.badRequest('Missing required fields')
    }

    // Get account with counts
    const account = await prisma.account.findUnique({
      where: { id: context.accountId! },
      select: { 
        id: true,
        plan: true,
        _count: {
          select: {
            members: { where: { isActive: true } },
            invites: true,
          },
        },
      },
    })

    if (!account) {
      return ApiHandler.notFound('Account not found')
    }

    // Check if trying to invite yourself (the account owner)
    if (context.session?.user?.email === email) {
      return ApiHandler.badRequest('You cannot invite yourself. You are already the account owner.')
    }

    // Check plan limits for team members
    const planLimits = getPlanLimits(account.plan)
    const currentMemberCount = account._count.members
    const pendingInvitesCount = account._count.invites
    const totalCount = currentMemberCount + pendingInvitesCount

    // Check if plan allows team members
    if (planLimits.maxTeamMembers === 0) {
      return ApiHandler.error(
        `Team collaboration is not available on the ${planLimits.name} plan. Upgrade to Deluxe to invite team members.`,
        undefined,
        403
      )
    }

    // Check if adding this member would exceed the limit
    if (!canAddTeamMember(account.plan, totalCount)) {
      return ApiHandler.error(
        `You've reached the maximum of ${planLimits.maxTeamMembers} team members for your ${planLimits.name} plan. You currently have ${currentMemberCount} active members and ${pendingInvitesCount} pending invitations.`,
        undefined,
        403
      )
    }

    // Check if a user with this email already exists in the platform
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { 
        id: true,
        email: true,
        ownedAccounts: {
          select: { id: true },
        },
        accountMemberships: {
          select: { id: true, accountId: true },
        },
      },
    })

    if (existingUser) {
      // Check if they own any accounts
      if (existingUser.ownedAccounts && existingUser.ownedAccounts.length > 0) {
        return ApiHandler.error(
          'This user already owns an account and cannot be invited as a team member.',
          undefined,
          409
        )
      }

      // Check if they're already a member of this specific account
      const isMemberOfThisAccount = existingUser.accountMemberships.some(
        membership => membership.accountId === account.id
      )
      
      if (isMemberOfThisAccount) {
        return ApiHandler.error(
          'This user is already a member of your account.',
          undefined,
          409
        )
      }

      // User exists but is a member of another account
      return ApiHandler.error(
        'This email is already registered in the platform. Each user can only belong to one account.',
        undefined,
        409
      )
    }

    // Check if there's already a pending invitation (not expired)
    const existingInvite = await prisma.accountInvite.findFirst({
      where: {
        accountId: account.id,
        email,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
    })

    if (existingInvite) {
      return ApiHandler.error(
        'An active invitation already exists for this email',
        undefined,
        409
      )
    }

    // Create invitation (expires in 7 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Generate a unique token for the invitation
    const crypto = await import('crypto')
    const token = crypto.randomUUID()

    const invitation = await prisma.accountInvite.create({
      data: {
        accountId: account.id,
        email,
        role,
        permissions,
        invitedBy: context.userId,
        token,
        expiresAt,
      },
    })

    // Get account details for email
    const accountWithOwner = await prisma.account.findUnique({
      where: { id: account.id },
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    })

    // Send invitation email
    const inviterName = accountWithOwner?.owner.name || 'Team Owner'
    const accountName = accountWithOwner?.owner.name || 'the team'
    
    const { EmailService } = await import('@/lib/email-service')
    const emailSent = await EmailService.sendInvitationEmail(
      email,
      inviterName,
      accountName,
      invitation.token,
      role
    )

    if (!emailSent) {
      console.error('Failed to send invitation email to:', email)
      // Still continue - the invitation is created
    }

    return {
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        permissions: invitation.permissions,
        invitedBy: invitation.invitedBy,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
      },
    }
  })
}
