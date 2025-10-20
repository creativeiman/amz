"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RefreshCw, DollarSign, Users, Activity, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { KPICard } from "./_components/kpi-card"
import { MRRChart } from "./_components/mrr-chart"
import { UserGrowthChart } from "./_components/user-growth-chart"
import { PlanDistributionChart } from "./_components/plan-distribution-chart"
import { CategoryBreakdown } from "./_components/category-breakdown"
import { MarketplacePerformance } from "./_components/marketplace-performance"
import { ComplianceIssues } from "./_components/compliance-issues"
import { TechnicalHealth } from "./_components/technical-health"
import { RecentAlerts } from "./_components/recent-alerts"
import { SecondaryKPIs } from "./_components/secondary-kpis"

interface AdminMetrics {
  mrr: number
  mrrGrowth: number
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  userGrowthRate: number
  totalScans: number
  scansThisMonth: number
  scanGrowth: number
  avgScanScore: number
  conversionRate: number
  planDistribution: {
    free: number
    deluxe: number
    oneTime: number
  }
  categoryBreakdown: {
    toys: number
    babyProducts: number
    cosmetics: number
  }
  marketplaceData: {
    usa: { users: number; scans: number }
    uk: { users: number; scans: number }
    germany: { users: number; scans: number }
  }
  topComplianceIssues: Array<{
    issue: string
    count: number
    criticality: 'High' | 'Medium'
  }>
  recentActivity: {
    supportTickets: number
    newScansToday: number
  }
  technicalMetrics: {
    uptime: number
    avgScanTime: number
    apiErrorRate: number
    ocrAccuracy: number
  }
  alerts: Array<{
    type: 'critical' | 'warning' | 'success' | 'info'
    message: string
    time: string
  }>
  totalRevenue: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/admin/api/metrics")
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
          return
        }
        throw new Error("Failed to fetch metrics")
      }
      const result = await response.json()
      // ApiHandler wraps response in { data: ... }
      setMetrics(result.data || result)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching metrics:", error)
      toast.error("Failed to fetch metrics")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchMetrics()
      toast.success("Data refreshed successfully")
    } catch {
      toast.error("Failed to refresh data")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Prepare chart data
  const mrrChartData = metrics ? [
    { month: "Current", mrr: metrics.mrr, newRevenue: 0, churnRevenue: 0 }
  ] : []

  const userGrowthData = metrics ? [
    { 
      date: "Current", 
      free: metrics.planDistribution.free, 
      deluxe: metrics.planDistribution.deluxe, 
      oneTime: metrics.planDistribution.oneTime, 
      total: metrics.totalUsers 
    }
  ] : []

  const avgRevenuePerUser = metrics && metrics.totalUsers > 0 
    ? metrics.totalRevenue / metrics.totalUsers 
    : 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Failed to load metrics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Amazon Label Compliance Reviewer
            {lastRefresh && (
              <span className="ml-2">
                • Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="default"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Monthly Recurring Revenue" 
          value={metrics.mrr} 
          change={metrics.mrrGrowth}
          trend="up"
          icon={DollarSign}
          format="currency"
        />
        <KPICard 
          title="Total Users" 
          value={metrics.totalUsers} 
          change={metrics.userGrowthRate}
          trend="up"
          icon={Users}
        />
        <KPICard 
          title="Active Users (30d)" 
          value={metrics.activeUsers} 
          change={8.3}
          trend="up"
          icon={Activity}
        />
        <KPICard 
          title="Conversion Rate" 
          value={metrics.conversionRate} 
          change={-2.1}
          trend="down"
          icon={TrendingUp}
          format="percentage"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MRRChart data={mrrChartData} />
        <UserGrowthChart data={userGrowthData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlanDistributionChart data={metrics.planDistribution} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CategoryBreakdown 
            data={metrics.categoryBreakdown}
            totalScans={metrics.totalScans}
            avgScore={metrics.avgScanScore}
          />
          <MarketplacePerformance 
            data={metrics.marketplaceData}
            totalUsers={metrics.totalUsers}
          />
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ComplianceIssues issues={metrics.topComplianceIssues} />
        </div>
        <div className="lg:col-span-1">
          <TechnicalHealth metrics={metrics.technicalMetrics} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAlerts alerts={metrics.alerts} />
        </div>
        <div className="lg:col-span-1">
          <SecondaryKPIs 
            conversionRate={metrics.conversionRate}
            newUsersThisMonth={metrics.newUsersThisMonth}
            userGrowthRate={metrics.userGrowthRate}
            avgRevenuePerUser={avgRevenuePerUser}
          />
        </div>
      </div>
    </div>
  )
}
