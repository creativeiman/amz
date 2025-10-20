import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

// GET single account (Admin only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAdmin: true,
    })
    
    if (isErrorResponse(context)) return context

    const { id } = await params

    const account = await prisma.account.findUnique({
      where: { id },
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
        members: {
          select: {
            id: true,
            userId: true,
            role: true,
            permissions: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            scans: true,
            payments: true,
          },
        },
      },
    })

    if (!account) {
      return ApiHandler.notFound('Account not found')
    }

    const formattedAccount = {
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
      scanLimit: account.scanLimitPerMonth,
      scansUsed: account.scansUsedThisMonth,
      scans: account._count.scans,
      payments: account._count.payments,
      teamMembers: account.members.length,
      members: account.members.map(member => ({
        id: member.id,
        userId: member.userId,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
        permissions: member.permissions,
        isEmailVerified: !!member.user.emailVerified,
        joinedAt: member.createdAt,
      })),
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }

    return { account: formattedAccount }
  })
}

// PUT update account (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAdmin: true,
    })
    
    if (isErrorResponse(context)) return context

    const { id } = await params
    const body = await request.json()
    const { accountName, plan, isActive } = body

    // Update account
    const account = await prisma.account.update({
      where: { id },
      data: {
        ...(accountName !== undefined && { name: accountName }),
        ...(plan !== undefined && {
          plan,
          scanLimitPerMonth: plan === 'FREE' ? 3 : plan === 'ONE_TIME' ? 1 : null,
        }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return { account }
  })
}

// DELETE account (Admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAdmin: true,
    })
    
    if (isErrorResponse(context)) return context

    const { id } = await params

    // Delete the account (cascade will delete related members, scans, payments, etc.)
    await prisma.account.delete({
      where: { id },
    })

    return { message: 'Account deleted successfully' }
  })
}
