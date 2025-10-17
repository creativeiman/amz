import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

// GET all team members for the user's account (Owner only)
export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only account owners can manage team members
    if (session.user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden: Only account owners can access this' }, { status: 403 })
    }

    // Get user's account (must be owner)
    const account = await prisma.account.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    })

    if (!account) {
      console.error(`No account found for user: ${session.user.id} (${session.user.email})`)
      return NextResponse.json({ error: 'No account found. Only account owners can manage team members.' }, { status: 404 })
    }

    // Get all team members for this account
    const members = await prisma.accountMember.findMany({
      where: { accountId: account.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedMembers = members.map(member => ({
      id: member.id,
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
      permissions: member.permissions,
      isActive: member.isActive,
      joinedAt: member.createdAt,
    }))

    return NextResponse.json({ members: formattedMembers }, { status: 200 })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

