import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

// GET account information for the logged-in user (owner or member)
export async function GET() {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Fetch account details
    const account = await prisma.account.findUnique({
      where: { id: context.accountId! },
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        businessName: true,
        billingEmail: true,
        primaryMarketplace: true,
        productCategories: true,
      },
    })

    if (!account) {
      return ApiHandler.notFound('Account not found')
    }

    return { account }
  })
}

// PATCH update account information (Owner only)
export async function PATCH(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Only account owners can update account settings
    if (!context.isOwner) {
      return ApiHandler.forbidden('Only account owners can update account settings')
    }

    const body = await request.json()
    const { name, businessName, billingEmail } = body

    // Validation
    if (!name || name.trim().length < 2) {
      return ApiHandler.badRequest('Account name must be at least 2 characters')
    }

    // Update account
    const updatedAccount = await prisma.account.update({
      where: { id: context.accountId! },
      data: {
        name: name.trim(),
        businessName: businessName?.trim() || null,
        billingEmail: billingEmail?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        businessName: true,
        billingEmail: true,
        primaryMarketplace: true,
        productCategories: true,
      },
    })

    return { 
      message: 'Account updated successfully',
      account: updatedAccount,
    }
  })
}
