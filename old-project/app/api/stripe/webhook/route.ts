import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { UserService } from '../../../../lib/userService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get customer email from session
        const customerEmail = session.customer_details?.email
        const planId = session.metadata?.planId

        if (customerEmail && planId) {
          // Update user plan in database
          await UserService.updateUserPlan(customerEmail, planId as 'deluxe' | 'one-time')
          console.log(`Updated user ${customerEmail} to plan ${planId}`)
        }
        break
      }
      
      case 'invoice.payment_succeeded': {
        // Handle recurring subscription payments
        const invoice = event.data.object as Stripe.Invoice
        const customerEmail = invoice.customer_email
        
        if (customerEmail) {
          // Ensure user stays on deluxe plan
          await UserService.updateUserPlan(customerEmail, 'deluxe')
          console.log(`Renewed subscription for user ${customerEmail}`)
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        if (customerId) {
          // Get customer details to find email
          const customer = await stripe.customers.retrieve(customerId)
          if (customer && !customer.deleted && customer.email) {
            // Downgrade user to free plan
            await UserService.updateUserPlan(customer.email, 'free')
            console.log(`Downgraded user ${customer.email} to free plan`)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
