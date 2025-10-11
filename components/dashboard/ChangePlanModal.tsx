'use client'

import { useState } from 'react'
import { X, Check, AlertCircle, CreditCard, Calendar, Users } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ChangePlanModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  onPlanChange: (newPlan: string) => void
}

export default function ChangePlanModal({ isOpen, onClose, currentPlan, onPlanChange }: ChangePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 'Free',
      description: '1 scan per account lifetime',
      features: ['1 scan per account lifetime', 'Basic compliance report', 'View only (no PDF export)'],
      current: currentPlan === 'free'
    },
    {
      id: 'deluxe',
      name: 'Deluxe Plan',
      price: '$29.99/month',
      description: 'Unlimited scans with full features',
      features: ['Unlimited scans', 'Full visual annotations', 'PDF exports', 'Amazon FBA integration', 'Team collaboration'],
      current: currentPlan === 'deluxe'
    },
    {
      id: 'one-time',
      name: 'One-Time Plan',
      price: '$59.99',
      description: 'Single comprehensive scan',
      features: ['1 comprehensive scan', 'All Deluxe features', '30-day access', 'No recurring charges'],
      current: currentPlan === 'one-time'
    }
  ]

  const handlePlanChange = async () => {
    if (!selectedPlan || selectedPlan === currentPlan) {
      toast.error('Please select a different plan')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement actual plan change logic with Stripe
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      toast.success(`Plan changed to ${plans.find(p => p.id === selectedPlan)?.name}`)
      onPlanChange(selectedPlan)
      onClose()
    } catch (error) {
      toast.error('Failed to change plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (currentPlan === 'free') {
      toast.error('No active subscription to cancel')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement actual cancellation logic with Stripe
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      toast.success('Subscription cancelled successfully')
      onPlanChange('free')
      onClose()
    } catch (error) {
      toast.error('Failed to cancel subscription. Please contact support.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Change Plan</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-orange-500 bg-orange-50'
                    : plan.current
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.current && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Current
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{plan.price}</p>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  
                  <ul className="space-y-2 text-sm text-gray-600">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePlanChange}
              disabled={!selectedPlan || selectedPlan === currentPlan || isLoading}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : 'Change Plan'}
            </button>
            
            {currentPlan !== 'free' && (
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Cancel Subscription'}
              </button>
            )}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Plan changes take effect immediately</li>
                  <li>Downgrades may result in feature limitations</li>
                  <li>Refunds are processed according to our policy</li>
                  <li>Contact support for assistance with plan changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



