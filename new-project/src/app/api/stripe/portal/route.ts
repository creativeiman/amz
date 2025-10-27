/**
 * Stripe Customer Portal API
 * Creates a billing portal session for customers to manage their subscriptions
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createPortalSession } from '@/lib/stripe-client'
import { getAccountByOwnerId } from '@/db/queries/accounts'
import { publicEnv } from '@/config/env'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's account
    const account = await getAccountByOwnerId(session.user.id)

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Check if account has a Stripe customer ID
    if (!account.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing information found. Please subscribe to a plan first.' },
        { status: 400 }
      )
    }

    // Create portal session
    const portalSession = await createPortalSession(
      account.stripeCustomerId,
      `${publicEnv.NEXT_PUBLIC_APP_URL}/dashboard/billing`
    )

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error) {
    console.error('[Stripe Portal] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}

