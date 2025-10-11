'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Building, 
  Globe, 
  Package, 
  CheckCircle,
  ArrowRight,
  Save
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SetupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    primaryMarketplace: '',
    productCategories: [] as string[],
    acceptTerms: false
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Save user preferences
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Preferences saved successfully!')
        router.push('/dashboard')
      } else {
        toast.error('Failed to save preferences')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-blue-100 text-orange-800 rounded-full text-sm font-semibold mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            Welcome to ProductLabelChecker!
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Let's set up your account
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us personalize your compliance checking experience by sharing a few details about your business.
          </p>
        </div>

        {/* Setup Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Business Name (Optional but encouraged)
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                placeholder="Enter your business name"
              />
              <p className="mt-2 text-sm text-gray-600">
                This helps us provide more personalized compliance recommendations.
              </p>
            </div>

            {/* Primary Marketplace */}
            <div>
              <label htmlFor="primaryMarketplace" className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Primary Marketplace
              </label>
              <select
                id="primaryMarketplace"
                name="primaryMarketplace"
                value={formData.primaryMarketplace}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              >
                <option value="">Select your primary marketplace</option>
                <option value="US">United States (US)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="Germany">Germany (EU)</option>
              </select>
              <p className="mt-2 text-sm text-gray-600">
                Choose the marketplace where you sell most of your products.
              </p>
            </div>

            {/* Product Categories */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Product Category Focus (Multi-select)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Toys', 'Baby Products', 'Cosmetics'].map((category) => (
                  <label
                    key={category}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.productCategories.includes(category)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.productCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        formData.productCategories.includes(category)
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.productCategories.includes(category) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Select all categories that apply to your products. This helps us provide relevant compliance requirements.
              </p>
            </div>

            {/* Terms and Privacy */}
            <div className="border-t border-gray-200 pt-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I accept the{' '}
                  <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.acceptTerms}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Complete Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



