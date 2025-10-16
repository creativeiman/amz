'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Download, 
  Share2, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  Clock,
  Globe,
  Package,
  Star,
  ArrowRight,
  BarChart3,
  Shield,
  Target,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface ScanDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  scan: any
  userPlan: string
}

export default function ScanDetailsModal({ isOpen, onClose, scan, userPlan }: ScanDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [detailedScan, setDetailedScan] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch detailed scan data when modal opens
  useEffect(() => {
    if (isOpen && scan?.id) {
      setIsLoading(true)
      fetchDetailedScan(scan.id)
    }
  }, [isOpen, scan?.id])

  const fetchDetailedScan = async (scanId: string) => {
    try {
      const response = await fetch(`/api/scans/${scanId}`)
      if (response.ok) {
        const data = await response.json()
        setDetailedScan(data.scan)
      } else {
        // Fallback to basic scan data
        setDetailedScan(scan)
      }
    } catch (error) {
      console.error('Error fetching detailed scan:', error)
      // Fallback to basic scan data
      setDetailedScan(scan)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !scan) return null

  // Use detailed scan data if available, otherwise fallback to basic scan
  const currentScan = detailedScan || scan

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'high':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const canViewFullReport = userPlan === 'deluxe' || (userPlan === 'one-time' && currentScan.plan === 'one-time')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'issues', label: 'Issues & Recommendations', icon: AlertTriangle },
    { id: 'visual', label: 'Visual Analysis', icon: Target },
    { id: 'references', label: 'Regulatory References', icon: FileText }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentScan.productName}</h2>
            <p className="text-gray-600">{currentScan.category} • {currentScan.marketplaces.join(', ')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-gray-600">Loading scan details...</span>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
        {/* Score Card */}
        {scan.status === 'completed' && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-orange-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(scan.score)}`}>
                    {scan.score}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {12 - scan.issuesFound}
                    </div>
                    <div className="text-sm text-gray-600">Requirements Met</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {scan.issuesFound}
                    </div>
                    <div className="text-sm text-gray-600">Issues Found</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Scan Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Scan Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        scan.status === 'completed' ? 'bg-green-100 text-green-800' :
                        scan.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {scan.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{scan.createdAt.toLocaleString()}</span>
                    </div>
                    {scan.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="text-gray-900">{scan.completedAt.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="text-gray-900 capitalize">{scan.plan}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Risk Assessment</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(scan.riskLevel)}`}>
                        {scan.riskLevel} Risk
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Compliance Score:</span>
                      <span className={`font-semibold ${getScoreColor(scan.score)}`}>
                        {scan.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Issues Found:</span>
                      <span className="font-semibold text-red-600">{scan.issuesFound}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Requirements Met</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-gray-600">Critical Issues</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-6">
              {canViewFullReport ? (
                <div className="space-y-4">
                  {/* Critical Issues */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                      <XCircle className="w-5 h-5 mr-2" />
                      Critical Issues (2)
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <h4 className="font-medium text-red-900">Missing Choking Hazard Warning</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Required per 16 CFR 1500.19 for toys with small parts
                        </p>
                        <p className="text-sm text-red-700 mt-2">
                          <strong>Suggestion:</strong> Add "WARNING: CHOKING HAZARD—Small parts. Not for children under 3 yrs" + symbol
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Priority: Fix before launch</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <h4 className="font-medium text-red-900">Incorrect Age Range</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Age range doesn't match product complexity
                        </p>
                        <p className="text-sm text-red-700 mt-2">
                          <strong>Suggestion:</strong> Update age range to 3+ years based on small parts
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Priority: Fix before launch</p>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Warnings (3)
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-medium text-yellow-900">Batch Number Not Visible</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          CPSIA tracking requirement
                        </p>
                        <p className="text-sm text-yellow-700 mt-2">
                          <strong>Suggestion:</strong> Print indelibly on packaging
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Priority: Recommended</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Feature</h3>
                  <p className="text-gray-600 mb-6">
                    Detailed issue analysis and recommendations are available with our Deluxe plan.
                  </p>
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Upgrade to Deluxe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-6">
              {canViewFullReport ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Label Analysis</h3>
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Visual analysis would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">Annotated label image with issue highlights</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Feature</h3>
                  <p className="text-gray-600 mb-6">
                    Visual label analysis with annotated highlights is available with our Deluxe plan.
                  </p>
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Upgrade to Deluxe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-6">
              {canViewFullReport ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory References</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">FDA Requirements</h4>
                      <p className="text-sm text-gray-600 mb-2">Food and Drug Administration regulations</p>
                      <a href="#" className="text-sm text-blue-600 hover:underline">View FDA Guidelines</a>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">CPSC Standards</h4>
                      <p className="text-sm text-gray-600 mb-2">Consumer Product Safety Commission requirements</p>
                      <a href="#" className="text-sm text-blue-600 hover:underline">View CPSC Standards</a>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">EU Directives</h4>
                      <p className="text-sm text-gray-600 mb-2">European Union regulatory requirements</p>
                      <a href="#" className="text-sm text-blue-600 hover:underline">View EU Directives</a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Feature</h3>
                  <p className="text-gray-600 mb-6">
                    Detailed regulatory references and compliance guidelines are available with our Deluxe plan.
                  </p>
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Upgrade to Deluxe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {scan.status === 'completed' && (
            <button className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  )
}
