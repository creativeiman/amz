import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'
import { cancelSubscription } from '@/lib/stripe-client'

/**
 * Downgrade user to FREE plan
 * Validates team members and cancels Stripe subscription
 */
export async function POST() {
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
        stripeSubscriptionId: true,
      },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Prevent ONE_TIME users from downgrading
    if (account.plan === 'ONE_TIME') {
      return NextResponse.json(
        { error: 'Cannot downgrade from one-time plan. You have already paid for lifetime access.' },
        { status: 400 }
      )
    }

    // Already on FREE plan
    if (account.plan === 'FREE') {
      return NextResponse.json(
        { error: 'Already on FREE plan' },
        { status: 400 }
      )
    }

    // Validate no team members or pending invites
    const activeMembers = await prisma.accountMember.count({
      where: {
        accountId: account.id,
        isActive: true,
      },
    })

    const pendingInvites = await prisma.accountInvite.count({
      where: {
        accountId: account.id,
        expiresAt: {
          gt: new Date(), // Invitation hasn't expired yet
        },
      },
    })

    if (activeMembers > 0 || pendingInvites > 0) {
      return NextResponse.json(
        {
          error: 'Cannot downgrade while you have team members or pending invitations',
          activeMembers,
          pendingInvites,
        },
        { status: 400 }
      )
    }

    // Cancel Stripe subscription if exists
    if (account.stripeSubscriptionId) {
      try {
        console.log(`[Downgrade] Canceling Stripe subscription: ${account.stripeSubscriptionId}`)
        await cancelSubscription(account.stripeSubscriptionId)
        console.log(`[Downgrade] Successfully canceled subscription`)
      } catch (error) {
        console.error('[Downgrade] Error canceling subscription:', error)
        // Continue with downgrade even if Stripe call fails
        // The webhook will handle cleanup if subscription is already canceled
      }
    }

    // Update account to FREE plan
    await prisma.account.update({
      where: { id: account.id },
      data: {
        plan: 'FREE',
        subscriptionStatus: 'CANCELED',
        stripeSubscriptionId: null,
        scanLimitPerMonth: 1, // FREE plan limit
        subscriptionCancelAt: null, // Clear any scheduled cancellation
      },
    })

    console.log(`[Downgrade] Successfully downgraded account ${account.id} to FREE`)

    return NextResponse.json({
      success: true,
      message: 'Successfully downgraded to FREE plan',
      plan: 'FREE',
    })
  } catch (error) {
    console.error('[Downgrade] Error:', error)
    return NextResponse.json(
      { error: 'Failed to downgrade account' },
      { status: 500 }
    )
  }
}

