import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

// POST resend an invitation (Owner only)
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Only account owners can resend invitations
    if (!context.isOwner) {
      return ApiHandler.forbidden('Only account owners can resend invitations')
    }

    const { id } = await params

    // Verify the invitation belongs to this account
    const invitation = await prisma.accountInvite.findUnique({
      where: { id },
    })

    if (!invitation || invitation.accountId !== context.accountId) {
      return ApiHandler.notFound('Invitation not found')
    }

    // Update expiry date (extend by 7 days from now)
    const newExpiresAt = new Date()
    newExpiresAt.setDate(newExpiresAt.getDate() + 7)

    await prisma.accountInvite.update({
      where: { id },
      data: {
        expiresAt: newExpiresAt,
      },
    })

    // Get account details for email
    const accountWithOwner = await prisma.account.findUnique({
      where: { id: invitation.accountId },
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    })

    // Resend invitation email
    const inviterName = accountWithOwner?.owner.name || 'Team Owner'
    const accountName = accountWithOwner?.owner.name || 'the team'
    
    const { EmailService } = await import('@/lib/email-service')
    const emailSent = await EmailService.sendInvitationEmail(
      invitation.email,
      inviterName,
      accountName,
      invitation.token,
      invitation.role
    )

    if (!emailSent) {
      console.error('Failed to resend invitation email to:', invitation.email)
      // Still continue - the invitation expiry is updated
    }

    return { message: 'Invitation resent successfully' }
  })
}
