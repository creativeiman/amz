import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

// PATCH update user profile
export async function PATCH(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({ requireAuth: true })
    if (isErrorResponse(context)) return context

    const body = await ApiHandler.validateBody<{ name: string }>(request, ['name'])
    if (isErrorResponse(body)) return body

    // Validation
    if (body.name.trim().length < 2) {
      return ApiHandler.badRequest('Name must be at least 2 characters')
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: context.userId },
      data: { name: body.name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    }
  })
}

