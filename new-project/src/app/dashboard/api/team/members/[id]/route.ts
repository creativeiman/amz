import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

// PATCH update member status (Owner only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Only account owners can update team member status
    if (!context.isOwner) {
      return ApiHandler.forbidden('Only account owners can update team members')
    }

    const { id } = await params
    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return ApiHandler.badRequest('isActive must be a boolean')
    }

    // Verify the member belongs to this account
    const member = await prisma.accountMember.findUnique({
      where: { id },
    })

    if (!member || member.accountId !== context.accountId) {
      return ApiHandler.notFound('Member not found')
    }

    // Update member status
    const updatedMember = await prisma.accountMember.update({
      where: { id },
      data: { isActive },
    })

    return { member: updatedMember }
  })
}

// DELETE a team member (Owner only)
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

    // Only account owners can remove team members
    if (!context.isOwner) {
      return ApiHandler.forbidden('Only account owners can remove team members')
    }

    const { id } = await params

    // Verify the member belongs to this account
    const member = await prisma.accountMember.findUnique({
      where: { id },
    })

    if (!member || member.accountId !== context.accountId) {
      return ApiHandler.notFound('Member not found')
    }

    // Delete the member
    await prisma.accountMember.delete({
      where: { id },
    })

    return { message: 'Member removed successfully' }
  })
}
