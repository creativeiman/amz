import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    // Get authenticated user
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
    })
    
    if (isErrorResponse(context)) return context

    const body = await ApiHandler.validateBody<{
      currentPassword: string
      newPassword: string
    }>(request, ['currentPassword', 'newPassword'])
    
    if (isErrorResponse(body)) return body

    // Validate new password length
    if (body.newPassword.length < 8) {
      return ApiHandler.badRequest('New password must be at least 8 characters long')
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: context.session.user.id },
      select: {
        id: true,
        password: true,
        isActive: true,
      },
    })

    if (!user) {
      return ApiHandler.notFound('User not found')
    }

    if (!user.isActive) {
      return ApiHandler.forbidden('Your account is not active')
    }

    // Check if user has a password (not OAuth-only account)
    if (!user.password) {
      return ApiHandler.badRequest('This account uses OAuth authentication and cannot have a password set')
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(body.currentPassword, user.password)
    
    if (!isValidPassword) {
      return ApiHandler.unauthorized('Current password is incorrect')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(body.newPassword, 10)

    // Update user password and delete any password reset tokens
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      // Delete any existing password reset tokens for this user
      prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      }),
    ])

    return {
      message: 'Password has been successfully changed',
    }
  })
}

