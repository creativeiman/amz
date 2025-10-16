import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'

// Create Supabase client
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const scanId = params.id
    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
    }

    // Fetch specific scan
    const { data: scan, error } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching scan:', error)
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }

    // Transform the data to match the expected format
    const formattedScan = {
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
      results: scan.results_json,
      labelUrl: scan.label_url,
      extractedText: scan.extracted_text
    }

    return NextResponse.json({ scan: formattedScan })

  } catch (error) {
    console.error('Error in scan GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
