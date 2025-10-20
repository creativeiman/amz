import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'
import { EmailService } from '@/lib/email-service'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const body = await ApiHandler.validateBody<{ email: string }>(request, ['email'])
    
    if (isErrorResponse(body)) return body

    // Normalize email
    const normalizedEmail = body.email.toLowerCase().trim()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Security: Always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return {
        message: 'If an account exists with this email, you will receive a password reset link.',
      }
    }

    // Check if user account is active
    if (!user.isActive) {
      return {
        message: 'If an account exists with this email, you will receive a password reset link.',
      }
    }

    // Check if user has a password (OAuth users don't have passwords)
    if (!user.password) {
      // User signed in with OAuth (e.g., Google) - they don't have a password to reset
      return ApiHandler.error(
        'OAUTH_ACCOUNT',
        'This account uses Google Sign-In. You don\'t need a password - just sign in with Google.',
        400
      )
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex')

    // Token expires in 1 hour
    const expires = new Date()
    expires.setHours(expires.getHours() + 1)

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    })

    // Send password reset email
    const emailSent = await EmailService.sendPasswordResetEmail(
      user.email,
      user.name || 'User',
      token
    )

    if (!emailSent) {
      console.error('Failed to send password reset email to:', user.email)
      // Still return success to prevent information leak
    }

    return {
      message: 'If an account exists with this email, you will receive a password reset link.',
    }
  })
}
