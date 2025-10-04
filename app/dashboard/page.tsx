'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Upload, History, FileText, Settings, Plus, TrendingUp, AlertTriangle, CheckCircle, Crown, Zap, Star, ArrowRight, Lock } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userPlan, setUserPlan] = useState<'free' | 'deluxe' | 'one-time'>('free')
  const [scansUsed, setScansUsed] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/user/profile?email=${session.user.email}`)
          if (response.ok) {
            const userData = await response.json()
            setUserPlan(userData.plan || 'free')
            setScansUsed(userData.scansUsed || 0)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      setIsLoading(false)
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const planLimits = {
    free: { scans: 3, features: ['Basic compliance check', 'Single marketplace', 'Basic report'] },
    deluxe: { scans: -1, features: ['Unlimited scans', 'All marketplaces', 'Detailed analysis', 'Priority support', 'Team collaboration'] },
    'one-time': { scans: 1, features: ['In-depth review', 'Single product', 'Geo-expansion support', 'High-stakes launch'] }
  }

  const canScan = userPlan === 'deluxe' || (userPlan === 'free' && scansUsed < 3) || (userPlan === 'one-time' && scansUsed < 1)

  const handleUpgrade = (plan: string) => {
    if (plan === 'deluxe') {
      // Redirect to Stripe checkout for Deluxe
      window.location.href = '/api/stripe/create-checkout-session'
    } else if (plan === 'one-time') {
      // Redirect to Stripe checkout for One-Time
      window.location.href = '/api/stripe/create-checkout-session?plan=one-time'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                userPlan === 'free' ? 'bg-gray-100 text-gray-800' :
                userPlan === 'deluxe' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {userPlan === 'free' ? 'Free Plan' : 
                 userPlan === 'deluxe' ? 'Deluxe Plan' : 
                 'One-Time Plan'}
              </div>
              <button
                onClick={() => router.push('/auth/signin')}
                className="text-gray-500 hover:text-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {searchParams.get('success') && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Payment Successful!</h3>
                <p className="text-sm text-green-700">
                  Your {searchParams.get('plan')} plan has been activated. You now have access to all premium features.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Status */}
        {userPlan === 'free' && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start">
              <Crown className="w-6 h-6 text-purple-600 mr-3 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-900">Upgrade to Unlock More Features</h3>
                <p className="text-purple-700 mb-4">
                  You've used {scansUsed} of 3 free scans this month. Upgrade to Deluxe for unlimited scans and advanced features.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpgrade('deluxe')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Deluxe
                  </button>
                  <button
                    onClick={() => handleUpgrade('one-time')}
                    className="bg-white border border-purple-300 text-purple-700 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-all duration-200 flex items-center"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    One-Time Use
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload Label */}
          <div className={`bg-white rounded-lg shadow-sm border p-6 ${!canScan ? 'opacity-50' : ''}`}>
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Upload Label</h3>
              {!canScan && <Lock className="w-4 h-4 text-gray-400 ml-auto" />}
            </div>
            <p className="text-gray-600 mb-4">
              {userPlan === 'free' ? 'Upload your product label for compliance analysis' :
               userPlan === 'deluxe' ? 'Upload unlimited labels for detailed compliance analysis' :
               'Upload your product for in-depth compliance review'}
            </p>
            <button
              disabled={!canScan}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                canScan
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!canScan ? 'Upgrade to Scan' : 'Start New Scan'}
            </button>
          </div>

          {/* Scan History */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <History className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Scan History</h3>
            </div>
            <p className="text-gray-600 mb-4">
              View your previous compliance scans and reports
            </p>
            <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200">
              View History
            </button>
          </div>

          {/* Reports */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Reports</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Access detailed compliance reports and recommendations
            </p>
            <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200">
              View Reports
            </button>
          </div>
        </div>

        {/* Plan Features */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planLimits[userPlan].features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          
          {userPlan === 'free' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Ready to unlock more features?</h4>
                  <p className="text-sm text-gray-600">Upgrade to Deluxe for unlimited scans and advanced analysis</p>
                </div>
                <button
                  onClick={() => handleUpgrade('deluxe')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center"
                >
                  Upgrade Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}