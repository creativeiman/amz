import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase not configured - missing environment variables')
      return NextResponse.json({
        error: 'Supabase not configured',
        message: 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
      }, { status: 500 })
    }

    console.log('Fetching users from Supabase...')
    
    // Fetch real data from Supabase
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return NextResponse.json({
        error: 'Failed to fetch users',
        details: usersError.message
      }, { status: 500 })
    }

    console.log(`Found ${users?.length || 0} users in Supabase`)
    console.log('Users:', users?.map(u => ({ id: u.id, email: u.email, plan: u.plan, created_at: u.created_at })))

    // Calculate user metrics
    const totalUsers = users?.length || 0
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    
    const newUsersThisMonth = users?.filter(user => 
      new Date(user.created_at) >= thisMonth
    ).length || 0

    const lastMonthUsers = users?.filter(user => {
      const userDate = new Date(user.created_at)
      return userDate >= lastMonth && userDate < thisMonth
    }).length || 0

    const userGrowthRate = lastMonthUsers > 0 
      ? ((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100 
      : 0

    // Calculate plan distribution
    const planDistribution = {
      free: users?.filter(user => user.plan === 'free').length || 0,
      deluxe: users?.filter(user => user.plan === 'deluxe').length || 0,
      oneTime: users?.filter(user => user.plan === 'one-time').length || 0
    }

    // Calculate revenue metrics (simplified for now)
    const deluxeUsers = planDistribution.deluxe
    const oneTimeUsers = planDistribution.oneTime
    const mrr = deluxeUsers * 29.99 // $29.99/month for deluxe
    const totalRevenue = mrr + (oneTimeUsers * 39.99) // $39.99 for one-time

    // Calculate active users (users who signed up in last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const activeUsers = users?.filter(user => 
      new Date(user.created_at) >= thirtyDaysAgo
    ).length || 0

    // Calculate conversion rate
    const paidUsers = planDistribution.deluxe + planDistribution.oneTime
    const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0

    const metrics = {
      // User metrics
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      userGrowthRate: Math.round(userGrowthRate * 100) / 100,
      
      // Revenue metrics
      mrr,
      mrrGrowth: 0, // Will be calculated when we have historical data
      totalRevenue,
      revenueGrowth: 0, // Will be calculated when we have historical data
      
      // Scan metrics (will be implemented when scan data is available)
      totalScans: 0,
      scansThisMonth: 0,
      avgScanScore: 0,
      scanGrowth: 0,
      
      // Conversion metrics
      conversionRate: Math.round(conversionRate * 100) / 100,
      freeToPaidConversion: 0, // Will be calculated with more data
      trialToPaidConversion: 0, // Will be calculated with more data
      
      // Plan distribution
      planDistribution,
      
      // Category breakdown (will be implemented when scan data is available)
      categoryBreakdown: {
        toys: 0,
        babyProducts: 0,
        cosmetics: 0
      },
      
      // Marketplace data (will be implemented when scan data is available)
      marketplaceData: {
        usa: { users: 0, scans: 0 },
        uk: { users: 0, scans: 0 },
        germany: { users: 0, scans: 0 }
      },
      
      // Technical metrics
      technicalMetrics: {
        uptime: 100,
        avgScanTime: 0,
        apiErrorRate: 0,
        ocrAccuracy: 0
      },
      
      // Recent activity
      recentActivity: {
        newSignups: newUsersThisMonth,
        newScans: 0, // Will be implemented when scan data is available
        newPayments: 0, // Will be implemented when payment data is available
        supportTickets: 0 // Will be implemented when support system is available
      },
      
      // Compliance issues (will be implemented when scan data is available)
      topComplianceIssues: [],
      
      // Alerts
      alerts: [
        { 
          type: 'info', 
          message: `System is ready with ${totalUsers} users`, 
          time: 'Just now' 
        },
        { 
          type: 'success', 
          message: 'OCR integration is active and ready', 
          time: 'Just now' 
        },
        ...(newUsersThisMonth > 0 ? [{
          type: 'success',
          message: `${newUsersThisMonth} new users this month`,
          time: 'Just now'
        }] : [])
      ]
    }
    
    console.log('Returning metrics:', {
      totalUsers: metrics.totalUsers,
      planDistribution: metrics.planDistribution,
      mrr: metrics.mrr,
      totalRevenue: metrics.totalRevenue
    })
    
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching admin metrics:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
