/**
 * Stripe Utility Functions
 * Helper functions for customer and payment management
 */

import { prisma } from '@/db/client'
import { Plan, SubscriptionStatus, Prisma } from '@prisma/client'
import { getOrCreateCustomer } from './stripe-client'
import { PLAN_LIMITS } from '@/config/plans'

/**
 * Get or create Stripe customer for an account
 */
export async function getOrCreateStripeCustomer(accountId: string) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      owner: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  })

  if (!account) {
    throw new Error('Account not found')
  }

  // If account already has a Stripe customer, return it
  if (account.stripeCustomerId) {
    return account.stripeCustomerId
  }

  // Create new Stripe customer (pass our account ID to save in Stripe metadata)
  const customer = await getOrCreateCustomer(
    account.owner.email, 
    account.owner.name,
    accountId // Our internal ID saved in Stripe for bidirectional lookup
  )

  // Update account with Stripe customer ID
  await prisma.account.update({
    where: { id: accountId },
    data: {
      stripeCustomerId: customer.id,
    },
  })

  return customer.id
}

/**
 * Update account plan and subscription status
 */
export async function updateAccountPlan(params: {
  accountId: string
  plan: Plan
  subscriptionStatus: SubscriptionStatus
  stripeSubscriptionId?: string | null
}) {
  const { accountId, plan, subscriptionStatus, stripeSubscriptionId } = params

  // Get current plan limits
  const planLimits = getPlanLimitsForPlan(plan)

  const updateData: Prisma.AccountUpdateInput = {
    plan,
    subscriptionStatus,
    scanLimitPerMonth: planLimits.scanLimitPerMonth,
  }

  if (stripeSubscriptionId !== undefined) {
    updateData.stripeSubscriptionId = stripeSubscriptionId
  }

  return await prisma.account.update({
    where: { id: accountId },
    data: updateData,
  })
}

/**
 * Create payment record in database
 */
export async function createPaymentRecord(params: {
  accountId: string
  stripePaymentId: string
  amount: number
  currency: string
  plan: Plan
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  invoiceUrl?: string | null
}) {
  return await prisma.payment.create({
    data: {
      accountId: params.accountId,
      stripePaymentId: params.stripePaymentId,
      amount: params.amount,
      currency: params.currency,
      plan: params.plan,
      status: params.status,
      invoiceUrl: params.invoiceUrl || null,
    },
  })
}

/**
 * Get plan limits based on plan type
 * Uses the centralized PLAN_LIMITS configuration
 */
function getPlanLimitsForPlan(plan: Plan) {
  const planConfig = PLAN_LIMITS[plan]
  return {
    scanLimitPerMonth: planConfig.scansPerMonth,
  }
}

/**
 * Update account's Stripe information
 */
export async function updateAccountStripeInfo(params: {
  accountId: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string | null
}) {
  const updateData: Prisma.AccountUpdateInput = {}

  if (params.stripeCustomerId) {
    updateData.stripeCustomerId = params.stripeCustomerId
  }

  if (params.stripeSubscriptionId !== undefined) {
    updateData.stripeSubscriptionId = params.stripeSubscriptionId
  }

  return await prisma.account.update({
    where: { id: params.accountId },
    data: updateData,
  })
}

/**
 * Get account by Stripe customer ID
 */
export async function getAccountByStripeCustomerId(stripeCustomerId: string) {
  return await prisma.account.findUnique({
    where: { stripeCustomerId },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  })
}

