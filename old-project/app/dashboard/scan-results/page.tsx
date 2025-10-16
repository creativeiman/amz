'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Download, 
  Share, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText,
  Eye,
  RefreshCw,
  Star,
  TrendingUp,
  Shield,
  Package,
  Weight,
  Hash,
  Building
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import ComplianceReport from '../../../components/dashboard/ComplianceReport'

interface ScanResult {
  ocr: {
    extractedText: string
    confidence: number
    wordCount: number
    lineCount: number
  }
  compliance: {
    productName: string
    complianceScore: number
    issues: Array<{
      type: 'missing' | 'warning' | 'critical'
      message: string
      requirement: string
      suggestion: string
    }>
    recommendations: string[]
    extractedInfo: {
      ingredients: string[]
      warnings: string[]
      certifications: string[]
      batchNumber: string | null
      weight: string | null
      manufacturer: string | null
    }
  }
  metadata: {
    category: string
    marketplace: string[]
    scanDate: string
    processingTime: number
  }
}

export default function ScanResultsPage() {
  const router = useRouter()
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showComplianceReport, setShowComplianceReport] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'text' | 'recommendations'>('overview')

  useEffect(() => {
    // Get scan results from localStorage
    const storedResult = localStorage.getItem('latestScanResult')
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult)
        setScanResult(result)
        
        // Store scan ID for history page access
        if (result.scanId) {
          localStorage.setItem('currentScanId', result.scanId)
        }
      } catch (error) {
        console.error('Error parsing scan results:', error)
        toast.error('Failed to load scan results')
        router.push('/dashboard')
      }
    } else {
      toast.error('No scan results found')
      router.push('/dashboard')
    }
    setIsLoading(false)
  }, [router])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-green-50 border-green-200 text-green-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!scanResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Scan Results</h2>
          <p className="text-gray-600 mb-6">No scan results found. Please start a new scan.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Start New Scan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scan Results</h1>
                <p className="text-sm text-gray-500">
                  {scanResult.compliance.productName} • {scanResult.metadata.category}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowComplianceReport(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Detailed Report</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Compliance Score</h2>
              <p className="text-gray-600">Overall compliance assessment</p>
            </div>
            <div className={`px-6 py-4 rounded-xl border-2 ${getScoreBgColor(scanResult.compliance.complianceScore)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(scanResult.compliance.complianceScore)}`}>
                  {scanResult.compliance.complianceScore}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Compliance Score</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Issues Found</span>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {scanResult.compliance.issues.length}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Text Confidence</span>
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(scanResult.ocr.confidence * 100)}%
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Words Extracted</span>
                <Package className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {scanResult.ocr.wordCount}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Marketplaces</span>
                <Shield className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {scanResult.metadata.marketplace.length}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'issues', label: 'Issues', icon: AlertTriangle },
                { id: 'text', label: 'Extracted Text', icon: FileText },
                { id: 'recommendations', label: 'Recommendations', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Extracted Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Information</h3>
                    <div className="space-y-3">
                      {scanResult.compliance.extractedInfo.manufacturer && (
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Manufacturer</div>
                            <div className="font-medium">{scanResult.compliance.extractedInfo.manufacturer}</div>
                          </div>
                        </div>
                      )}
                      {scanResult.compliance.extractedInfo.weight && (
                        <div className="flex items-center space-x-3">
                          <Weight className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Weight</div>
                            <div className="font-medium">{scanResult.compliance.extractedInfo.weight}</div>
                          </div>
                        </div>
                      )}
                      {scanResult.compliance.extractedInfo.batchNumber && (
                        <div className="flex items-center space-x-3">
                          <Hash className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Batch Number</div>
                            <div className="font-medium">{scanResult.compliance.extractedInfo.batchNumber}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certifications & Warnings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications & Warnings</h3>
                    <div className="space-y-3">
                      {scanResult.compliance.extractedInfo.certifications.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Certifications Found</div>
                          <div className="flex flex-wrap gap-2">
                            {scanResult.compliance.extractedInfo.certifications.map((cert, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {scanResult.compliance.extractedInfo.warnings.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Warnings Found</div>
                          <div className="flex flex-wrap gap-2">
                            {scanResult.compliance.extractedInfo.warnings.map((warning, index) => (
                              <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                {warning}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Issues Tab */}
            {activeTab === 'issues' && (
              <div className="space-y-4">
                {scanResult.compliance.issues.length > 0 ? (
                  scanResult.compliance.issues.map((issue, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${getIssueColor(issue.type)}`}>
                      <div className="flex items-start space-x-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{issue.message}</h4>
                          <p className="text-sm mb-2">{issue.requirement}</p>
                          <p className="text-sm font-medium">Suggestion: {issue.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Issues Found</h3>
                    <p className="text-gray-600">Your label appears to be compliant!</p>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Text Tab */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Raw Extracted Text</h3>
                  {scanResult.ocr.extractedText ? (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {scanResult.ocr.extractedText}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No text was extracted from the image. Please try uploading a clearer image.
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-blue-600 mb-1">Confidence Score</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {Math.round(scanResult.ocr.confidence * 100)}%
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-600 mb-1">Words Extracted</div>
                    <div className="text-2xl font-bold text-green-900">
                      {scanResult.ocr.wordCount}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-sm text-orange-600 mb-1">Lines Found</div>
                    <div className="text-2xl font-bold text-orange-900">
                      {scanResult.ocr.lineCount}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                {scanResult.compliance.recommendations.length > 0 ? (
                  scanResult.compliance.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <Star className="w-5 h-5 text-blue-500 mt-0.5" />
                        <p className="text-blue-800">{recommendation}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations</h3>
                    <p className="text-gray-600">Your label is already well-optimized!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compliance Report Modal */}
      {showComplianceReport && scanResult && (
        <ComplianceReport
          report={{
            productName: scanResult.compliance.productName,
            category: scanResult.metadata.category,
            country: scanResult.metadata.marketplace[0] || 'USA',
            status: scanResult.compliance.complianceScore >= 80 ? 'compliant' : 
                   scanResult.compliance.complianceScore >= 60 ? 'warning' : 'non-compliant',
            riskLevel: scanResult.compliance.complianceScore >= 80 ? 'Low' : 
                      scanResult.compliance.complianceScore >= 60 ? 'Medium' : 'High',
            score: scanResult.compliance.complianceScore,
            report: {
              score: scanResult.compliance.complianceScore,
              totalRules: scanResult.compliance.issues.length,
              passedRules: scanResult.compliance.issues.filter(issue => issue.type !== 'critical').length,
              failedRules: scanResult.compliance.issues.filter(issue => issue.type === 'critical').length,
              issues: {
                Critical: scanResult.compliance.issues.filter(issue => issue.type === 'critical').map(issue => ({
                  element: issue.requirement,
                  suggestion: issue.suggestion
                })),
                Warning: scanResult.compliance.issues.filter(issue => issue.type === 'warning').map(issue => ({
                  element: issue.requirement,
                  suggestion: issue.suggestion
                })),
                Recommendation: scanResult.compliance.issues.filter(issue => issue.type === 'missing').map(issue => ({
                  element: issue.requirement,
                  suggestion: issue.suggestion
                }))
              },
              suggestions: scanResult.compliance.recommendations
            },
            recommendations: {
              immediate: scanResult.compliance.issues.filter(issue => issue.type === 'critical').map(issue => issue.suggestion),
              recommended: scanResult.compliance.issues.filter(issue => issue.type === 'warning').map(issue => issue.suggestion),
              optional: scanResult.compliance.issues.filter(issue => issue.type === 'missing').map(issue => issue.suggestion)
            }
          }}
          onClose={() => setShowComplianceReport(false)}
        />
      )}
    </div>
  )
}
