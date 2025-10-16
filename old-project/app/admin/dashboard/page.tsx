'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, AlertCircle, CheckCircle, Activity, CreditCard, UserPlus, RefreshCw, Zap, Mail, Star, LogOut, Shield } from 'lucide-react'
import { toast } from 'react-hot-toast'

const AdminDashboard = () => {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('30d')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [metrics, setMetrics] = useState<any>(null)
  
  // Check admin authentication
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth')
      if (adminAuth === 'true') {
        setIsAuthenticated(true)
        fetchMetrics() // Fetch metrics when authenticated
      } else {
        router.push('/admin/login')
      }
      setIsLoading(false)
    }
    
    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    toast.success('Logged out successfully')
    router.push('/admin/login')
  }

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics')
      if (!response.ok) throw new Error('Failed to fetch metrics')
      const data = await response.json()
      setMetrics(data)
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Error fetching metrics:', error)
      toast.error('Failed to fetch metrics')
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchMetrics()
      toast.success('Data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }

  // Use real metrics when available, fallback to mock data
  const kpiData = metrics ? {
    mrr: { value: metrics.mrr, change: metrics.mrrGrowth, trend: 'up' },
    totalUsers: { value: metrics.totalUsers, change: metrics.userGrowthRate, trend: 'up' },
    activeUsers: { value: metrics.activeUsers, change: 8.3, trend: 'up' },
    conversionRate: { value: metrics.conversionRate, change: -2.1, trend: 'down' },
    totalScans: { value: metrics.totalScans, change: metrics.scanGrowth, trend: 'up' },
    churnRate: { value: 4.8, change: 1.2, trend: 'down' },
    avgScanScore: { value: metrics.avgScanScore, change: 3.1, trend: 'up' },
    supportTickets: { value: metrics.recentActivity.supportTickets, change: -15.2, trend: 'up' }
  } : {
    mrr: { value: 4240, change: 18.2, trend: 'up' },
    totalUsers: { value: 847, change: 12.5, trend: 'up' },
    activeUsers: { value: 423, change: 8.3, trend: 'up' },
    conversionRate: { value: 14.2, change: -2.1, trend: 'down' },
    totalScans: { value: 3847, change: 22.4, trend: 'up' },
    churnRate: { value: 4.8, change: 1.2, trend: 'down' },
    avgScanScore: { value: 76.4, change: 3.1, trend: 'up' },
    supportTickets: { value: 23, change: -15.2, trend: 'up' }
  }

  // Use real data from metrics when available
  const revenueData = metrics ? [
    { month: 'Current', mrr: metrics.mrr, newRevenue: 0, churnRevenue: 0 }
  ] : [
    { month: 'Current', mrr: 0, newRevenue: 0, churnRevenue: 0 }
  ]

  const userGrowthData = metrics ? [
    { date: 'Current', free: metrics.planDistribution.free, deluxe: metrics.planDistribution.deluxe, oneTime: metrics.planDistribution.oneTime, total: metrics.totalUsers }
  ] : [
    { date: 'Current', free: 0, deluxe: 0, oneTime: 0, total: 0 }
  ]

  const conversionFunnelData = metrics ? [
    { stage: 'Sign Ups', count: metrics.totalUsers, percentage: 100 },
    { stage: 'First Scan', count: 0, percentage: 0 },
    { stage: 'Paid User', count: metrics.planDistribution.deluxe + metrics.planDistribution.oneTime, percentage: metrics.conversionRate }
  ] : [
    { stage: 'Sign Ups', count: 0, percentage: 100 },
    { stage: 'First Scan', count: 0, percentage: 0 },
    { stage: 'Paid User', count: 0, percentage: 0 }
  ]

  const planDistribution = metrics ? [
    { name: 'Free', value: metrics.planDistribution.free, color: '#94a3b8' },
    { name: 'Deluxe ($29.99/mo)', value: metrics.planDistribution.deluxe, color: '#3b82f6' },
    { name: 'One-Time ($40)', value: metrics.planDistribution.oneTime, color: '#8b5cf6' }
  ] : [
    { name: 'Free', value: 727, color: '#94a3b8' },
    { name: 'Deluxe ($15/mo)', value: 98, color: '#3b82f6' },
    { name: 'One-Time ($40)', value: 22, color: '#8b5cf6' }
  ]

  const categoryBreakdown = metrics ? [
    { name: 'Toys', scans: metrics.categoryBreakdown.toys, percentage: 40.2 },
    { name: 'Baby Products', scans: metrics.categoryBreakdown.babyProducts, percentage: 32.0 },
    { name: 'Cosmetics', scans: metrics.categoryBreakdown.cosmetics, percentage: 27.8 }
  ] : [
    { name: 'Toys', scans: 0, percentage: 0 },
    { name: 'Baby Products', scans: 0, percentage: 0 },
    { name: 'Cosmetics', scans: 0, percentage: 0 }
  ]

  const marketplaceData = metrics ? [
    { marketplace: 'USA', users: metrics.marketplaceData.usa.users, scans: metrics.marketplaceData.usa.scans },
    { marketplace: 'UK', users: metrics.marketplaceData.uk.users, scans: metrics.marketplaceData.uk.scans },
    { marketplace: 'Germany', users: metrics.marketplaceData.germany.users, scans: metrics.marketplaceData.germany.scans }
  ] : [
    { marketplace: 'USA', users: 0, scans: 0 },
    { marketplace: 'UK', users: 0, scans: 0 },
    { marketplace: 'Germany', users: 0, scans: 0 }
  ]

  const complianceIssues = metrics ? metrics.topComplianceIssues : []

  const recentAlerts: Array<{
    type: 'critical' | 'warning' | 'success' | 'info'
    message: string
    time: string
  }> = metrics ? metrics.alerts : [
    { type: 'critical', message: 'Payment failure spike: 12 failed charges today', time: '15 min ago' },
    { type: 'warning', message: 'Scan processing time increased to 45s (target: 30s)', time: '1 hour ago' },
    { type: 'success', message: 'New regulation added: CPSC toy safety update', time: '2 hours ago' },
    { type: 'info', message: '5 new support tickets require attention', time: '3 hours ago' }
  ]

  const technicalMetrics = metrics ? metrics.technicalMetrics : {
    uptime: 99.94,
    avgScanTime: 28.3,
    apiErrorRate: 0.8,
    ocrAccuracy: 92.1
  }

  const KPICard = ({ title, value, change, trend, icon: Icon, format = '' }: {
    title: string
    value: number
    change: number
    trend: string
    icon: any
    format?: string
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900">
            {format === 'currency' && '$'}
            {value.toLocaleString()}
            {format === 'percentage' && '%'}
          </div>
          <div className="flex items-center mt-2 text-sm">
            {trend === 'up' && change > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={change > 0 && trend === 'up' ? 'text-green-600' : 'text-red-600'}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
      </div>
    </div>
  )

  const AlertItem = ({ type, message, time }: {
    type: 'critical' | 'warning' | 'success' | 'info'
    message: string
    time: string
  }) => {
    const alertStyles: Record<string, string> = {
      critical: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    }
    
    const icons: Record<string, React.ReactNode> = {
      critical: <AlertCircle className="w-5 h-5 text-red-500" />,
      warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      success: <CheckCircle className="w-5 h-5 text-green-500" />,
      info: <Activity className="w-5 h-5 text-blue-500" />
    }

    return (
      <div className={`p-3 rounded-lg border ${alertStyles[type]} mb-2`}>
        <div className="flex items-start">
          <div className="mr-3 mt-0.5">{icons[type]}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
            <p className="text-xs opacity-75 mt-1">{time}</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Amazon Label Compliance Reviewer
                {lastRefresh && (
                  <span className="ml-2 text-xs text-gray-400">
                    • Last updated: {lastRefresh.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="px-3 lg:px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-4 lg:py-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <KPICard 
            title="Monthly Recurring Revenue" 
            value={kpiData.mrr.value} 
            change={kpiData.mrr.change}
            trend={kpiData.mrr.trend}
            icon={DollarSign}
            format="currency"
          />
          <KPICard 
            title="Total Users" 
            value={kpiData.totalUsers.value} 
            change={kpiData.totalUsers.change}
            trend={kpiData.totalUsers.trend}
            icon={Users}
          />
          <KPICard 
            title="Active Users (30d)" 
            value={kpiData.activeUsers.value} 
            change={kpiData.activeUsers.change}
            trend={kpiData.activeUsers.trend}
            icon={Activity}
          />
          <KPICard 
            title="Conversion Rate" 
            value={kpiData.conversionRate.value} 
            change={kpiData.conversionRate.change}
            trend={kpiData.conversionRate.trend}
            icon={TrendingUp}
            format="percentage"
          />
        </div>

        {/* Revenue & Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          {/* MRR Growth Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MRR Growth & Churn</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="mrr" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Total MRR" />
                <Area type="monotone" dataKey="newRevenue" stackId="2" stroke="#10b981" fill="#10b981" name="New Revenue" />
                <Area type="monotone" dataKey="churnRevenue" stackId="3" stroke="#ef4444" fill="#ef4444" name="Churned" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth by Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth by Plan Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="free" fill="#94a3b8" name="Free" />
                <Bar dataKey="deluxe" fill="#3b82f6" name="Deluxe" />
                <Bar dataKey="oneTime" fill="#8b5cf6" name="One-Time" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel & Plan Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {/* Conversion Funnel */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
            <div className="space-y-4">
              {conversionFunnelData.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                    <span className="text-sm text-gray-500">
                      {stage.count.toLocaleString()} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="relative w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                      style={{ width: `${stage.percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {index > 0 && (
                        <span className="text-white mix-blend-difference">
                          {((stage.count / conversionFunnelData[index-1].count) * 100).toFixed(1)}% conversion
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Insight:</strong> 73.7% of sign-ups complete their first scan (good!), but only 14.2% convert to paid. Focus on upgrade prompts after scan completion.
              </p>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: plan.color }} />
                    <span className="text-gray-700">{plan.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{plan.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Usage & Marketplace Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans by Category</h3>
            <div className="space-y-4">
              {categoryBreakdown.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.scans.toLocaleString()} scans</span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Total Scans</div>
                <div className="text-2xl font-bold text-gray-900">{kpiData.totalScans.value.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Avg. Compliance Score</div>
                <div className="text-2xl font-bold text-gray-900">{kpiData.avgScanScore.value}%</div>
              </div>
            </div>
          </div>

          {/* Marketplace Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Performance</h3>
            <div className="space-y-4">
              {marketplaceData.map((market) => (
                <div key={market.marketplace} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-gray-900">{market.marketplace}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {((market.users / kpiData.totalUsers.value) * 100).toFixed(1)}% of users
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs text-gray-500">Users</div>
                      <div className="text-lg font-bold text-gray-900">{market.users}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Scans</div>
                      <div className="text-lg font-bold text-gray-900">{market.scans.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Common Issues & Technical Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {/* Top Issues */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Compliance Issues</h3>
            <div className="space-y-3">
              {complianceIssues.map((issue: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center flex-1">
                    <span className="text-sm font-medium text-gray-700 mr-2">{index + 1}.</span>
                    <span className="text-sm text-gray-900">{issue.issue}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      issue.criticality === 'High' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {issue.criticality}
                    </span>
                    <span className="text-sm font-bold text-gray-900 min-w-[60px] text-right">
                      {issue.count} times
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Action Item:</strong> Create content/guides about top 3 issues to reduce recurring problems and improve user satisfaction.
              </p>
            </div>
          </div>

          {/* Technical Health */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Health</h3>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Uptime</span>
                  <Zap className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-700">{technicalMetrics.uptime}%</div>
                <div className="text-xs text-green-600 mt-1">Target: 99.9%</div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Avg Scan Time</span>
                  <Activity className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-700">{technicalMetrics.avgScanTime}s</div>
                <div className="text-xs text-blue-600 mt-1">Target: &lt;30s</div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">API Error Rate</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-700">{technicalMetrics.apiErrorRate}%</div>
                <div className="text-xs text-green-600 mt-1">Target: &lt;1%</div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">OCR Accuracy</span>
                  <Star className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-700">{technicalMetrics.ocrAccuracy}%</div>
                <div className="text-xs text-blue-600 mt-1">Target: &gt;90%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Secondary KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Recent Alerts */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts & Events</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div>
              {recentAlerts.map((alert, index) => (
                <AlertItem key={index} {...alert} />
              ))}
            </div>
          </div>

          {/* Secondary KPIs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics ? metrics.conversionRate.toFixed(1) : 0}%</div>
                <div className="text-xs text-gray-500 mt-1">Free to paid conversion</div>
              </div>

              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">New Users This Month</span>
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics ? metrics.newUsersThisMonth : 0}</div>
                <div className="text-xs text-green-600 mt-1">User signups this month</div>
              </div>

              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{metrics ? metrics.userGrowthRate.toFixed(1) : 0}%</div>
                <div className="text-xs text-gray-500 mt-1">Month over month growth</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Avg Revenue/User</span>
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${metrics && metrics.totalUsers > 0 ? (metrics.totalRevenue / metrics.totalUsers).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-blue-600 mt-1">Revenue per user</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
