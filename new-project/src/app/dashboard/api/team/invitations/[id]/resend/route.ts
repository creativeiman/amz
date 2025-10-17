import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

// POST resend an invitation (Owner only)
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only account owners can resend invitations
    if (session.user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden: Only account owners can resend invitations' }, { status: 403 })
    }

    const { id } = await params

    // Get user's account (must be owner)
    const account = await prisma.account.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true, name: true },
    })

    if (!account) {
      return NextResponse.json({ error: 'No account found. Only account owners can resend invitations.' }, { status: 404 })
    }

    // Verify the invitation belongs to this account
    const invitation = await prisma.accountInvite.findUnique({
      where: { id },
    })

    if (!invitation || invitation.accountId !== account.id) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    // Update expiry date (extend by 7 days from now)
    const newExpiresAt = new Date()
    newExpiresAt.setDate(newExpiresAt.getDate() + 7)

    await prisma.accountInvite.update({
      where: { id },
      data: {
        expiresAt: newExpiresAt,
        status: 'PENDING', // Reset status if expired
      },
    })

    // TODO: Resend invitation email
    // await sendInvitationEmail(invitation.email, invitation.id, account.name)

    return NextResponse.json(
      { message: 'Invitation resent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error resending invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

