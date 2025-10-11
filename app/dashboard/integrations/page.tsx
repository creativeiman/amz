'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Shield, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Database,
  Zap,
  Eye,
  Settings,
  Plus,
  X,
  ShoppingCart,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../../../contexts/LanguageContext'
import { useUpgradeModal } from '../../../hooks/useUpgradeModal'
import UpgradeModal from '../../../components/dashboard/UpgradeModal'

interface AmazonIntegration {
  id: string
  name: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: Date
  asinCount: number
  marketplace: string
  sellerId: string
}

interface ASIN {
  asin: string
  title: string
  category: string
  status: 'active' | 'inactive'
  lastChecked?: Date
  complianceScore?: number
  riskLevel?: 'low' | 'medium' | 'high'
}

export default function IntegrationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const { isOpen: isUpgradeModalOpen, trigger: upgradeTrigger, closeUpgradeModal, triggerUpgrade } = useUpgradeModal()
  const [integrations, setIntegrations] = useState<AmazonIntegration[]>([])
  const [asins, setAsins] = useState<ASIN[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [selectedAsins, setSelectedAsins] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Get user plan from session
  const userPlan = (session?.user as any)?.plan || 'free'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      // Mock data - in real app, fetch from API
      setIntegrations([
        {
          id: '1',
          name: 'Amazon Seller Central',
          status: 'connected',
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          asinCount: 45,
          marketplace: 'US',
          sellerId: 'A1B2C3D4E5F6G7'
        }
      ])
      
      setAsins([
        {
          asin: 'B08N5WRWNW',
          title: 'Echo Dot (4th Gen) | Smart speaker with Alexa',
          category: 'Electronics',
          status: 'active',
          lastChecked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          complianceScore: 85,
          riskLevel: 'low'
        },
        {
          asin: 'B07XJ8C8F5',
          title: 'Fire TV Stick 4K streaming device',
          category: 'Electronics',
          status: 'active',
          lastChecked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          complianceScore: 92,
          riskLevel: 'low'
        },
        {
          asin: 'B08N5WRWNW',
          title: 'Baby Bottle Set - 6 Pack',
          category: 'Baby Products',
          status: 'active',
          complianceScore: 78,
          riskLevel: 'medium'
        }
      ])
      
      setIsLoading(false)
    }
  }, [status, session, router])

  const handleConnectAmazon = async () => {
    if (userPlan === 'free') {
      triggerUpgrade('amazon-integration')
      return
    }

    setIsConnecting(true)
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newIntegration: AmazonIntegration = {
        id: Date.now().toString(),
        name: 'Amazon Seller Central',
        status: 'connected',
        lastSync: new Date(),
        asinCount: 0,
        marketplace: 'US',
        sellerId: 'A1B2C3D4E5F6G7'
      }
      
      setIntegrations(prev => [...prev, newIntegration])
      toast.success('Amazon Seller Central connected successfully!')
    } catch (error) {
      toast.error('Failed to connect to Amazon Seller Central')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSyncASINs = async () => {
    setIsScanning(true)
    try {
      // Simulate ASIN import
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newAsins: ASIN[] = [
        {
          asin: 'B08N5WRWNW',
          title: 'Echo Dot (4th Gen) | Smart speaker with Alexa',
          category: 'Electronics',
          status: 'active',
          lastChecked: new Date(),
          complianceScore: 85,
          riskLevel: 'low'
        },
        {
          asin: 'B07XJ8C8F5',
          title: 'Fire TV Stick 4K streaming device',
          category: 'Electronics',
          status: 'active',
          lastChecked: new Date(),
          complianceScore: 92,
          riskLevel: 'low'
        }
      ]
      
      setAsins(prev => [...prev, ...newAsins])
      toast.success('ASINs imported successfully!')
    } catch (error) {
      toast.error('Failed to sync ASINs')
    } finally {
      setIsScanning(false)
    }
  }

  const handleBatchScan = async () => {
    if (selectedAsins.length === 0) {
      toast.error('Please select ASINs to scan')
      return
    }

    setIsScanning(true)
    try {
      // Simulate batch scan
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Update compliance scores for selected ASINs
      setAsins(prev => prev.map(asin => 
        selectedAsins.includes(asin.asin) 
          ? { ...asin, lastChecked: new Date(), complianceScore: Math.floor(Math.random() * 40) + 60 }
          : asin
      ))
      
      toast.success(`Compliance scan completed for ${selectedAsins.length} products!`)
      setSelectedAsins([])
    } catch (error) {
      toast.error('Failed to complete batch scan')
    } finally {
      setIsScanning(false)
    }
  }

  const toggleASINSelection = (asin: string) => {
    setSelectedAsins(prev => 
      prev.includes(asin) 
        ? prev.filter(id => id !== asin)
        : [...prev, asin]
    )
  }

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (status === 'loading' || isLoading) {
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
                <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
                <p className="text-sm text-gray-600">Connect your Amazon Seller Central account</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {userPlan === 'free' ? (
          // Free plan upgrade section
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 lg:p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Amazon Integration</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Connect your Amazon Seller Central account to automatically scan all your active listings for compliance issues. 
                Perfect for sellers with multiple products who need comprehensive compliance monitoring.
              </p>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amazon Integration Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Import all active ASINs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Batch compliance scanning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Automatic risk flagging</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Compliance portfolio view</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => triggerUpgrade('amazon-integration')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 text-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Upgrade to Connect Amazon - $15/month
              </button>
            </div>
          </div>
        ) : (
          // Paid plan integrations
          <div className="space-y-8">
            {/* Connected Integrations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Connected Integrations</h2>
                {integrations.length === 0 && (
                  <button
                    onClick={handleConnectAmazon}
                    disabled={isConnecting}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Connect Amazon
                      </>
                    )}
                  </button>
                )}
              </div>

              {integrations.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations connected</h3>
                  <p className="text-gray-600 mb-6">Connect your Amazon Seller Central account to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-sm text-gray-600">
                              {integration.asinCount} ASINs • Last sync: {integration.lastSync.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </span>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ASIN Management */}
            {integrations.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your ASINs</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSyncASINs}
                      disabled={isScanning}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                      {isScanning ? 'Syncing...' : 'Sync ASINs'}
                    </button>
                    {selectedAsins.length > 0 && (
                      <button
                        onClick={handleBatchScan}
                        disabled={isScanning}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Scan Selected ({selectedAsins.length})
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {asins.map((asin) => (
                    <div key={asin.asin} className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedAsins.includes(asin.asin)}
                            onChange={() => toggleASINSelection(asin.asin)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{asin.title}</h3>
                              <span className="text-sm text-gray-500">ASIN: {asin.asin}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="capitalize">{asin.category}</span>
                              <span className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                                asin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {asin.status}
                              </span>
                              {asin.complianceScore && (
                                <span className="flex items-center space-x-1">
                                  <BarChart3 className="w-4 h-4" />
                                  <span>{asin.complianceScore}% compliant</span>
                                </span>
                              )}
                              {asin.riskLevel && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(asin.riskLevel)}`}>
                                  {asin.riskLevel} risk
                                </span>
                              )}
                            </div>
                            {asin.lastChecked && (
                              <p className="text-xs text-gray-500 mt-1">
                                Last checked: {asin.lastChecked.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                            <Zap className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        trigger={upgradeTrigger}
      />
    </div>
  )
}
