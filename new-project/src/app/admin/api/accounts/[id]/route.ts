import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

// GET single account (Admin only)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
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

    return NextResponse.json({ account: formattedAccount }, { status: 200 })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT update account (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    return NextResponse.json({ account }, { status: 200 })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE account (Admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Delete the account (cascade will delete related members, scans, payments, etc.)
    await prisma.account.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

