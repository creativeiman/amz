import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    console.log('Environment variables:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')

    // Test Supabase connection
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, plan, created_at')
      .limit(10)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }

    console.log('Supabase connection successful!')
    console.log(`Found ${users?.length || 0} users`)

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      userCount: users?.length || 0,
      users: users?.map(u => ({
        id: u.id,
        email: u.email,
        plan: u.plan,
        created_at: u.created_at
      })) || []
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}



