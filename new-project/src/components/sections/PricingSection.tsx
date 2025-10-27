'use client'

import { CreditCard, CheckCircle, X, ArrowRight, Rocket, Users, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFreshAccount } from '@/hooks/use-fresh-account'

const plans = [
  {
    name: 'Basic',
    description: 'Get started with free analysis',
    price: 'Free',
    period: '',
    features: [
      '1 scan per account lifetime',
      'Basic compliance report',
      'View-only results',
      'Marketplace check',
    ],
    limitations: [
      'No PDF export',
      'No visual annotations',
      'No risk profiling',
    ],
    buttonText: 'Get Started Free',
    buttonStyle: 'outline',
    popular: false,
    planId: 'free',
  },
  {
    name: 'Deluxe',
    description: 'For regular sellers',
    price: '$29.99',
    period: 'per month',
    features: [
      'Unlimited scans',
      'Full visual annotations with AI',
      'Unlimited PDF exports',
      'Risk profiling & insights',
      'Team collaboration (up to 2 users)',
      'Priority email support',
      'Unlimited scan history',
    ],
    limitations: [],
    buttonText: 'Choose Deluxe',
    buttonStyle: 'primary',
    popular: true,
    planId: 'deluxe',
  },
  {
    name: 'One-Time Use',
    description: 'Perfect for geo-expansion',
    price: '$59.99',
    period: 'one-time',
    features: [
      '1 comprehensive in-depth scan',
      'All Deluxe features for single product',
      '30-day access to results',
      'Dedicated compliance review summary',
      'No recurring charges',
      'Geo-expansion validation',
    ],
    limitations: [],
    buttonText: 'Choose One-Time',
    buttonStyle: 'outline',
    popular: false,
    planId: 'one-time',
  },
]

interface TeamBlockModal {
  show: boolean
  members: Array<{ id: string; name: string | null; email: string }>
  invites: Array<{ id: string; email: string }>
}

export function PricingSection() {
  const router = useRouter()
  const { account } = useFreshAccount() // ✅ Use centralized hook
  const [loading, setLoading] = useState<string | null>(null)
  const [teamBlockModal, setTeamBlockModal] = useState<TeamBlockModal>({
    show: false,
    members: [],
    invites: [],
  })

  // Get current plan from fresh account data
  // null means not logged in, so don't default to FREE
  const currentPlan = account?.plan || null
  const isLoggedIn = account !== null

  // Check if a plan should be disabled
  const isPlanDisabled = (planId: string): boolean => {
    // If not logged in, no plans are disabled
    if (!isLoggedIn || !currentPlan) return false
    
    // Normalize both: replace hyphens with underscores and uppercase
    const normalizedPlanId = planId.toUpperCase().replace(/-/g, '_')
    const normalizedCurrentPlan = currentPlan.toUpperCase().replace(/-/g, '_')
    
    console.log('[Pricing] Comparing:', { planId, normalizedPlanId, currentPlan, normalizedCurrentPlan, isLoggedIn })
    
    // Can't select current plan again
    if (normalizedCurrentPlan === normalizedPlanId) return true
    
    // If on ONE_TIME, can't "downgrade" to anything (already paid $59.99!)
    if (normalizedCurrentPlan === 'ONE_TIME') {
      // Already paid, can't go to FREE or DELUXE
      if (normalizedPlanId === 'FREE' || normalizedPlanId === 'DELUXE') return true
    }
    
    return false
  }

  // Get button text based on current plan
  const getButtonText = (planId: string, defaultText: string): string => {
    // If not logged in, show default text
    if (!isLoggedIn || !currentPlan) return defaultText
    
    // Normalize both: replace hyphens with underscores and uppercase
    const normalizedPlanId = planId.toUpperCase().replace(/-/g, '_')
    const normalizedCurrentPlan = currentPlan.toUpperCase().replace(/-/g, '_')
    
    if (normalizedCurrentPlan === normalizedPlanId) {
      return 'Current Plan'
    }
    
    if (normalizedCurrentPlan === 'ONE_TIME' && normalizedPlanId === 'DELUXE') {
      return 'Not Available'
    }
    
    return defaultText
  }

  const handlePlanClick = async (planId: string) => {
    setLoading(planId)
    
    try {
      if (planId === 'free') {
        // Check if user is logged in and on a paid plan (downgrade scenario)
        if (account && currentPlan !== 'FREE') {
          // Validate team members before downgrade
          const validationResponse = await fetch('/api/billing/validate-downgrade')
          const validation = await validationResponse.json()

          if (!validation.canDowngrade) {
            // Show modal with team members that need to be removed
            setTeamBlockModal({
              show: true,
              members: validation.activeMembers || [],
              invites: validation.pendingInvites || [],
            })
            setLoading(null)
            return
          }

          // Proceed with downgrade
          const downgradeResponse = await fetch('/api/billing/downgrade', {
            method: 'POST',
          })

          if (!downgradeResponse.ok) {
            const data = await downgradeResponse.json()
            throw new Error(data.error || 'Failed to downgrade')
          }

          // Success - refresh page to show updated plan
          window.location.href = '/dashboard/billing?downgraded=true'
          return
        }
        
        // Not logged in or already on FREE - redirect to register
        router.push('/register?plan=free')
      } else if (planId === 'deluxe' || planId === 'one-time') {
        // Call Stripe checkout API for paid plans
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: planId === 'deluxe' ? 'DELUXE' : 'ONE_TIME',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          // If user is not logged in, redirect to register with plan
          if (response.status === 401) {
            router.push(`/register?plan=${planId}`)
            return
          }
          throw new Error(data.error || 'Failed to create checkout session')
        }

        // Redirect to Stripe checkout
        if (data.url) {
          window.location.href = data.url
        }
      }
    } catch (error) {
      console.error('Error processing plan selection:', error)
      // Show error to user (you can add a toast notification here)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-background dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
            <CreditCard className="w-4 h-4 mr-2" />
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-4 px-4">
            Flexible Plans for Every Seller
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
            Choose the perfect plan to ensure your Amazon products are always compliant.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? 'bg-gradient-to-br from-orange-700 to-blue-700 text-white ring-4 ring-orange-500 dark:ring-orange-400'
                  : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg">
                  Popular
                </div>
              )}
              <div className="p-6 sm:p-8 text-center">
                <h3
                  className={`text-xl sm:text-2xl font-bold mb-2 ${
                    plan.popular ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.popular ? 'text-orange-200' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mt-6 mb-8">
                  <span
                    className={`text-4xl sm:text-5xl font-extrabold ${
                      plan.popular ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-lg sm:text-xl font-medium ${
                        plan.popular ? 'text-orange-200' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className={`p-6 sm:p-8 ${plan.popular ? 'bg-white/5 backdrop-blur-sm' : ''}`}>
                <ul className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start group/item">
                      <CheckCircle
                        className={`w-5 h-5 mr-3 group-hover/item:scale-110 transition-transform duration-200 ${
                          plan.popular ? 'text-green-400' : 'text-green-500 dark:text-green-400'
                        }`}
                      />
                      <span className={`font-medium ${plan.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitIndex) => (
                    <li key={limitIndex} className="flex items-start group/item">
                      <X
                        className={`w-5 h-5 mr-3 group-hover/item:scale-110 transition-transform duration-200 ${
                          plan.popular ? 'text-white/60' : 'text-gray-400 dark:text-gray-600'
                        }`}
                      />
                      <span className={`font-medium ${plan.popular ? 'text-white/60' : 'text-gray-400 dark:text-gray-600'}`}>
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanClick(plan.planId)}
                  disabled={loading === plan.planId || isPlanDisabled(plan.planId)}
                  className={`group w-full py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? 'bg-white text-orange-600 hover:bg-gray-100 shadow-xl'
                      : plan.buttonStyle === 'primary'
                      ? 'bg-gradient-to-r from-orange-600 to-blue-600 text-white hover:from-orange-700 hover:to-blue-700 shadow-xl'
                      : 'bg-white dark:bg-slate-800 border-2 border-orange-500 dark:border-orange-400 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30'
                  }`}
                >
                  {loading === plan.planId ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.popular ? (
                        <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      ) : (
                        <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      )}
                      {getButtonText(plan.planId, plan.buttonText)}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Member Blocking Modal */}
      {teamBlockModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Remove Team Members First
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You need to remove the following team members and cancel pending invitations before downgrading to the Free plan:
                </p>
              </div>
            </div>

            {/* Active Members List */}
            {teamBlockModal.members.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Active Members ({teamBlockModal.members.length})
                </h4>
                <ul className="space-y-2">
                  {teamBlockModal.members.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                        {member.name?.[0] || member.email[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.name || 'Unnamed User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {member.email}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pending Invitations List */}
            {teamBlockModal.invites.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pending Invitations ({teamBlockModal.invites.length})
                </h4>
                <ul className="space-y-2">
                  {teamBlockModal.invites.map((invite) => (
                    <li
                      key={invite.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {invite.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pending invitation
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setTeamBlockModal({ show: false, members: [], invites: [] })
                }
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setTeamBlockModal({ show: false, members: [], invites: [] })
                  window.location.href = '/dashboard/team'
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold hover:from-orange-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Go to Team Management
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

