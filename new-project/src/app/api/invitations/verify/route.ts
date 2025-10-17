import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/db/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
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
        return NextResponse.json(
          { error: 'This invitation has already been accepted. You are already a member of this team.' },
          { status: 409 }
        )
      }
      
      // User exists but not member of this account
      return NextResponse.json(
        { error: 'An account with this email already exists. Please login to accept the invitation or contact support.' },
        { status: 409 }
      )
    }

    // Return invitation details
    return NextResponse.json({
      invitation: {
        email: invitation.email,
        role: invitation.role,
        accountName: invitation.account.name,
        invitedByName: invitation.account.owner.name || 'Account Owner',
        expiresAt: invitation.expiresAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error verifying invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

