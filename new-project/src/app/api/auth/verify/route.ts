import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/db/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { 
          error: 'MISSING_CREDENTIALS',
          message: 'Email and password are required' 
        },
        { status: 400 }
      )
    }

    // Find user with their account (either owned or member of)
    const user = await prisma.user.findUnique({
      where: { email },
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
      return NextResponse.json(
        { 
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password' 
        },
        { status: 401 }
      )
    }

    // User has no password (OAuth only)
    if (!user.password) {
      return NextResponse.json(
        { 
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password' 
        },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          error: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password' 
        },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { 
          error: 'USER_INACTIVE',
          message: 'Your account has been deactivated. Please contact support.' 
        },
        { status: 403 }
      )
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
          return NextResponse.json(
            { 
              error: 'MEMBERSHIP_INACTIVE',
              message: 'Your team membership has been deactivated. Please contact your team administrator.' 
            },
            { status: 403 }
          )
        }
        
        account = membership.account
        isMember = true
      }
      
      if (!account) {
        return NextResponse.json(
          { 
            error: 'NO_ACCOUNT',
            message: 'No account found. Please contact support.' 
          },
          { status: 403 }
        )
      }

      if (!account.isActive) {
        return NextResponse.json(
          { 
            error: 'ACCOUNT_INACTIVE',
            message: isMember 
              ? 'The team workspace has been deactivated. Please contact your team administrator.'
              : 'Your account workspace has been deactivated. Please contact support.'
          },
          { status: 403 }
        )
      }
    }

    // All checks passed
    return NextResponse.json(
      { 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { 
        error: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again.' 
      },
      { status: 500 }
    )
  }
}

