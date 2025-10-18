import { prisma } from '../client'

// Get admin dashboard metrics
export async function getAdminMetrics() {
  const [
    totalUsers,
    totalScans,
    totalPayments,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.scan.count(),
    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      _count: true,
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
  ])

  return {
    totalUsers,
    totalScans,
    totalRevenue: totalPayments._sum.amount || 0,
    totalPayments: totalPayments._count,
    recentUsers,
  }
}

// Get plan distribution
export async function getPlanDistribution() {
  const distribution = await prisma.account.groupBy({
    by: ['plan'],
    _count: {
      plan: true,
    },
  })

  return distribution.map(item => ({
    plan: item.plan,
    count: item._count.plan,
  }))
}

// Get recent scans (admin view)
export async function getRecentScans(limit: number = 20) {
  return await prisma.scan.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      account: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          issues: true,
        },
      },
    },
  })
}

