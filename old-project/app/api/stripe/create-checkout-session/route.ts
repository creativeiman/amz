import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { UserService } from '../../../../lib/userService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { planId, price, recurring } = await request.json()

    if (!planId || !price) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planId === 'deluxe' ? 'Deluxe Plan' : 'One-Time Use Plan',
              description: planId === 'deluxe' 
                ? 'Unlimited scans, detailed analysis, priority updates, and team collaboration'
                : 'In-depth review for a single product, perfect for geo-expansion',
            },
            unit_amount: price,
            recurring: recurring ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: recurring ? 'subscription' : 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/auth/post-payment?success=true&plan=${planId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        planId,
        price: price.toString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
