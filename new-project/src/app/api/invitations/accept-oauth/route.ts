import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/db/client'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { token } = body

    // Validation
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Find the invitation
    const invitation = await prisma.accountInvite.findUnique({
      where: { token },
    })

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation link. This invitation may have already been used or does not exist.' },
        { status: 404 }
      )
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: 'This invitation has expired. Please request a new invitation from your team administrator.' },
        { status: 410 }
      )
    }

    // Verify that the OAuth user's email matches the invitation email
    if (session.user.email !== invitation.email) {
      return NextResponse.json(
        { error: 'This invitation is for a different email address. Please sign in with the correct Google account.' },
        { status: 403 }
      )
    }

    // Check if user is already a member of this account
    const existingMembership = await prisma.accountMember.findFirst({
      where: {
        userId: session.user.id,
        accountId: invitation.accountId,
      },
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'You are already a member of this team.' },
        { status: 409 }
      )
    }

    // Add user as account member and delete invitation in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Add user as account member
      await tx.accountMember.create({
        data: {
          accountId: invitation.accountId,
          userId: session.user.id,
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

      return { success: true }
    })

    return NextResponse.json(
      {
        message: 'Invitation accepted successfully',
        redirectUrl: '/dashboard',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error accepting OAuth invitation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
