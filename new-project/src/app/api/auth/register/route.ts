import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const body = await ApiHandler.validateBody<{
      name: string
      email: string
      password: string
    }>(request, ['name', 'email', 'password'])
    
    if (isErrorResponse(body)) return body

    // Validation
    if (body.password.length < 8) {
      return ApiHandler.badRequest('Password must be at least 8 characters')
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true, email: true },
    })

    if (existingUser) {
      return ApiHandler.error(
        'An account with this email already exists',
        undefined,
        409
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12)

    // Create user and account in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          role: 'USER',
          isActive: true,
          emailVerified: null, // Not verified yet
        },
      })

      // Generate unique slug for workspace
      const emailPrefix = body.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
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
          name: `${body.name}'s Workspace`,
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

    return {
      message: 'Account created successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    }
  })
}
