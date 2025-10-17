import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

// DELETE cancel an invitation (Owner only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only account owners can cancel invitations
    if (session.user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden: Only account owners can cancel invitations' }, { status: 403 })
    }

    const { id } = await params

    // Get user's account (must be owner)
    const account = await prisma.account.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    })

    if (!account) {
      return NextResponse.json({ error: 'No account found. Only account owners can manage invitations.' }, { status: 404 })
    }

    // Verify the invitation belongs to this account
    const invitation = await prisma.accountInvite.findUnique({
      where: { id },
    })

    if (!invitation || invitation.accountId !== account.id) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    // Delete the invitation
    await prisma.accountInvite.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Invitation cancelled successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error cancelling invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

