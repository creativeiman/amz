import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // In a real app, you'd check if the user is an admin
    // For now, we'll just return empty array since Supabase is not configured
    
    return NextResponse.json({ users: [] })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
