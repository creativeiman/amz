'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Globe,
  Save,
  CheckCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../../../contexts/LanguageContext'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    notifications: true,
    emailUpdates: true,
    language: 'en'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      fetchUserProfile()
    }
  }, [status, session, router])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.profile.name || '',
          email: data.profile.email || '',
          notifications: data.profile.notifications ?? true,
          emailUpdates: data.profile.emailUpdates ?? true,
          language: data.profile.language || language
        })
      } else {
        // Fallback to session data
        setFormData({
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          notifications: true,
          emailUpdates: true,
          language: language
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Fallback to session data
      setFormData({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        notifications: true,
        emailUpdates: true,
        language: language
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
      
      // If language is being changed, update the global language context
      if (name === 'language') {
        setLanguage(value)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(t('settings.settingsUpdated'))
        
        // Update the session with new user data from the API response
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.user.name,
            email: data.user.email
          }
        })
        
        // Dispatch a custom event to notify all components of the session update
        window.dispatchEvent(new CustomEvent('sessionUpdate', {
          detail: {
            user: {
              ...session?.user,
              name: data.user.name,
              email: data.user.email
            }
          }
        }))
        
        // Small delay to ensure session update is processed
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(t('settings.updateFailed'))
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
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.backToDashboard')}
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
                <p className="text-sm text-gray-600">{t('settings.manageAccount')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <a href="#profile" className="flex items-center px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg">
                <User className="w-4 h-4 mr-3" />
                Profile
              </a>
              <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <Bell className="w-4 h-4 mr-3" />
                Notifications
              </a>
              <a href="#privacy" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <Shield className="w-4 h-4 mr-3" />
                Privacy
              </a>
              <a href="#preferences" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                <Globe className="w-4 h-4 mr-3" />
                Preferences
              </a>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your settings...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Section */}
                <div id="profile">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {t('settings.profileInformation')}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('settings.fullName')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('settings.emailAddress')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Notifications Section */}
                <div id="notifications" className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications about your scans and updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications"
                          checked={formData.notifications}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email Updates</h4>
                        <p className="text-sm text-gray-600">Receive email notifications about important updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailUpdates"
                          checked={formData.emailUpdates}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div id="preferences" className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    {t('settings.preferences')}
                  </h3>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.language')}
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {t('settings.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {t('settings.saveChanges')}
                      </>
                    )}
                  </button>
                </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
