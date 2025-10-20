"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { FileText, CheckCircle, AlertTriangle, TrendingUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCard } from "./_components/stats-card"
import { RecentScansTable } from "./_components/recent-scans-table"
import { UsageCard } from "./_components/usage-card"

interface DashboardData {
  stats: {
    totalScans: number
    compliantScans: number
    issuesFound: number
    avgScore: number | null
  }
  recentScans: Array<{
    id: string
    productName: string
    category: string
    score: number | null
    riskLevel: string | null
    status: string
    createdAt: string
  }>
  usage: {
    scansUsed: number
    scanLimit: number | null
  }
  account: {
    plan: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/dashboard/api/overview")
      if (!response.ok) throw new Error("Failed to fetch dashboard data")
      const result = await response.json()
      // ApiHandler wraps response in { data: ... }
      setData(result.data || result)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewScan = () => {
    router.push("/dashboard/scans/new")
  }

  const handleUpgrade = () => {
    router.push("/dashboard/billing")
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Failed to load dashboard</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product compliance and scan history
          </p>
        </div>
        <Button onClick={handleNewScan} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Scans"
          value={data.stats.totalScans}
          icon={FileText}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-950"
        />
        <StatsCard
          title="Compliant"
          value={data.stats.compliantScans}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100 dark:bg-green-950"
        />
        <StatsCard
          title="Issues Found"
          value={data.stats.issuesFound}
          icon={AlertTriangle}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100 dark:bg-yellow-950"
        />
        <StatsCard
          title="Avg Score"
          value={data.stats.avgScore !== null ? `${data.stats.avgScore}%` : "-"}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-950"
        />
      </div>

      {/* Usage and Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UsageCard
            scansUsed={data.usage.scansUsed}
            scanLimit={data.usage.scanLimit}
            plan={data.account.plan}
            onUpgrade={handleUpgrade}
          />
        </div>
        <div className="lg:col-span-2">
          <RecentScansTable
            scans={data.recentScans}
            onNewScan={handleNewScan}
          />
        </div>
      </div>

      {/* Quick Actions */}
      {data.account.plan === "FREE" && data.usage.scanLimit && data.usage.scansUsed >= data.usage.scanLimit && (
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                You&apos;ve reached your scan limit
              </h3>
              <p className="text-sm text-muted-foreground">
                Upgrade to Deluxe for unlimited scans and advanced features
              </p>
            </div>
            <Button onClick={handleUpgrade} size="lg" variant="default">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
