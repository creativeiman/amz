import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'

// Create Supabase client
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Get user ID from session
    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
    }

    // Fetch scans for the user
    const { data: scans, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching scans:', error)
      return NextResponse.json({ error: 'Failed to fetch scans' }, { status: 500 })
    }

    // Transform the data to match the expected format
    const formattedScans = scans?.map((scan: any) => ({
      id: scan.id,
      productName: scan.product_name,
      category: scan.category,
      marketplaces: scan.marketplace ? [scan.marketplace] : [],
      status: scan.status || 'completed',
      score: scan.score || 0,
      issuesFound: scan.results_json ? 
        (scan.results_json.issues?.Critical?.length || 0) + 
        (scan.results_json.issues?.Warning?.length || 0) + 
        (scan.results_json.issues?.Recommendation?.length || 0) : 0,
      createdAt: new Date(scan.created_at),
      completedAt: new Date(scan.updated_at),
      riskLevel: scan.score >= 80 ? 'low' : scan.score >= 60 ? 'medium' : 'high',
      plan: (session.user as any)?.plan || 'free',
      results: scan.results_json
    })) || []

    return NextResponse.json({ scans: formattedScans })

  } catch (error) {
    console.error('Error in scans GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { productName, category, marketplace, labelUrl, results, score } = body

    // Get user ID from session
    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
    }

    // Save scan to database
    const { data: scan, error } = await supabase
      .from('scans')
      .insert({
        user_id: userId,
        product_name: productName,
        category: category,
        marketplace: marketplace,
        label_url: labelUrl,
        results_json: results,
        score: score
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving scan:', error)
      return NextResponse.json({ error: 'Failed to save scan' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      scan: {
        id: scan.id,
        productName: scan.product_name,
        category: scan.category,
        marketplaces: [scan.marketplace],
        status: 'completed',
        score: scan.score,
        createdAt: new Date(scan.created_at),
        results: scan.results_json
      }
    })

  } catch (error) {
    console.error('Error in scans POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
