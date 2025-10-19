'use client'

import { CreditCard, CheckCircle, X, ArrowRight, Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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

export function PricingSection() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePlanClick = async (planId: string) => {
    setLoading(planId)
    
    try {
      // Redirect to register with plan parameter
      // After registration, user will be redirected to billing with this plan
      router.push(`/register?plan=${planId}`)
    } catch (error) {
      console.error('Error processing plan selection:', error)
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
                  disabled={loading === plan.planId}
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
                      {plan.buttonText}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

