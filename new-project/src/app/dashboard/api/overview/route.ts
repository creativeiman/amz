import { ApiHandler, isErrorResponse } from '@/lib/api-handler'
import { prisma } from '@/db/client'

export async function GET() {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })

    if (isErrorResponse(context)) return context

    const accountId = context.accountId!

    // Fetch all scans for the account
    const allScans = await prisma.scan.findMany({
      where: { accountId },
      select: {
        id: true,
        productName: true,
        category: true,
        score: true,
        riskLevel: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
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
        status: 'FAILED',
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
      return ApiHandler.notFound('Account not found')
    }

    return {
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
    }
  })
}
