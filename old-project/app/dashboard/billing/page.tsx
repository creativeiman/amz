'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  CreditCard, 
  Receipt, 
  Download, 
  Calendar,
  CheckCircle,
  X,
  AlertCircle,
  Star,
  ArrowRight
} from 'lucide-react'
import ChangePlanModal from '../../../components/dashboard/ChangePlanModal'
import DownloadInvoiceModal from '../../../components/dashboard/DownloadInvoiceModal'
import { useSessionUpdate } from '../../../hooks/useSessionUpdate'

export default function BillingPage() {
  const { data: session, status } = useSession()
  const { currentUser } = useSessionUpdate()
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState('free')
  const [billingHistory, setBillingHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false)
  const [isDownloadInvoiceModalOpen, setIsDownloadInvoiceModalOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      setCurrentPlan((session.user as any)?.plan || 'free')
      fetchUserBillingData()
    }
  }, [status, session, router])


  const fetchUserBillingData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch user's billing history from API
      const response = await fetch('/api/user/billing-history')
      if (response.ok) {
        const data = await response.json()
        setBillingHistory(data.billingHistory || [])
        setTotalAmount(data.totalAmount || 0)
      }
    } catch (error) {
      console.error('Error fetching billing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlanDetails = (plan: string) => {
    switch (plan) {
      case 'deluxe':
        return {
          name: 'Deluxe Plan',
          price: '$29.99',
          period: 'per month',
          features: ['Unlimited scans', 'Full visual annotations', 'PDF exports', 'Amazon FBA integration', 'Team collaboration'],
          color: 'from-orange-600 to-blue-600'
        }
      case 'one-time':
        return {
          name: 'One-Time Plan',
          price: '$99.99',
          period: 'one-time',
          features: ['Single product analysis', 'Comprehensive report', 'Geo-expansion support'],
          color: 'from-green-600 to-emerald-600'
        }
      default:
        return {
          name: 'Free Plan',
          price: 'Free',
          period: '',
          features: ['1 scan per account lifetime', 'Basic compliance report', 'View only (no PDF export)', 'Standard support'],
          color: 'from-gray-600 to-slate-600'
        }
    }
  }

  const planDetails = getPlanDetails(currentPlan)

  const handleDownloadInvoices = () => {
    setIsDownloadInvoiceModalOpen(true)
  }

  const handleContactSupport = () => {
    window.open('mailto:support@productlabelchecker.com?subject=Billing Support', '_blank')
  }

  const handleChangePlan = () => {
    setIsChangePlanModalOpen(true)
  }

  const handleUpdatePaymentMethod = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const { url } = await response.json()
        window.open(url, '_blank')
      } else {
        throw new Error('Failed to create portal session')
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
      alert('Failed to open payment method update. Please contact support.')
    }
  }

  const handlePlanChange = (newPlan: string) => {
    setCurrentPlan(newPlan)
    // TODO: Update user plan in Supabase
    fetchUserBillingData() // Refresh billing data
  }

  if (status === 'loading') {
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
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
                <p className="text-sm text-gray-600">Manage your subscription and billing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Current Plan
              </h2>
              
              <div className={`bg-gradient-to-r ${planDetails.color} text-white p-6 rounded-xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{planDetails.name}</h3>
                    <p className="text-white/90">
                      {planDetails.price} {planDetails.period}
                    </p>
                  </div>
                  {currentPlan === 'free' && (
                    <Link
                      href="/#pricing"
                      className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Upgrade
                    </Link>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {planDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-300 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Billing History
              </h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading billing history...</p>
                </div>
              ) : billingHistory.length > 0 ? (
                <div className="space-y-4">
                  {billingHistory.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.description}</h4>
                          <p className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-gray-900">${item.amount.toFixed(2)}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                        <button 
                          onClick={() => handleDownloadInvoices()}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
                  <p className="text-gray-600">
                    {currentPlan === 'free' 
                      ? 'Upgrade to a paid plan to see your billing history here.'
                      : 'Your billing history will appear here once you make a payment.'
                    }
                  </p>
                  {currentPlan === 'free' && (
                    <Link
                      href="/#pricing"
                      className="inline-flex items-center mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Payment Method */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              
              {currentPlan === 'free' ? (
                <div className="text-center py-4">
                  <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No payment method required for free plan</p>
                  <p className="text-xs text-gray-500 mt-1">Upgrade to a paid plan to add payment methods</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="font-medium text-gray-900">Stripe Payment</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {currentPlan === 'deluxe' ? 'Monthly subscription via Stripe' : 'One-time payment via Stripe'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment method managed through Stripe. Contact support for updates.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      onClick={handleUpdatePaymentMethod}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Update Payment Method
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {currentPlan === 'free' ? (
                  <Link
                    href="/#pricing"
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200"
                  >
                    <span className="font-medium">Upgrade Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button 
                    onClick={handleChangePlan}
                    className="w-full flex items-center justify-between p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span className="font-medium">Change Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                
                <button 
                  onClick={handleDownloadInvoices}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="font-medium">Download Invoices</span>
                  <Download className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={handleContactSupport}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="font-medium">Contact Support</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Billing Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Account created:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    {session?.user ? new Date().toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Current plan:</span>
                  <span className="font-medium text-gray-900 ml-2 capitalize">
                    {currentPlan} plan
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total payments:</span>
                  <span className="font-medium text-gray-900 ml-2">
                    ${totalAmount.toFixed(2)} ({billingHistory.length} transaction{billingHistory.length !== 1 ? 's' : ''})
                  </span>
                </div>
                {currentPlan !== 'free' && (
                  <div>
                    <span className="text-gray-600">Next billing date:</span>
                    <span className="font-medium text-gray-900 ml-2">
                      {currentPlan === 'deluxe' ? 
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : 
                        'One-time payment (no recurring billing)'
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePlanModal
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        currentPlan={currentPlan}
        onPlanChange={handlePlanChange}
      />

      <DownloadInvoiceModal
        isOpen={isDownloadInvoiceModalOpen}
        onClose={() => setIsDownloadInvoiceModalOpen(false)}
        currentPlan={currentPlan}
      />
    </div>
  )
}
