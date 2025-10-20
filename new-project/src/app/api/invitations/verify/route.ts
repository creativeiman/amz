import { NextRequest } from 'next/server'
import { ApiHandler } from '@/lib/api-handler'
import { prisma } from '@/db/client'

export async function GET(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return ApiHandler.badRequest('Token is required')
    }

    // Find the invitation
    const invitation = await prisma.accountInvite.findUnique({
      where: { token },
      include: {
        account: {
          select: {
            name: true,
            owner: {
              select: {
                name: true,
              },
            },
          },
        },
      },
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
      
      // User exists but not member of this account
      return ApiHandler.error(
        'An account with this email already exists. Please login to accept the invitation or contact support.',
        undefined,
        409
      )
    }

    // Return invitation details
    return {
      invitation: {
        email: invitation.email,
        role: invitation.role,
        accountName: invitation.account.name,
        invitedByName: invitation.account.owner.name || 'Account Owner',
        expiresAt: invitation.expiresAt.toISOString(),
      },
    }
  })
}
