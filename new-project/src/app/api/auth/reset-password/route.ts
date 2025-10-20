import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const body = await ApiHandler.validateBody<{
      token: string
      password: string
    }>(request, ['token', 'password'])
    
    if (isErrorResponse(body)) return body

    // Validate password length
    if (body.password.length < 8) {
      return ApiHandler.badRequest('Password must be at least 8 characters long')
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: body.token },
      include: { user: true },
    })

    if (!resetToken) {
      return ApiHandler.badRequest('Invalid or expired reset token')
    }

    // Check if token has expired
    if (new Date() > resetToken.expires) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      })

      return ApiHandler.badRequest('Reset token has expired. Please request a new password reset.')
    }

    // Check if user account is active
    if (!resetToken.user.isActive) {
      return ApiHandler.forbidden('Your account is not active. Please contact support.')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Update user password and delete the reset token in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
      // Delete any other tokens for this user
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ])

    return {
      message: 'Password has been successfully reset. You can now log in with your new password.',
    }
  })
}
