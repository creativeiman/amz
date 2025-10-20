import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const body = await ApiHandler.validateBody<{
      token: string
      name: string
      password: string
    }>(request, ['token', 'name', 'password'])
    
    if (isErrorResponse(body)) return body

    // Validation
    if (body.password.length < 8) {
      return ApiHandler.badRequest('Password must be at least 8 characters')
    }

    // Find the invitation
    const invitation = await prisma.accountInvite.findUnique({
      where: { token: body.token },
    })

    if (!invitation) {
      return ApiHandler.notFound('Invalid invitation link. This invitation may have already been used or does not exist.')
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      return ApiHandler.error(
        'This invitation has expired. Please request a new invitation from your team administrator.',
        undefined,
        410
      )
    }

    // Check if user already exists (invitation already accepted or email registered)
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
      select: {
        id: true,
        email: true,
        accountMemberships: {
          where: {
            accountId: invitation.accountId,
          },
          select: { id: true },
        },
      },
    })

    if (existingUser) {
      // Check if they're already a member of this specific account
      if (existingUser.accountMemberships.length > 0) {
        return ApiHandler.error(
          'This invitation has already been accepted. You are already a member of this team.',
          undefined,
          409
        )
      }
      
      // User exists but not member of this account (shouldn't happen, but handle it)
      return ApiHandler.error(
        'An account with this email already exists. Please login to accept the invitation or contact support.',
        undefined,
        409
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12)

    // Create user and add to account in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          email: invitation.email,
          name: body.name,
          password: hashedPassword,
          emailVerified: new Date(), // Auto-verify since they came from invitation
          role: 'USER',
          isActive: true,
        },
      })

      // Add user as account member
      await tx.accountMember.create({
        data: {
          accountId: invitation.accountId,
          userId: newUser.id,
          role: invitation.role,
          permissions: invitation.permissions,
          invitedBy: invitation.invitedBy,
          isActive: true,
        },
      })

      // Delete the used invitation
      await tx.accountInvite.delete({
        where: { id: invitation.id },
      })

      return { user: newUser }
    })

    return {
      message: 'Invitation accepted successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    }
  })
}
