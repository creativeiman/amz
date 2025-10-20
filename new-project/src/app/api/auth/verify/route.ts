import { NextRequest } from 'next/server'
import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const body = await ApiHandler.validateBody<{
      email: string
      password: string
    }>(request, ['email', 'password'])
    
    if (isErrorResponse(body)) return body

    // Find user with their account (either owned or member of)
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: {
        ownedAccounts: {
          select: {
            id: true,
            name: true,
            plan: true,
            isActive: true,
          },
          take: 1,
        },
        accountMemberships: {
          select: {
            id: true,
            isActive: true,
            account: {
              select: {
                id: true,
                name: true,
                plan: true,
                isActive: true,
              },
            },
          },
          take: 1,
        },
      },
    })

    // User not found
    if (!user) {
      return ApiHandler.unauthorized('Invalid email or password')
    }

    // User has no password (OAuth only)
    if (!user.password) {
      return ApiHandler.unauthorized('Invalid email or password')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, user.password)
    
    if (!isValidPassword) {
      return ApiHandler.unauthorized('Invalid email or password')
    }

    // Check if user is active
    if (!user.isActive) {
      return ApiHandler.forbidden('Your account has been deactivated. Please contact support.')
    }

    // For regular users, check account status (either owned or member)
    if (user.role === 'USER') {
      let account = null
      let isMember = false

      // Check if they own an account
      if (user.ownedAccounts && user.ownedAccounts.length > 0) {
        account = user.ownedAccounts[0]
      } 
      // Otherwise, check if they're a member of an account
      else if (user.accountMemberships && user.accountMemberships.length > 0) {
        const membership = user.accountMemberships[0]
        
        // Check if membership is active
        if (!membership.isActive) {
          return ApiHandler.forbidden('Your team membership has been deactivated. Please contact your team administrator.')
        }
        
        account = membership.account
        isMember = true
      }
      
      if (!account) {
        return ApiHandler.forbidden('No account found. Please contact support.')
      }

      if (!account.isActive) {
        return ApiHandler.forbidden(
          isMember 
            ? 'The team workspace has been deactivated. Please contact your team administrator.'
            : 'Your account workspace has been deactivated. Please contact support.'
        )
      }
    }

    // All checks passed
    return { 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }
  })
}
