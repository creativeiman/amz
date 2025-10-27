/**
 * Account Database Queries
 */

import { prisma } from '../client'
import { Plan, SubscriptionStatus, Prisma } from '@prisma/client'

/**
 * Get account by ID with owner information
 */
export async function getAccountById(accountId: string) {
  return await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
      members: {
        where: { isActive: true },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  })
}

/**
 * Get account by owner ID
 */
export async function getAccountByOwnerId(ownerId: string) {
  return await prisma.account.findFirst({
    where: {
      ownerId,
      isActive: true,
    },
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

/**
 * Update account plan and subscription details
 */
export async function updateAccountPlan(
  accountId: string,
  data: {
    plan: Plan
    subscriptionStatus: SubscriptionStatus
    stripeSubscriptionId?: string | null
    scanLimitPerMonth?: number | null
  }
) {
  return await prisma.account.update({
    where: { id: accountId },
    data,
  })
}

/**
 * Update account Stripe customer and subscription IDs
 */
export async function updateAccountStripeInfo(
  accountId: string,
  data: {
    stripeCustomerId?: string
    stripeSubscriptionId?: string | null
  }
) {
  return await prisma.account.update({
    where: { id: accountId },
    data,
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

/**
 * Reset monthly scan count for account
 */
export async function resetMonthlyScanCount(accountId: string) {
  return await prisma.account.update({
    where: { id: accountId },
    data: {
      scansUsedThisMonth: 0,
      scanLimitResetAt: new Date(),
    },
  })
}

