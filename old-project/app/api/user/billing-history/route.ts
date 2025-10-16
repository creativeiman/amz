import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email
    const userPlan = (session.user as any)?.plan || 'free'

    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!isSupabaseConfigured) {
      // Return empty billing history for demo purposes
      return NextResponse.json({
        billingHistory: [],
        message: 'Supabase not configured - using demo mode'
      })
    }

    console.log('Fetching billing history for user:', userEmail, 'Plan:', userPlan)

    // For now, create mock billing history based on user plan
    let billingHistory: any[] = []

    if (userPlan === 'deluxe') {
      // Create mock payment history for deluxe user
      billingHistory = [
        {
          id: 'deluxe-payment-1',
          description: 'Deluxe Plan - Monthly Subscription',
          amount: 29.99,
          date: new Date().toISOString(),
          status: 'paid',
          invoice: 'INV-DELUXE-001'
        }
      ]
    } else if (userPlan === 'one-time') {
      // Create mock payment history for one-time user
      billingHistory = [
        {
          id: 'onetime-payment-1',
          description: 'One-Time Plan - Single Payment',
          amount: 59.99,
          date: new Date().toISOString(),
          status: 'paid',
          invoice: 'INV-ONETIME-001'
        }
      ]
    }

    console.log('Returning billing history:', billingHistory)

    return NextResponse.json({
      billingHistory,
      totalPayments: billingHistory.length,
      totalAmount: billingHistory.reduce((sum: number, payment: any) => sum + payment.amount, 0)
    })

  } catch (error) {
    console.error('Billing history API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
