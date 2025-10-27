/**
 * Stripe Client Library
 * Server-side Stripe initialization with mode-based configuration
 */

import Stripe from 'stripe'
import { getStripeSecretKey, env } from '@/config/env'

// Initialize Stripe with the appropriate secret key based on mode
const secretKey = getStripeSecretKey()

if (!secretKey) {
  console.warn(
    `[Stripe] No secret key found for mode: ${env.STRIPE_MODE}. Stripe functionality will be disabled.`
  )
}

export const stripe = new Stripe(secretKey || 'sk_test_placeholder', {
  apiVersion: '2025-09-30.clover',
  typescript: true,
  appInfo: {
    name: 'AMZ Product Label Checker',
    version: '1.0.0',
  },
})

/**
 * Get or create a Stripe customer from email
 */
export async function getOrCreateCustomer(
  email: string, 
  name?: string | null,
  accountId?: string
) {
  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    const customer = existingCustomers.data[0]
    
    // Update metadata with account ID if provided and not already set
    if (accountId && !customer.metadata?.accountId) {
      return await stripe.customers.update(customer.id, {
        metadata: {
          ...customer.metadata,
          accountId,
          created_by: 'amz-label-checker',
        },
      })
    }
    
    return customer
  }

  // Create new customer with metadata
  return await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      created_by: 'amz-label-checker',
      ...(accountId && { accountId }), // Save our internal account ID
    },
  })
}

/**
 * Create a checkout session for a plan
 * Following latest Stripe API best practices (2024+)
 */
export async function createCheckoutSession(params: {
  customerId: string
  priceId: string
  mode: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const baseConfig: Stripe.Checkout.SessionCreateParams = {
    customer: params.customerId,
    mode: params.mode,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
    // Modern Stripe best practices
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    // Automatic payment methods enabled by default (2023-08-16 API change)
    payment_method_types: ['card'], // Can add more: ['card', 'link', 'us_bank_account']
  }

  // payment_intent_data is ONLY for 'payment' mode, NOT for 'subscription' mode
  if (params.mode === 'payment') {
    return await stripe.checkout.sessions.create({
      ...baseConfig,
      payment_intent_data: {
        setup_future_usage: 'off_session', // Allow charging customer later for one-time payments
      },
    })
  }

  // For subscriptions, payment method is automatically saved for future billing
  // No need for payment_intent_data in subscription mode
  return await stripe.checkout.sessions.create(baseConfig)
}

/**
 * Create a billing portal session
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

