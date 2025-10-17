'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Download,
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText,
  Eye,
  RefreshCw,
  Star,
  Shield,
  Package,
  Weight,
  Building,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { MarkdownEditor } from '@/components/markdown-editor'

interface AIResults {
  compliance: {
    score: number
    riskLevel: string
    passed: boolean
  }
  issues: Array<{
    category: string
    severity: string
    description: string
    recommendation: string
    regulation?: string
  }>
  summary: string
  extractedInfo: {
    productName?: string
    ingredients?: string[]
    warnings?: string[]
    certifications?: string[]
    weight?: string
    manufacturer?: string
    countryOfOrigin?: string
  }
  error?: string
  timestamp?: string
}

interface ScanDetail {
  id: string
  productName: string
  category: string
  marketplaces: string[]
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  score: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null
  createdAt: string
  updatedAt: string
  labelUrl: string
  extractedText: string | null
  results: AIResults | null // Full AI response (includes extractedInfo from AI)
  plan: string
}

export default function ScanDetailPage() {
  const router = useRouter()
  const params = useParams()
  const scanId = params.id as string

  const [scan, setScan] = useState<ScanDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'text' | 'recommendations'>('overview')

  useEffect(() => {
    fetchScanDetails()
  }, [scanId])

  // Auto-refresh for active scans (QUEUED or PROCESSING)
  useEffect(() => {
    if (!scan) return
    
    const isActive = scan.status === 'QUEUED' || scan.status === 'PROCESSING'
    
    if (!isActive) return

    // Poll every 3 seconds when scan is active
    console.log('🔄 Auto-polling enabled - scan is', scan.status)
    const interval = setInterval(() => {
      console.log('🔄 Refreshing scan status...')
      fetchScanDetails()
    }, 3000) // Refresh every 3 seconds

    return () => {
      console.log('⏸️  Auto-polling disabled')
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scan?.status])

  const fetchScanDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/dashboard/api/scans/${scanId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Scan not found')
          router.push('/dashboard/scans')
          return
        }
        throw new Error('Failed to fetch scan details')
      }

      const data = await response.json()
      setScan(data)
    } catch (error) {
      console.error('Error fetching scan:', error)
      toast.error('Failed to load scan details')
    } finally {
      setIsLoading(false)
    }
  }

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

  const getRiskColor = (riskLevel: string | null) => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'MEDIUM':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'LOW':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'INFO':
        return 'bg-gray-50 border-gray-200 text-gray-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'WARNING':
      case 'MEDIUM':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading scan details...</p>
        </div>
      </div>
    )
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Not Found</h2>
          <p className="text-gray-600 mb-6">The scan you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/dashboard/scans')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Scans
          </button>
        </div>
      </div>
    )
  }

  // Check if scan is still processing
  if (scan.status === 'QUEUED' || scan.status === 'PROCESSING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-orange-600 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {scan.status === 'QUEUED' ? 'Scan Queued' : 'Processing...'}
          </h2>
          <p className="text-gray-600 mb-6">
            {scan.status === 'QUEUED' 
              ? 'Your scan is waiting in the queue. It will be processed shortly.'
              : 'Your scan is being analyzed by AI. This usually takes 30-90 seconds.'}
          </p>
          <button
            onClick={fetchScanDetails}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Status
          </button>
          <button
            onClick={() => router.push('/dashboard/scans')}
            className="mt-4 text-gray-600 hover:text-gray-900"
          >
            Back to Scans
          </button>
        </div>
      </div>
    )
  }

  // Check if scan failed
  if (scan.status === 'FAILED' && scan.results?.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
          <p className="text-gray-600 mb-4">
            The AI analysis failed for this scan.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-800 font-mono">{scan.results.error}</p>
            {scan.results.timestamp && (
              <p className="text-xs text-red-600 mt-2">
                {new Date(scan.results.timestamp).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={() => router.push('/dashboard/scans')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Back to Scans
          </button>
        </div>
      </div>
    )
  }

  const results = scan.results

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/scans')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scan Results</h1>
                <p className="text-sm text-gray-500">
                  {scan.productName} • {scan.category}
                </p>
              </div>
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
            <div className={`px-6 py-4 rounded-xl border-2 ${getScoreBgColor(scan.score)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(scan.score)}`}>
                  {scan.score}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Compliance Score</div>
                {scan.riskLevel && (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getRiskColor(scan.riskLevel)}`}>
                    {scan.riskLevel} RISK
                  </span>
                )}
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
                {results?.issues?.length || 0}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Status</span>
                <Shield className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {results?.compliance?.passed ? '✅ PASSED' : '❌ FAILED'}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Category</span>
                <Package className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-sm font-bold text-gray-900">
                {scan.category}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Marketplaces</span>
                <Shield className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {scan.marketplaces.length}
              </div>
            </div>
          </div>
        </div>

        {/* Label Image */}
        {scan.labelUrl && (
          <div className="bg-white rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Label</h3>
              <button
                onClick={async () => {
                  try {
                    toast.loading('Preparing download...')
                    
                    // Get presigned URL
                    const response = await fetch(`/dashboard/api/scans/${scan.id}/download`)
                    if (!response.ok) throw new Error('Download failed')
                    const { url, filename } = await response.json()
                    
                    // Fetch file as blob to force download
                    const fileResponse = await fetch(url)
                    if (!fileResponse.ok) throw new Error('Failed to fetch file')
                    const blob = await fileResponse.blob()
                    
                    // Create blob URL and trigger download
                    const blobUrl = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = blobUrl
                    link.download = filename
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    
                    // Clean up blob URL
                    window.URL.revokeObjectURL(blobUrl)
                    
                    toast.dismiss()
                    toast.success('Download started!')
                  } catch (error) {
                    toast.dismiss()
                    toast.error('Failed to download label')
                    console.error('Download error:', error)
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Label
              </button>
            </div>
            <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: '400px' }}>
              {scan.labelUrl.toLowerCase().endsWith('.pdf') ? (
                // PDF Viewer
                <iframe
                  src={`/api${scan.labelUrl}`}
                  className="w-full h-[600px]"
                  title="Product Label PDF"
                />
              ) : (
                // Image Viewer
                <img 
                  src={`/api${scan.labelUrl}`}
                  alt="Product Label"
                  className="max-w-full max-h-[600px] object-contain"
                  onError={(e) => {
                    console.error('Image load error:', scan.labelUrl)
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not found</text></svg>'
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-white/50 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'issues', label: 'Issues', icon: AlertTriangle },
                { id: 'text', label: 'Summary', icon: FileText },
                { id: 'recommendations', label: 'Extracted Info', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'issues' | 'text' | 'recommendations')}
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
                {/* Extracted Information from AI */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {results?.extractedInfo?.productName && (
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Product Name</div>
                            <div className="font-medium">{results.extractedInfo.productName}</div>
                          </div>
                        </div>
                      )}
                      {results?.extractedInfo?.manufacturer && (
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Manufacturer</div>
                            <div className="font-medium">{results.extractedInfo.manufacturer}</div>
                          </div>
                        </div>
                      )}
                      {results?.extractedInfo?.weight && (
                        <div className="flex items-center space-x-3">
                          <Weight className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Weight</div>
                            <div className="font-medium">{results.extractedInfo.weight}</div>
                          </div>
                        </div>
                      )}
                      {results?.extractedInfo?.countryOfOrigin && (
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-600">Country of Origin</div>
                            <div className="font-medium">{results.extractedInfo.countryOfOrigin}</div>
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="space-y-3">
                      {/* Certifications */}
                      {results?.extractedInfo?.certifications && results.extractedInfo.certifications.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Certifications Found</div>
                          <div className="flex flex-wrap gap-2">
                            {results.extractedInfo.certifications.map((cert: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warnings */}
                      {results?.extractedInfo?.warnings && results.extractedInfo.warnings.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Warnings Found</div>
                          <div className="flex flex-wrap gap-2">
                            {results.extractedInfo.warnings.map((warning: string, index: number) => (
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
                {results?.issues && results.issues.length > 0 ? (
                  results.issues.map((issue, index: number) => (
                    <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-white/50 rounded text-xs font-semibold">
                              {issue.severity}
                            </span>
                            <span className="text-xs text-gray-600">{issue.category}</span>
                          </div>
                          <h4 className="font-medium mb-2">{issue.description}</h4>
                          <p className="text-sm font-medium mb-1">
                            <strong>Recommendation:</strong> {issue.recommendation}
                          </p>
                          {issue.regulation && (
                            <p className="text-xs text-gray-600">
                              <strong>Regulation:</strong> {issue.regulation}
                            </p>
                          )}
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

            {/* Summary/Text Tab */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                {results?.summary ? (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Analysis Summary</h3>
                    <MarkdownEditor
                      value={results.summary}
                      readOnly={true}
                      minHeight="500px"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 italic">
                      No summary available.
                    </div>
                  </div>
                )}

                {scan.extractedText && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Extracted Text (OCR)</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {scan.extractedText}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Info Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                {results?.extractedInfo && (
                  <div className="space-y-4">
                    {/* Ingredients */}
                    {results.extractedInfo.ingredients && results.extractedInfo.ingredients.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Ingredients</h4>
                        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                          {results.extractedInfo.ingredients.map((ingredient: string, index: number) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Product Name */}
                    {results.extractedInfo.productName && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Product Name (AI)</h4>
                        <p className="text-sm text-gray-700">{results.extractedInfo.productName}</p>
                      </div>
                    )}

                    {/* All Extracted Info as JSON */}
                    <details className="bg-gray-50 rounded-lg p-4">
                      <summary className="font-medium text-gray-900 cursor-pointer">
                        View Raw Extracted Information
                      </summary>
                      <pre className="mt-4 text-xs text-gray-700 overflow-auto">
                        {JSON.stringify(results.extractedInfo, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}

                {!results?.extractedInfo && (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Extracted Information</h3>
                    <p className="text-gray-600">No additional information was extracted.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Raw AI Response (Debug) */}
        <details className="bg-white rounded-2xl shadow-lg border border-white/50 p-6">
          <summary className="font-semibold text-gray-900 cursor-pointer">
            View Raw AI Response (Debug)
          </summary>
          <pre className="mt-4 text-xs text-gray-700 overflow-auto bg-gray-50 p-4 rounded-lg">
            {JSON.stringify(results, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}
