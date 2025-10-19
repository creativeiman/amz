import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/db/client'
import { EmailService } from '@/lib/email-service'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Security: Always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      })
    }

    // Check if user account is active
    if (!user.isActive) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      })
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

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a password reset link.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}

