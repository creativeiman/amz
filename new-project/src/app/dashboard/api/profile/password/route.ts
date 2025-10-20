import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'
import bcrypt from 'bcryptjs'

// PATCH change user password
export async function PATCH(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({ requireAuth: true })
    
    if (isErrorResponse(context)) return context

    const body = await ApiHandler.validateBody<{
      currentPassword: string
      newPassword: string
    }>(request, ['currentPassword', 'newPassword'])
    
    if (isErrorResponse(body)) return body

    // Validation
    if (body.newPassword.length < 8) {
      return ApiHandler.badRequest('New password must be at least 8 characters')
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user) {
      return ApiHandler.notFound('User not found')
    }

    // Check if user has a password (not OAuth-only)
    if (!user.password) {
      return ApiHandler.badRequest(
        'Password change is not available for social login accounts'
      )
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(body.currentPassword, user.password)
    
    if (!isValidPassword) {
      return ApiHandler.unauthorized('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(body.newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    })

    return { message: 'Password changed successfully' }
  })
}
