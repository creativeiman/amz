'use client'

import { useState } from 'react'
import { 
  X, 
  Star, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Zap,
  Shield,
  Users,
  Download,
  Eye,
  Target,
  Clock,
  DollarSign
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: string // What triggered the upgrade modal
}

export default function UpgradeModal({ isOpen, onClose, trigger }: UpgradeModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      period: '',
      features: [
        '1 scan per account lifetime',
        'Basic compliance report',
        'View-only results',
        'Marketplace check'
      ],
      limitations: [
        'No PDF export',
        'No visual annotations',
        'No Amazon FBA integration',
        'No risk profiling'
      ],
      current: true
    },
    {
      name: 'Deluxe',
      price: '$29.99',
      period: 'per month',
      features: [
        'Unlimited scans',
        'Full visual annotations with AI',
        'Unlimited PDF exports',
        'Amazon FBA/ASIN integration',
        'Risk profiling & insights',
        'Real-time regulatory updates',
        'Team collaboration (up to 2 users)',
        'Priority email support',
        'Unlimited scan history'
      ],
      limitations: [],
      popular: true
    },
    {
      name: 'One-Time Use',
      price: '$99.99',
      period: 'one-time',
      features: [
        '1 comprehensive in-depth scan',
        'All Deluxe features for single product',
        '30-day access to results',
        'Dedicated compliance review summary',
        'No recurring charges',
        'Geo-expansion validation'
      ],
      limitations: []
    }
  ]

  const handlePlanSelection = async (planId: string) => {
    setLoading(planId)

    try {
      if (planId === 'deluxe') {
        // Redirect to Stripe checkout for Deluxe plan
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: 'deluxe',
            price: 2999, // $29.99 in cents
            recurring: true,
          }),
        })

        const { url } = await response.json()
        if (url) {
          window.location.href = url
        }
      } else if (planId === 'one-time') {
        // Redirect to Stripe checkout for One-Time plan
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: 'one-time',
            price: 9999, // $99.99 in cents
            recurring: false,
          }),
        })

        const { url } = await response.json()
        if (url) {
          window.location.href = url
        }
      }
    } catch (error) {
      console.error('Error processing plan selection:', error)
    } finally {
      setLoading(null)
    }
  }

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'first-scan-complete':
        return 'Great! You\'ve completed your first scan. Unlock unlimited scans and advanced features.'
      case 'second-scan-attempt':
        return 'You\'ve used your free scan. Upgrade to continue scanning more products.'
      case 'locked-feature':
        return 'This feature requires a premium plan. Upgrade to unlock full functionality.'
      case 'scan-history':
        return 'Detailed scan analysis is available with our premium plans.'
      default:
        return 'Unlock the full power of compliance checking with our premium plans.'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Unlock Full Compliance Power</h2>
              <p className="text-gray-600 mt-2">{getTriggerMessage()}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Plan */}
        <div className="p-6 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Current Plan: Basic (Free)</h3>
              <p className="text-sm text-gray-600">Limited to 1 scan per account lifetime</p>
            </div>
          </div>
        </div>

        {/* Why Upgrade Section */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-blue-50">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Upgrade?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save Money</h4>
              <p className="text-sm text-gray-600">
                "Saved me from $63K suspension" - Sarah M., Amazon Seller
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Unlimited Power</h4>
              <p className="text-sm text-gray-600">
                Scan unlimited products with advanced AI analysis
              </p>
            </div>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Compare Plans</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 p-6 ${
                  plan.popular
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-blue-50'
                    : plan.current
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1">/{plan.period}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h5 className="font-semibold text-gray-900">Features:</h5>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h5 className="font-semibold text-gray-900 mt-4">Limitations:</h5>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start">
                          <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {!plan.current && (
                  <button
                    onClick={() => handlePlanSelection(plan.name.toLowerCase().replace(' ', '-'))}
                    disabled={loading === plan.name.toLowerCase().replace(' ', '-')}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-600 to-blue-600 text-white hover:from-orange-700 hover:to-blue-700 shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading === plan.name.toLowerCase().replace(' ', '-') ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Choose {plan.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    )}
                  </button>
                )}

                {plan.current && (
                  <div className="w-full py-3 px-4 rounded-lg bg-blue-100 text-blue-700 font-semibold text-center">
                    Current Plan
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>💳 Secure payment powered by Stripe</p>
              <p>🔄 Cancel anytime • 30-day money-back guarantee</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
