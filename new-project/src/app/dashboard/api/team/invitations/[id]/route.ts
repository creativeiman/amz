import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

// DELETE cancel an invitation (Owner only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Only account owners can cancel invitations
    if (!context.isOwner) {
      return ApiHandler.forbidden('Only account owners can cancel invitations')
    }

    const { id } = await params

    // Verify the invitation belongs to this account
    const invitation = await prisma.accountInvite.findUnique({
      where: { id },
    })

    if (!invitation || invitation.accountId !== context.accountId) {
      return ApiHandler.notFound('Invitation not found')
    }

    // Delete the invitation
    await prisma.accountInvite.delete({
      where: { id },
    })

    return { message: 'Invitation cancelled successfully' }
  })
}
