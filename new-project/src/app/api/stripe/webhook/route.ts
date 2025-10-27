/**
 * Stripe Webhook Handler
 * Processes Stripe webhook events for payment and subscription management
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-client'
import { getStripeWebhookSecret, getStripeDeluxePriceId, getStripeOneTimePriceId } from '@/config/env'
import { updateAccountPlan, createPaymentRecord } from '@/lib/stripe-utils'
import { getAccountByStripeCustomerId } from '@/db/queries/accounts'
import Stripe from 'stripe'
import { Plan } from '@prisma/client'

// Disable body parsing so we can verify the webhook signature
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('[Stripe Webhook] Missing signature')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = getStripeWebhookSecret()

  if (!webhookSecret) {
    console.error('[Stripe Webhook] Webhook secret not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const accountId = session.metadata?.accountId
        const planId = session.metadata?.planId as 'DELUXE' | 'ONE_TIME'

        if (!accountId || !planId) {
          console.error('[Stripe Webhook] Missing metadata in checkout session')
          break
        }

        console.log(`[Stripe Webhook] Checkout completed for account: ${accountId}, plan: ${planId}`)

        // Get subscription ID if it's a subscription
        const subscriptionId =
          typeof session.subscription === 'string' ? session.subscription : null

        // Update account plan
        await updateAccountPlan({
          accountId,
          plan: planId,
          subscriptionStatus: subscriptionId ? 'ACTIVE' : 'INACTIVE',
          stripeSubscriptionId: subscriptionId,
        })

        // Create payment record ONLY for one-time payments
        // For subscriptions, invoice.payment_succeeded will create the payment record (with invoice URL)
        if (!subscriptionId) {
          const amount = session.amount_total || 0
          const paymentIntentId =
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id || session.id

          // For one-time payments, fetch the receipt URL from the PaymentIntent
          let receiptUrl: string | null = null
          if (paymentIntentId) {
            try {
              const paymentIntent = (await stripe.paymentIntents.retrieve(paymentIntentId, {
                expand: ['charges'],
              })) as unknown as Stripe.PaymentIntent & { charges: Stripe.ApiList<Stripe.Charge> }
              // Get receipt URL from the first charge
              if (paymentIntent.charges?.data?.[0]?.receipt_url) {
                receiptUrl = paymentIntent.charges.data[0].receipt_url
                console.log(`[Stripe Webhook] Receipt URL found for one-time payment: ${receiptUrl}`)
              }
            } catch (error) {
              console.error('[Stripe Webhook] Error fetching receipt URL:', error)
            }
          }

          await createPaymentRecord({
            accountId,
            stripePaymentId: paymentIntentId,
            amount,
            currency: session.currency || 'usd',
            plan: planId,
            status: 'COMPLETED',
            invoiceUrl: receiptUrl, // ✅ Use receipt URL for one-time payments
          })
          console.log(`[Stripe Webhook] Payment record created for one-time purchase`)
        } else {
          console.log(`[Stripe Webhook] Subscription payment record will be created by invoice.payment_succeeded`)
        }

        console.log(`[Stripe Webhook] Successfully processed checkout for account: ${accountId}`)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id

        if (!customerId) {
          console.error('[Stripe Webhook] No customer ID in invoice')
          break
        }

        const account = await getAccountByStripeCustomerId(customerId)

        if (!account) {
          console.error(`[Stripe Webhook] Account not found for customer: ${customerId}`)
          break
        }

        console.log(`[Stripe Webhook] Payment succeeded for account: ${account.id}`)

        // Get the subscription to determine the correct plan
        const invoiceWithSub = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription }
        const subscriptionId = typeof invoiceWithSub.subscription === 'string' 
          ? invoiceWithSub.subscription 
          : invoiceWithSub.subscription?.id

        let planForPayment: Plan = account.plan // Default to account's current plan

        // If this is a subscription invoice, get the plan from the subscription
        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            const priceId = subscription.items.data[0]?.price.id

            // Map price ID to plan
            if (priceId === getStripeDeluxePriceId()) {
              planForPayment = 'DELUXE'
            } else if (priceId === getStripeOneTimePriceId()) {
              planForPayment = 'ONE_TIME'
            }
          } catch (error) {
            console.error('[Stripe Webhook] Error fetching subscription for plan:', error)
            // Fall back to account.plan
          }
        }

        // Ensure subscription is active
        if (subscriptionId) {
          await updateAccountPlan({
            accountId: account.id,
            plan: planForPayment,
            subscriptionStatus: 'ACTIVE',
            stripeSubscriptionId: subscriptionId,
          })
        }

        // Create payment record with correct plan
        await createPaymentRecord({
          accountId: account.id,
          stripePaymentId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          plan: planForPayment, // ✅ Use correct plan from subscription
          status: 'COMPLETED',
          invoiceUrl: invoice.hosted_invoice_url || null,
        })

        console.log(`[Stripe Webhook] ✅ Payment record created with plan: ${planForPayment}`)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id

        if (!customerId) {
          console.error('[Stripe Webhook] No customer ID in failed invoice')
          break
        }

        const account = await getAccountByStripeCustomerId(customerId)

        if (!account) {
          console.error(`[Stripe Webhook] Account not found for customer: ${customerId}`)
          break
        }

        console.log(`[Stripe Webhook] Payment failed for account: ${account.id}`)

        // Update subscription status to PAST_DUE
        await updateAccountPlan({
          accountId: account.id,
          plan: account.plan,
          subscriptionStatus: 'PAST_DUE',
          stripeSubscriptionId: account.stripeSubscriptionId,
        })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id

        if (!customerId) {
          console.error('[Stripe Webhook] No customer ID in subscription update')
          break
        }

        const account = await getAccountByStripeCustomerId(customerId)

        if (!account) {
          console.error(`[Stripe Webhook] Account not found for customer: ${customerId}`)
          break
        }

        // Check if subscription is scheduled to cancel (cancel_at is set)
        if (subscription.cancel_at) {
          const cancelDate = new Date(subscription.cancel_at * 1000)
          console.log(`[Stripe Webhook] Subscription scheduled to cancel on ${cancelDate.toISOString()} for account: ${account.id}`)
          
          // Update account with cancellation date, but keep status ACTIVE until then
          const { prisma } = await import('@/db/client')
          await prisma.account.update({
            where: { id: account.id },
            data: {
              subscriptionCancelAt: cancelDate,
              subscriptionStatus: 'ACTIVE', // Still active until cancel_at date
            },
          })
        } else {
          // User reactivated subscription (cancel_at was cleared)
          console.log(`[Stripe Webhook] Subscription reactivated for account: ${account.id}`)
          
          const { prisma } = await import('@/db/client')
          await prisma.account.update({
            where: { id: account.id },
            data: {
              subscriptionCancelAt: null, // Clear scheduled cancellation
              subscriptionStatus: 'ACTIVE',
            },
          })
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id

        if (!customerId) {
          console.error('[Stripe Webhook] No customer ID in deleted subscription')
          break
        }

        const account = await getAccountByStripeCustomerId(customerId)

        if (!account) {
          console.error(`[Stripe Webhook] Account not found for customer: ${customerId}`)
          break
        }

        console.log(`[Stripe Webhook] Subscription canceled for account: ${account.id}`)

        // Downgrade to FREE plan (this fires when subscription actually ends)
        const { prisma } = await import('@/db/client')
        await prisma.account.update({
          where: { id: account.id },
          data: {
            plan: 'FREE',
            subscriptionStatus: 'CANCELED',
            stripeSubscriptionId: null,
            subscriptionCancelAt: null, // Clear cancellation date
            scanLimitPerMonth: 1, // FREE plan limit
          },
        })

        break
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge
        
        // Only process charges that have a payment_intent (one-time payments from checkout)
        const paymentIntentId = typeof charge.payment_intent === 'string' 
          ? charge.payment_intent 
          : charge.payment_intent?.id

        if (!paymentIntentId) {
          console.log('[Stripe Webhook] Charge has no payment_intent, skipping')
          break
        }

        const customerId = typeof charge.customer === 'string' ? charge.customer : charge.customer?.id
        if (!customerId) {
          console.log('[Stripe Webhook] Charge has no customer, skipping')
          break
        }

        // Find the payment record by payment intent ID
        const { prisma } = await import('@/db/client')
        const payment = await prisma.payment.findFirst({
          where: { stripePaymentId: paymentIntentId },
        })

        if (!payment) {
          console.log(`[Stripe Webhook] No payment record found for PaymentIntent: ${paymentIntentId}`)
          break
        }

        // Update payment record with receipt URL if it doesn't have one
        if (!payment.invoiceUrl && charge.receipt_url) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { invoiceUrl: charge.receipt_url },
          })
          console.log(`[Stripe Webhook] ✅ Updated payment ${payment.id} with receipt URL: ${charge.receipt_url}`)
        }

        break
      }

      case 'charge.updated': {
        const charge = event.data.object as Stripe.Charge
        
        // Check if this charge has a receipt URL
        if (!charge.receipt_url) {
          console.log('[Stripe Webhook] charge.updated has no receipt_url, skipping')
          break
        }

        const paymentIntentId = typeof charge.payment_intent === 'string' 
          ? charge.payment_intent 
          : charge.payment_intent?.id

        if (!paymentIntentId) {
          console.log('[Stripe Webhook] Charge has no payment_intent, skipping')
          break
        }

        // Find the payment record by payment intent ID
        const { prisma } = await import('@/db/client')
        const payment = await prisma.payment.findUnique({
          where: { stripePaymentId: paymentIntentId },
        })

        if (!payment) {
          console.log(`[Stripe Webhook] No payment record found for PaymentIntent: ${paymentIntentId} (will be created by checkout.session.completed)`)
          break
        }

        // Update payment record with receipt URL
        await prisma.payment.update({
          where: { id: payment.id },
          data: { invoiceUrl: charge.receipt_url },
        })
        console.log(`[Stripe Webhook] ✅ Updated payment ${payment.id} with receipt URL from charge.updated`)

        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

