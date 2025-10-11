import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()

    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!isSupabaseConfigured) {
      // Return success for demo purposes
      return NextResponse.json({
        success: true,
        message: 'Preferences saved (demo mode)'
      })
    }

    // Save user preferences to Supabase
    const { data, error } = await supabaseAdmin
      .from('user_preferences')
      .upsert({
        user_id: userId,
        business_name: body.businessName || null,
        primary_marketplace: body.primaryMarketplace,
        product_categories: body.productCategories,
        setup_completed: true,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving preferences:', error)
      return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Preferences saved successfully'
    })

  } catch (error) {
    console.error('Preferences API error:', error)
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

    const userId = (session.user as any).id

    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!isSupabaseConfigured) {
      // Return demo preferences
      return NextResponse.json({
        preferences: {
          business_name: null,
          primary_marketplace: null,
          product_categories: [],
          setup_completed: false
        }
      })
    }

    // Fetch user preferences from Supabase
    const { data: preferences, error } = await supabaseAdmin
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching preferences:', error)
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
    }

    return NextResponse.json({
      preferences: preferences || {
        business_name: null,
        primary_marketplace: null,
        product_categories: [],
        setup_completed: false
      }
    })

  } catch (error) {
    console.error('Preferences API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



