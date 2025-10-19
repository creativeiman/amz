import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

// GET all accounts (Admin only)
export async function GET() {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    return NextResponse.json({ accounts: formattedAccounts }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new account (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { accountName, ownerName, ownerEmail, plan, isEmailVerified, isActive } = body

    // Basic validation
    if (!accountName || !ownerName || !ownerEmail || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    let owner = await prisma.user.findUnique({
      where: { email: ownerEmail },
    })

    if (!owner) {
      // Create new user as owner
      owner = await prisma.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          role: 'USER',
          emailVerified: isEmailVerified ? new Date() : null,
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
        name: accountName,
        slug: `${accountName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        ownerId: owner.id,
        plan,
        subscriptionStatus: plan === 'FREE' ? 'ACTIVE' : 'INACTIVE',
        isActive: isActive !== undefined ? isActive : true,
        scanLimitPerMonth: plan === 'FREE' ? 3 : plan === 'ONE_TIME' ? 1 : null,
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

    return NextResponse.json({ account: newAccount }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
