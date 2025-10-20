import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({ requireAuth: true })
    
    if (isErrorResponse(context)) return context

    const body = await ApiHandler.validateBody<{ token: string }>(request, ['token'])
    
    if (isErrorResponse(body)) return body

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

    // Verify that the OAuth user's email matches the invitation email
    if (context.session?.user?.email !== invitation.email) {
      return ApiHandler.forbidden('This invitation is for a different email address. Please sign in with the correct Google account.')
    }

    // Check if user is already a member of this account
    const existingMembership = await prisma.accountMember.findFirst({
      where: {
        userId: context.userId,
        accountId: invitation.accountId,
      },
    })

    if (existingMembership) {
      return ApiHandler.error(
        'You are already a member of this team.',
        undefined,
        409
      )
    }

    // Add user as account member and delete invitation in a transaction
    await prisma.$transaction(async (tx) => {
      // Add user as account member
      await tx.accountMember.create({
        data: {
          accountId: invitation.accountId,
          userId: context.userId,
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
    })

    return {
      message: 'Invitation accepted successfully',
      redirectUrl: '/dashboard',
    }
  })
}
