'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Star,
  TrendingUp,
  FileText,
  BarChart3,
  Settings,
  Receipt,
  LogOut,
  ChevronDown,
  UserCircle,
  Plus,
  History,
  Upload,
  Users
} from 'lucide-react'
import ScanDetailsModal from '../../../components/dashboard/ScanDetailsModal'
import UpgradeModal from '../../../components/dashboard/UpgradeModal'
import { useUpgradeModal } from '../../../hooks/useUpgradeModal'

export default function ScanHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [scans, setScans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedScan, setSelectedScan] = useState(null)
  const [isScanDetailsOpen, setIsScanDetailsOpen] = useState(false)
  const { isOpen: isUpgradeModalOpen, trigger: upgradeTrigger, closeUpgradeModal, triggerUpgrade } = useUpgradeModal()

  const userPlan = (session?.user as any)?.plan || 'free'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      fetchScanHistory()
    }
  }, [status, session, router])

  const fetchScanHistory = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/scans')
      if (!response.ok) {
        throw new Error('Failed to fetch scan history')
      }
      
      const data = await response.json()
      setScans(data.scans || [])
    } catch (error) {
      console.error('Error fetching scan history:', error)
      // Show empty state instead of mock data
      setScans([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'high':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || scan.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const canViewDetails = (scan: any) => {
    if (userPlan === 'deluxe') return true
    if (userPlan === 'one-time' && scan.plan === 'one-time') return true
    if (userPlan === 'free' && scan.plan === 'free') return true
    return false
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-orange-600 to-blue-600 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <img 
                src="/logo.png" 
                alt="Product Label Checker" 
                className="h-8 w-auto"
              />
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="font-medium">{session.user?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Receipt className="w-4 h-4 mr-3" />
                      Billing
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false)
                        // signOut({ callbackUrl: '/' })
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 lg:min-h-screen">
          <div className="p-4 lg:p-6">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Scan</span>
              </button>
              <Link
                href="/dashboard/history"
                className="flex items-center space-x-3 px-4 py-3 bg-orange-100 text-orange-700 rounded-lg"
              >
                <History className="w-5 h-5" />
                <span className="font-medium">Scan History</span>
              </Link>
              <Link
                href="/dashboard/team"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Team</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
              {userPlan !== 'free' && (
                <Link
                  href="/dashboard/billing"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Receipt className="w-5 h-5" />
                  <span className="font-medium">Billing</span>
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Scan History</h1>
                <p className="text-gray-600">
                  View and manage your past label compliance scans
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 lg:p-6 border border-white/50 mb-6 lg:mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search scans by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
                <button className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Scans List */}
          <div className="space-y-4">
            {filteredScans.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No scans found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start by uploading your first product label for compliance checking'
                  }
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Start New Scan
                </Link>
              </div>
            ) : (
              filteredScans.map((scan) => (
                <div
                  key={scan.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          {getStatusIcon(scan.status)}
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{scan.productName}</h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-600">{scan.category}</span>
                              <span className="text-sm text-gray-500">•</span>
                              <div className="flex items-center space-x-1">
                                {scan.marketplaces.map((marketplace: string, index: number) => (
                                  <span key={index} className="text-sm text-gray-600">
                                    {marketplace === 'US' ? '🇺🇸' : marketplace === 'UK' ? '🇬🇧' : '🇩🇪'} {marketplace}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {scan.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {scan.createdAt.toLocaleTimeString()}
                            </span>
                          </div>
                          {scan.score && (
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {scan.score}% Score
                              </span>
                            </div>
                          )}
                          {scan.issuesFound !== null && (
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {scan.issuesFound} Issues
                              </span>
                            </div>
                          )}
                        </div>

                        {scan.status === 'completed' && (
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scan.status)}`}>
                              {scan.status}
                            </span>
                            {scan.riskLevel && (
                              <div className={`flex items-center space-x-1 ${getRiskLevelColor(scan.riskLevel)}`}>
                                {getRiskLevelIcon(scan.riskLevel)}
                                <span className="text-sm font-medium capitalize">{scan.riskLevel} Risk</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 ml-6">
                        {canViewDetails(scan) ? (
                          <button
                            onClick={() => {
                              setSelectedScan(scan)
                              setIsScanDetailsOpen(true)
                            }}
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        ) : (
                          <button
                            onClick={() => triggerUpgrade('scan-history')}
                            className="text-center"
                          >
                            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                              <Star className="w-4 h-4 mr-2" />
                              Upgrade to View
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Premium feature</p>
                          </button>
                        )}
                        
                        {scan.status === 'completed' && (
                          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Scan Details Modal */}
      <ScanDetailsModal
        isOpen={isScanDetailsOpen}
        onClose={() => {
          setIsScanDetailsOpen(false)
          setSelectedScan(null)
        }}
        scan={selectedScan}
        userPlan={userPlan}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        trigger={upgradeTrigger}
      />
    </div>
  )
}
