import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

// PATCH update member status (Owner only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only account owners can update team member status
    if (session.user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden: Only account owners can update team members' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 })
    }

    // Get user's account (must be owner)
    const account = await prisma.account.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    })

    if (!account) {
      return NextResponse.json({ error: 'No account found. Only account owners can manage team members.' }, { status: 404 })
    }

    // Verify the member belongs to this account
    const member = await prisma.accountMember.findUnique({
      where: { id },
    })

    if (!member || member.accountId !== account.id) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Update member status
    const updatedMember = await prisma.accountMember.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json({ member: updatedMember }, { status: 200 })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE a team member (Owner only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only account owners can remove team members
    if (session.user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden: Only account owners can remove team members' }, { status: 403 })
    }

    const { id } = await params

    // Get user's account (must be owner)
    const account = await prisma.account.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    })

    if (!account) {
      return NextResponse.json({ error: 'No account found. Only account owners can manage team members.' }, { status: 404 })
    }

    // Verify the member belongs to this account
    const member = await prisma.accountMember.findUnique({
      where: { id },
    })

    if (!member || member.accountId !== account.id) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Delete the member
    await prisma.accountMember.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Member removed successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

