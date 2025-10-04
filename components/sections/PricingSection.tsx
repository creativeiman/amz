'use client'

import { Payments, CheckCircle, X, ArrowRight, Star, Rocket } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    description: 'For occasional sellers',
    price: '$19',
    period: 'per label',
    features: [
      'Single marketplace analysis',
      'Basic compliance report',
      'Issue identification',
    ],
    limitations: [
      'Multi-marketplace support',
      'Detailed recommendations',
    ],
    buttonText: 'Choose Basic',
    buttonStyle: 'outline',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For regular sellers',
    price: '$49',
    period: 'per month',
    features: [
      '10 labels per month',
      'Multi-marketplace analysis',
      'Detailed compliance report',
      'Specific recommendations',
    ],
    limitations: [
      'Priority support',
    ],
    buttonText: 'Choose Professional',
    buttonStyle: 'primary',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For high-volume sellers',
    price: '$199',
    period: 'per month',
    features: [
      'Unlimited labels',
      'All marketplace analysis',
      'Expert compliance reports',
      'Detailed recommendations',
      'Priority support',
    ],
    limitations: [],
    buttonText: 'Choose Enterprise',
    buttonStyle: 'outline',
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
            <Payments className="w-4 h-4 mr-2" />
            Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Simple Pricing Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that works best for your business needs with transparent, no-hidden-fees pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-4 border-purple-200 shadow-2xl hover:shadow-purple-500/25'
                  : 'bg-white/80 backdrop-blur-sm border border-white/50 hover:shadow-2xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm shadow-lg">
                  <Star className="w-4 h-4 inline mr-1" />
                  Popular
                </div>
              )}

              {/* Header */}
              <div className={`p-8 ${plan.popular ? 'border-b border-white/20' : 'border-b border-gray-200/50'}`}>
                <h3 className={`text-3xl font-bold mb-3 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-lg mb-8 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <div className="flex items-end mb-6">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`ml-3 text-lg ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className={`p-8 ${plan.popular ? 'bg-white/5 backdrop-blur-sm' : ''}`}>
                <ul className="space-y-5 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start group/item">
                      <CheckCircle
                        className={`w-5 h-5 mr-3 group-hover/item:scale-110 transition-transform duration-200 ${
                          plan.popular ? 'text-green-400' : 'text-green-500'
                        }`}
                      />
                      <span className={`font-medium ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitIndex) => (
                    <li key={limitIndex} className="flex items-start group/item">
                      <X
                        className={`w-5 h-5 mr-3 group-hover/item:scale-110 transition-transform duration-200 ${
                          plan.popular ? 'text-white/60' : 'text-gray-400'
                        }`}
                      />
                      <span className={`font-medium ${plan.popular ? 'text-white/60' : 'text-gray-400'}`}>
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`group w-full py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-xl'
                      : plan.buttonStyle === 'primary'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-xl'
                      : 'bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {plan.popular ? (
                    <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  ) : (
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  )}
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
