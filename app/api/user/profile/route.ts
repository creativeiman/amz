import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/userService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Get user data from Supabase
    const user = await UserService.getUserByEmail(email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // For now, return mock scan usage data
    // In a real app, you'd query the scans table
    const scansUsed = user.plan === 'free' ? 0 : user.plan === 'one-time' ? 0 : 0

    return NextResponse.json({
      ...user,
      scansUsed,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
