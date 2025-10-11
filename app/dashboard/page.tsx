'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  User, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  CheckCircle,
  ArrowRight,
  Upload,
  ChevronDown,
  UserCircle,
  Receipt,
  Plus,
  History,
  TrendingUp,
  AlertTriangle,
  Star,
  Users
} from 'lucide-react'
import NewScanModal from '../../components/dashboard/NewScanModal'
import UpgradeModal from '../../components/dashboard/UpgradeModal'
import { useUpgradeModal } from '../../hooks/useUpgradeModal'
import { useLanguage } from '../../contexts/LanguageContext'
import { useSessionUpdate } from '../../hooks/useSessionUpdate'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const { currentUser } = useSessionUpdate()
  const router = useRouter()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState(false)
  const { isOpen: isUpgradeModalOpen, trigger: upgradeTrigger, closeUpgradeModal, triggerUpgrade } = useUpgradeModal()
  const { t } = useLanguage()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      checkFirstTimeUser()
    }
  }, [status, session, router])


  const checkFirstTimeUser = async () => {
    try {
      const response = await fetch('/api/user/preferences')
      if (response.ok) {
        const data = await response.json()
        if (!data.preferences.setup_completed) {
          setIsFirstTimeUser(true)
        }
      }
    } catch (error) {
      console.error('Error checking user preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.profile-dropdown')) {
          setIsProfileDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileDropdownOpen])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  // Redirect first-time users to setup
  if (isFirstTimeUser) {
    router.push('/dashboard/setup')
    return null
  }

  if (!session) {
    return null
  }

  const userPlan = (currentUser as any)?.plan || 'free'

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'deluxe':
        return [
          'Unlimited label scans',
          'Detailed compliance reports',
          'Priority support',
          'Team collaboration',
          'Advanced analytics'
        ]
      case 'one-time':
        return [
          'Single product analysis',
          'Comprehensive report',
          'Geo-expansion support',
          'High-stakes launch guidance'
        ]
      default:
        return [
          '3 free scans per month',
          'Basic compliance check',
          'Standard support'
        ]
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'deluxe':
        return 'from-orange-600 to-blue-600'
      case 'one-time':
        return 'from-green-600 to-emerald-600'
      default:
        return 'from-gray-600 to-slate-600'
    }
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
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-orange-600">Label</span>
                <div className="w-6 h-6 bg-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="font-medium">{currentUser?.name}</span>
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
                        signOut({ callbackUrl: '/' })
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
                onClick={() => setIsNewScanModalOpen(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Scan</span>
              </button>
              <Link
                href="/dashboard/history"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
          {/* Welcome Banner */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {t('dashboard.welcome')}, {currentUser?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-600">
              {t('dashboard.manageCompliance')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 lg:p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.totalScans')}</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 lg:p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.compliant')}</p>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 lg:p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.issuesFound')}</p>
                  <p className="text-3xl font-bold text-yellow-600">0</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 lg:p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.riskScore')}</p>
                  <p className="text-3xl font-bold text-orange-600">-</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Scans Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Scans</h3>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-600 mb-6">Upload your first label to get started with compliance checking</p>
              <button
                onClick={() => setIsNewScanModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Start Your First Scan
              </button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 text-center">
            {userPlan === 'free' ? (
              <div className="space-y-4">
                <button
                  onClick={() => setIsNewScanModalOpen(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl hover:from-orange-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload New Label
                </button>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">Free plan: 1 scan remaining</p>
                  <button
                    onClick={() => triggerUpgrade('dashboard-upgrade')}
                    className="inline-flex items-center px-6 py-3 bg-white border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all duration-200"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Upgrade for Unlimited Scans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsNewScanModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-bold rounded-2xl shadow-xl hover:from-orange-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload New Label
              </button>
            )}
          </div>
        </div>
      </div>

      {/* New Scan Modal */}
      <NewScanModal 
        isOpen={isNewScanModalOpen} 
        onClose={() => setIsNewScanModalOpen(false)} 
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