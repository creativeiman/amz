'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Upload, History, FileText, Settings, Plus, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const stats = [
    { name: 'Total Scans', value: '0', icon: FileText, color: 'text-blue-600' },
    { name: 'Compliant Products', value: '0', icon: CheckCircle, color: 'text-green-600' },
    { name: 'Issues Found', value: '0', icon: AlertTriangle, color: 'text-yellow-600' },
    { name: 'Risk Score', value: 'N/A', icon: TrendingUp, color: 'text-purple-600' },
  ]

  const recentScans = [
    // This would be populated from the database
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user?.name || session.user?.email}</p>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              New Scan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Label</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your product label</h3>
                <p className="text-gray-500 mb-6">Drag and drop your label file here, or click to browse</p>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                  Choose File
                </button>
                <p className="text-sm text-gray-400 mt-4">Supports JPG, PNG, PDF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <History className="h-5 w-5 mr-3 text-gray-400" />
                  View Scan History
                </button>
                <button className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="h-5 w-5 mr-3 text-gray-400" />
                  Generate Report
                </button>
                <button className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="h-5 w-5 mr-3 text-gray-400" />
                  Account Settings
                </button>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h3>
              {recentScans.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No scans yet</p>
                  <p className="text-sm text-gray-400">Upload your first label to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Recent scans would be rendered here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
