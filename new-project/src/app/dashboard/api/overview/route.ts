import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/db/client'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's account (either owned or member of)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        ownedAccounts: {
          where: { isActive: true },
          take: 1,
        },
        accountMemberships: {
          where: { isActive: true },
          include: {
            account: true,
          },
          take: 1,
        },
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Determine which account to use (owned account takes priority)
    const accountId = user.ownedAccounts[0]?.id || user.accountMemberships[0]?.accountId
    
    if (!accountId) {
      return NextResponse.json({ error: 'No account found' }, { status: 404 })
    }

    // Fetch all scans for the account
    const allScans = await prisma.scan.findMany({
      where: {
        accountId,
      },
      select: {
        id: true,
        productName: true,
        category: true,
        score: true,
        riskLevel: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate stats
    const completedScans = allScans.filter(s => s.status === 'COMPLETED')
    const totalScans = allScans.length
    
    // Compliant scans (score >= 80 and status COMPLETED)
    const compliantScans = completedScans.filter(s => s.score && s.score >= 80).length
    
    // Count issues from all completed scans
    const issuesCount = await prisma.issue.count({
      where: {
        scan: {
          accountId,
          status: 'COMPLETED',
        },
        status: 'FAILED', // Only count failed issues
      },
    })

    // Calculate average score from completed scans
    const scansWithScores = completedScans.filter(s => s.score !== null)
    const avgScore = scansWithScores.length > 0
      ? Math.round(scansWithScores.reduce((sum, s) => sum + (s.score || 0), 0) / scansWithScores.length)
      : null

    // Get recent scans (last 5)
    const recentScans = allScans.slice(0, 5).map(scan => ({
      id: scan.id,
      productName: scan.productName,
      category: scan.category,
      score: scan.score,
      riskLevel: scan.riskLevel,
      status: scan.status,
      createdAt: scan.createdAt.toISOString(),
    }))

    // Get account details for usage
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        plan: true,
        scanLimitPerMonth: true,
        scansUsedThisMonth: true,
      },
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    return NextResponse.json({
      stats: {
        totalScans,
        compliantScans,
        issuesFound: issuesCount,
        avgScore,
      },
      recentScans,
      usage: {
        scansUsed: account.scansUsedThisMonth,
        scanLimit: account.scanLimitPerMonth,
      },
      account: {
        plan: account.plan,
      },
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching dashboard overview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

