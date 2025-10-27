/**
 * Stripe Checkout Session API
 * Creates a Stripe checkout session for purchasing plans
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createCheckoutSession, cancelSubscription } from '@/lib/stripe-client'
import { getOrCreateStripeCustomer } from '@/lib/stripe-utils'
import { getAccountByOwnerId } from '@/db/queries/accounts'
import { publicEnv, getStripeDeluxePriceId, getStripeOneTimePriceId } from '@/config/env'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()

    if (!planId || !['DELUXE', 'ONE_TIME'].includes(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan ID. Must be DELUXE or ONE_TIME' },
        { status: 400 }
      )
    }

    // Get user's account
    const account = await getAccountByOwnerId(session.user.id)

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(account.id)

    // Cancel existing subscription if user has one
    // This prevents double-charging when switching plans
    if (account.stripeSubscriptionId) {
      try {
        console.log(`[Stripe Checkout] Canceling existing subscription: ${account.stripeSubscriptionId}`)
        await cancelSubscription(account.stripeSubscriptionId)
        console.log(`[Stripe Checkout] Successfully canceled subscription`)
      } catch (error) {
        console.error('[Stripe Checkout] Error canceling subscription:', error)
        // Continue anyway - the new purchase should still work
      }
    }

    // Determine price ID and mode based on plan (auto-switches between test/live)
    const priceId =
      planId === 'DELUXE'
        ? getStripeDeluxePriceId()
        : getStripeOneTimePriceId()

    const mode = planId === 'DELUXE' ? 'subscription' : 'payment'

    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for plan: ${planId}` },
        { status: 500 }
      )
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId,
      priceId,
      mode,
      successUrl: `${publicEnv.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancelUrl: `${publicEnv.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        accountId: account.id,
        planId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error('[Stripe Checkout] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

