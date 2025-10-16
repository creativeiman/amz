import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email
    const body = await request.json()
    const { name, email, notifications, emailUpdates, language } = body

    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!isSupabaseConfigured) {
      // Return success for demo purposes
      return NextResponse.json({
        success: true,
        message: 'Profile updated (demo mode)',
        user: {
          name: name,
          email: email,
          notifications: notifications,
          emailUpdates: emailUpdates,
          language: language
        }
      })
    }

    // Update user profile in Supabase
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        name: name,
        email: email,
        updated_at: new Date().toISOString()
      })
      .eq('email', userEmail)

    if (error) {
      console.error('Error updating user profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Update user preferences if they exist
    const { data: preferences, error: prefError } = await supabaseAdmin
      .from('user_preferences')
      .upsert({
        user_id: (session.user as any).id,
        notifications: notifications,
        email_updates: emailUpdates,
        language: language,
        updated_at: new Date().toISOString()
      })

    if (prefError) {
      console.error('Error updating preferences:', prefError)
      // Don't fail the request if preferences update fails
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: (session.user as any).id,
        name: name,
        email: email,
        notifications: notifications,
        emailUpdates: emailUpdates,
        language: language
      }
    })

  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = session.user.email

    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!isSupabaseConfigured) {
      // Return demo profile data
      return NextResponse.json({
        profile: {
          name: session.user.name || '',
          email: session.user.email || '',
          notifications: true,
          emailUpdates: true,
          language: 'en'
        }
      })
    }

    // Fetch user profile from Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('name, email, created_at, updated_at')
      .eq('email', userEmail)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Fetch user preferences
    const { data: preferences } = await supabaseAdmin
      .from('user_preferences')
      .select('notifications, email_updates, language')
      .eq('user_id', (session.user as any).id)
      .single()

    return NextResponse.json({
      profile: {
        name: user.name || '',
        email: user.email || '',
        notifications: preferences?.notifications ?? true,
        emailUpdates: preferences?.email_updates ?? true,
        language: preferences?.language ?? 'en'
      }
    })

  } catch (error) {
    console.error('Profile fetch API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}