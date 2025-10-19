import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/db/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and account in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER',
          isActive: true,
          emailVerified: null, // Not verified yet
        },
      })

      // Generate unique slug for workspace
      const emailPrefix = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
      const timestamp = Date.now()
      const slug = `${emailPrefix}-workspace-${timestamp}`

      // Create FREE account/workspace for the user
      // Calculate next month's first day for scan limit reset
      const nextMonthReset = new Date()
      nextMonthReset.setMonth(nextMonthReset.getMonth() + 1)
      nextMonthReset.setDate(1)
      nextMonthReset.setHours(0, 0, 0, 0)

      const newAccount = await tx.account.create({
        data: {
          name: `${name}'s Workspace`,
          slug,
          ownerId: newUser.id,
          plan: 'FREE',
          subscriptionStatus: 'ACTIVE', // FREE plans are auto-active
          isActive: true,
          scanLimitPerMonth: 1, // 1 scan per account lifetime (FREE plan)
          scansUsedThisMonth: 0,
          scanLimitResetAt: nextMonthReset, // First day of NEXT month
        },
      })

      return { user: newUser, account: newAccount }
    })

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}

