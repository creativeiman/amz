import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

// GET all team members for the user's account (Owner only)
export async function GET() {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Only account owners can manage team members
    if (!context.isOwner) {
      return ApiHandler.forbidden('Only account owners can access team members')
    }

    // Get all team members for this account
    const members = await prisma.accountMember.findMany({
      where: { accountId: context.accountId! },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formattedMembers = members.map(member => ({
      id: member.id,
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
      permissions: member.permissions,
      isActive: member.isActive,
      joinedAt: member.createdAt,
    }))

    return { members: formattedMembers }
  })
}
