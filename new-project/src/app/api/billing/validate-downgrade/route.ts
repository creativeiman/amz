import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

/**
 * Validate if user can downgrade to FREE plan
 * Checks for active team members and pending invitations
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's account
    const account = await prisma.account.findFirst({
      where: {
        ownerId: session.user.id,
        isActive: true,
      },
      select: {
        id: true,
        plan: true,
      },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Get active team members (excluding owner)
    const activeMembers = await prisma.accountMember.findMany({
      where: {
        accountId: account.id,
        isActive: true,
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Get pending invitations (not expired yet)
    const pendingInvites = await prisma.accountInvite.findMany({
      where: {
        accountId: account.id,
        expiresAt: {
          gt: new Date(), // Invitation hasn't expired yet
        },
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    const canDowngrade = activeMembers.length === 0 && pendingInvites.length === 0

    return NextResponse.json({
      canDowngrade,
      activeMembers: activeMembers.map((m) => ({
        id: m.id,
        name: m.user.name,
        email: m.user.email,
      })),
      pendingInvites: pendingInvites.map((i) => ({
        id: i.id,
        email: i.email,
        createdAt: i.createdAt,
      })),
      totalBlocking: activeMembers.length + pendingInvites.length,
    })
  } catch (error) {
    console.error('[Validate Downgrade] Error:', error)
    return NextResponse.json(
      { error: 'Failed to validate downgrade eligibility' },
      { status: 500 }
    )
  }
}

