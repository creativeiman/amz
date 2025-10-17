import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'
import { canAddTeamMember, getRemainingSlots, getPlanLimits } from '@/config/plans'

// GET all invitations for the user's account (Owner only)
export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only account owners can view invitations
    if (session.user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden: Only account owners can access this' }, { status: 403 })
    }

    // Get user's account (must be owner)
    const account = await prisma.account.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    })

    if (!account) {
      console.error(`No account found for user: ${session.user.id} (${session.user.email})`)
      return NextResponse.json({ error: 'No account found. Only account owners can manage invitations.' }, { status: 404 })
    }

    // Get all invitations for this account
    const invitations = await prisma.accountInvite.findMany({
      where: { accountId: account.id },
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

    return NextResponse.json({ invitations: formattedInvitations }, { status: 200 })
  } catch (error) {
    console.error('Error fetching invitations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create a new invitation (Owner only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only account owners can send invitations
    if (session.user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden: Only account owners can send invitations' }, { status: 403 })
    }

    const body = await request.json()
    const { email, role, permissions } = body

    // Validation
    if (!email || !role || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user's account (must be owner)
    const account = await prisma.account.findFirst({
      where: { ownerId: session.user.id },
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
      return NextResponse.json({ error: 'No account found. Only account owners can send invitations.' }, { status: 404 })
    }

    // Check if trying to invite yourself (the account owner)
    if (session.user.email === email) {
      return NextResponse.json(
        { error: 'You cannot invite yourself. You are already the account owner.' },
        { status: 400 }
      )
    }

    // Check plan limits for team members
    const planLimits = getPlanLimits(account.plan)
    const currentMemberCount = account._count.members
    const pendingInvitesCount = account._count.invites
    const totalCount = currentMemberCount + pendingInvitesCount

    // Check if plan allows team members
    if (planLimits.maxTeamMembers === 0) {
      return NextResponse.json(
        { 
          error: `Team collaboration is not available on the ${planLimits.name} plan. Upgrade to Deluxe to invite team members.`,
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // Check if adding this member would exceed the limit
    if (!canAddTeamMember(account.plan, totalCount)) {
      const remaining = getRemainingSlots(account.plan, totalCount)
      return NextResponse.json(
        { 
          error: `You've reached the maximum of ${planLimits.maxTeamMembers} team members for your ${planLimits.name} plan. You currently have ${currentMemberCount} active members and ${pendingInvitesCount} pending invitations.`,
          limitReached: true,
          currentMembers: currentMemberCount,
          pendingInvites: pendingInvitesCount,
          maxAllowed: planLimits.maxTeamMembers,
        },
        { status: 403 }
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
        return NextResponse.json(
          { error: 'This user already owns an account and cannot be invited as a team member.' },
          { status: 409 }
        )
      }

      // Check if they're already a member of this specific account
      const isMemberOfThisAccount = existingUser.accountMemberships.some(
        membership => membership.accountId === account.id
      )
      
      if (isMemberOfThisAccount) {
        return NextResponse.json(
          { error: 'This user is already a member of your account.' },
          { status: 409 }
        )
      }

      // User exists but is a member of another account
      return NextResponse.json(
        { error: 'This email is already registered in the platform. Each user can only belong to one account.' },
        { status: 409 }
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
      return NextResponse.json(
        { error: 'An active invitation already exists for this email' },
        { status: 409 }
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
        invitedBy: session.user.id,
        token,
        expiresAt,
      },
    })

    // Log invitation link for testing (TODO: Send via email in production)
    const invitationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/accept-invite?token=${invitation.token}`
    console.log('\n🔗 Invitation Link Generated:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📧 To: ${email}`)
    console.log(`👤 Role: ${role}`)
    console.log(`🔑 Token: ${invitation.token}`)
    console.log(`🌐 Link: ${invitationLink}`)
    console.log(`⏰ Expires: ${expiresAt.toLocaleString()}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // TODO: Send invitation email
    // await sendInvitationEmail(email, invitation.token, account.name)

    return NextResponse.json(
      {
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          permissions: invitation.permissions,
          invitedBy: invitation.invitedBy,
          expiresAt: invitation.expiresAt,
          createdAt: invitation.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

