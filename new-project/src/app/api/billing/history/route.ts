/**
 * Billing History API
 * Returns payment history for the authenticated user's account
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAccountByOwnerId } from '@/db/queries/accounts'
import { getUserPayments } from '@/db/queries/payments'

export async function GET(request: NextRequest) {
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

    // Get payment history
    const payments = await getUserPayments(account.id)

    // Format payments for frontend
    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      date: payment.createdAt,
      amount: payment.amount / 100, // Convert from cents to dollars
      currency: payment.currency.toUpperCase(),
      plan: payment.plan,
      status: payment.status,
      invoiceUrl: payment.invoiceUrl,
    }))

    return NextResponse.json({
      payments: formattedPayments,
    })
  } catch (error) {
    console.error('[Billing History] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch billing history' },
      { status: 500 }
    )
  }
}

