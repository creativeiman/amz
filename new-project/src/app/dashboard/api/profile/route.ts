import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

// PATCH update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      console.error('Profile update: Unauthorized - no session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

