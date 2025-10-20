import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

// GET all accounts (Admin only)
export async function GET() {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAdmin: true,
    })
    
    if (isErrorResponse(context)) return context

    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        plan: true,
        subscriptionStatus: true,
        isActive: true,
        scanLimitPerMonth: true,
        scansUsedThisMonth: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
          },
        },
        _count: {
          select: {
            members: true,
            scans: true,
            payments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedAccounts = accounts.map(account => ({
      id: account.id,
      name: account.name,
      slug: account.slug,
      plan: account.plan,
      subscriptionStatus: account.subscriptionStatus,
      isActive: account.isActive,
      ownerName: account.owner.name,
      ownerEmail: account.owner.email,
      ownerId: account.owner.id,
      isEmailVerified: !!account.owner.emailVerified,
      teamMembers: account._count.members,
      scans: account._count.scans,
      payments: account._count.payments,
      scanLimit: account.scanLimitPerMonth,
      scansUsed: account.scansUsedThisMonth,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }))

    return { accounts: formattedAccounts }
  })
}

// POST create new account (Admin only)
export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAdmin: true,
    })
    
    if (isErrorResponse(context)) return context

    const body = await ApiHandler.validateBody<{
      accountName: string
      ownerName: string
      ownerEmail: string
      plan: string
      isEmailVerified?: boolean
      isActive?: boolean
    }>(request, ['accountName', 'ownerName', 'ownerEmail', 'plan'])
    
    if (isErrorResponse(body)) return body

    // Check if user already exists
    let owner = await prisma.user.findUnique({
      where: { email: body.ownerEmail },
    })

    if (!owner) {
      // Create new user as owner
      owner = await prisma.user.create({
        data: {
          name: body.ownerName,
          email: body.ownerEmail,
          role: 'USER',
          emailVerified: body.isEmailVerified ? new Date() : null,
        },
      })
    }

    // Calculate next month's first day for scan limit reset
    const nextMonthReset = new Date()
    nextMonthReset.setMonth(nextMonthReset.getMonth() + 1)
    nextMonthReset.setDate(1)
    nextMonthReset.setHours(0, 0, 0, 0)

    // Create the account
    const newAccount = await prisma.account.create({
      data: {
        name: body.accountName,
        slug: `${body.accountName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        ownerId: owner.id,
        plan: body.plan as any,
        subscriptionStatus: body.plan === 'FREE' ? 'ACTIVE' : 'INACTIVE',
        isActive: body.isActive !== undefined ? body.isActive : true,
        scanLimitPerMonth: body.plan === 'FREE' ? 3 : body.plan === 'ONE_TIME' ? 1 : null,
        scansUsedThisMonth: 0,
        scanLimitResetAt: nextMonthReset,
      },
      include: {
        owner: true,
        _count: {
          select: {
            members: true,
            scans: true,
            payments: true,
          },
        },
      },
    })

    return { account: newAccount }
  })
}
