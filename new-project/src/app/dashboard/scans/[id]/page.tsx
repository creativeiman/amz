'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
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
  AlertCircle,
  Sparkles,
  ArrowRight
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
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800'
    return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
  }

  const getRiskColor = (riskLevel: string | null) => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300'
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/30 dark:border-yellow-800 dark:text-yellow-300'
      case 'MEDIUM':
        return 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/30 dark:border-orange-800 dark:text-orange-300'
      case 'LOW':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300'
      case 'INFO':
        return 'bg-muted border-border text-muted-foreground'
      default:
        return 'bg-muted border-border text-muted-foreground'
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

  // Check if user can view full report based on their plan
  const canViewFullReport = () => {
    if (!scan) return false
    const userPlan = scan.plan
    
    // DELUXE users can view everything
    if (userPlan === 'DELUXE') return true
    
    // ONE_TIME users can view their one-time scan
    if (userPlan === 'ONE_TIME') return true
    
    // FREE users cannot view detailed reports
    return false
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 dark:text-orange-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading scan details...</p>
        </div>
      </div>
    )
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Scan Not Found</h2>
          <p className="text-muted-foreground mb-6">The scan you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/dashboard/scans')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-orange-600 dark:text-orange-400 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {scan.status === 'QUEUED' ? 'Scan Queued' : 'Processing...'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {scan.status === 'QUEUED' 
              ? 'Your scan is waiting in the queue. It will be processed shortly.'
              : 'Your scan is being analyzed by AI. This usually takes 30-90 seconds.'}
          </p>
          <button
            onClick={fetchScanDetails}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Status
          </button>
          <button
            onClick={() => router.push('/dashboard/scans')}
            className="mt-4 text-muted-foreground hover:text-foreground"
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <XCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Failed</h2>
          <p className="text-muted-foreground mb-4">
            The AI analysis failed for this scan.
          </p>
          <div className="bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-800 dark:text-red-300 font-mono">{scan.results.error}</p>
            {scan.results.timestamp && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                {new Date(scan.results.timestamp).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={() => router.push('/dashboard/scans')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600"
          >
            Back to Scans
          </button>
        </div>
      </div>
    )
  }

  const results = scan.results

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => router.push('/dashboard/scans')}
              className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">Scan Results</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {scan.productName} • {scan.category}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-4 sm:py-6">
        {/* Score Card */}
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg border p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Compliance Score</h2>
              <p className="text-sm text-muted-foreground">Overall compliance assessment</p>
            </div>
            <div className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 ${getScoreBgColor(scan.score)} self-start sm:self-auto`}>
              <div className="text-center">
                <div className={`text-3xl sm:text-4xl font-bold ${getScoreColor(scan.score)}`}>
                  {scan.score}%
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Compliance Score</div>
                {scan.riskLevel && (
                  <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getRiskColor(scan.riskLevel)}`}>
                    {scan.riskLevel} RISK
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Issues Found</span>
                <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {results?.issues?.length || 0}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Shield className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="text-lg font-bold text-foreground">
                {results?.compliance?.passed ? '✅ PASSED' : '❌ FAILED'}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Category</span>
                <Package className="w-4 h-4 text-green-500 dark:text-green-400" />
              </div>
              <div className="text-sm font-bold text-foreground">
                {scan.category}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Marketplaces</span>
                <Shield className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {scan.marketplaces.length}
              </div>
            </div>
          </div>
        </div>

        {/* Label Image */}
        {scan.labelUrl && (
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg border p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Product Label</h3>
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
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 transition-colors w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Download Label
              </button>
            </div>
            <div className="relative w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: '300px' }}>
              {scan.labelUrl.toLowerCase().endsWith('.pdf') ? (
                // PDF Viewer
                <iframe
                  src={`/api${scan.labelUrl}`}
                  className="w-full h-[400px] sm:h-[600px]"
                  title="Product Label PDF"
                />
              ) : (
                // Image Viewer
                <img 
                  src={`/api${scan.labelUrl}`}
                  alt="Product Label"
                  className="max-w-full max-h-[400px] sm:max-h-[600px] object-contain"
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
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg border mb-4 sm:mb-6">
          <div className="border-b overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'issues', label: 'Issues', icon: AlertTriangle },
                { id: 'text', label: 'Summary', icon: FileText },
                { id: 'recommendations', label: 'Extracted Info', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'issues' | 'text' | 'recommendations')}
                  className={`flex items-center px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Extracted Information from AI */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Extracted Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {results?.extractedInfo?.productName && (
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Product Name</div>
                            <div className="font-medium text-foreground">{results.extractedInfo.productName}</div>
                          </div>
                        </div>
                      )}
                      {results?.extractedInfo?.manufacturer && (
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Manufacturer</div>
                            <div className="font-medium text-foreground">{results.extractedInfo.manufacturer}</div>
                          </div>
                        </div>
                      )}
                      {results?.extractedInfo?.weight && (
                        <div className="flex items-center space-x-3">
                          <Weight className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Weight</div>
                            <div className="font-medium text-foreground">{results.extractedInfo.weight}</div>
                          </div>
                        </div>
                      )}
                      {results?.extractedInfo?.countryOfOrigin && (
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Country of Origin</div>
                            <div className="font-medium text-foreground">{results.extractedInfo.countryOfOrigin}</div>
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="space-y-3">
                      {/* Certifications */}
                      {results?.extractedInfo?.certifications && results.extractedInfo.certifications.length > 0 && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Certifications Found</div>
                          <div className="flex flex-wrap gap-2">
                            {results.extractedInfo.certifications.map((cert: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs rounded-full">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warnings */}
                      {results?.extractedInfo?.warnings && results.extractedInfo.warnings.length > 0 && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Warnings Found</div>
                          <div className="flex flex-wrap gap-2">
                            {results.extractedInfo.warnings.map((warning: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs rounded-full">
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
                {canViewFullReport() ? (
                  <>
                    {results?.issues && results.issues.length > 0 ? (
                      results.issues.map((issue, index: number) => (
                        <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                          <div className="flex items-start space-x-3">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-background/50 rounded text-xs font-semibold">
                                  {issue.severity}
                                </span>
                                <span className="text-xs text-muted-foreground">{issue.category}</span>
                              </div>
                              <h4 className="font-medium mb-2">{issue.description}</h4>
                              <p className="text-sm font-medium mb-1">
                                <strong>Recommendation:</strong> {issue.recommendation}
                              </p>
                              {issue.regulation && (
                                <p className="text-xs text-muted-foreground">
                                  <strong>Regulation:</strong> {issue.regulation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Issues Found</h3>
                        <p className="text-muted-foreground">Your label appears to be compliant!</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="max-w-md mx-auto">
                      <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Premium Feature</h3>
                      <p className="text-muted-foreground mb-6">
                        Detailed issue analysis and recommendations are available with our Deluxe or One-Time plans.
                      </p>
                      <div className="bg-muted/50 border rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-semibold text-foreground mb-2">Upgrade to unlock:</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Detailed compliance issues breakdown
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Actionable recommendations
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Regulatory references & citations
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Priority levels for each issue
                          </li>
                        </ul>
                      </div>
                      <Link
                        href="/dashboard/billing"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Upgrade Your Plan
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary/Text Tab */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                {canViewFullReport() ? (
                  <>
                    {results?.summary ? (
                      <div>
                        <h3 className="font-medium text-foreground mb-4">Analysis Summary</h3>
                        <MarkdownEditor
                          value={results.summary}
                          readOnly={true}
                          minHeight="500px"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted rounded-lg p-4">
                        <div className="text-sm text-muted-foreground italic">
                          No summary available.
                        </div>
                      </div>
                    )}

                    {scan.extractedText && (
                      <div className="bg-muted rounded-lg p-4 mt-4">
                        <h3 className="font-medium text-foreground mb-2">Extracted Text (OCR)</h3>
                        <div className="text-sm text-foreground whitespace-pre-wrap">
                          {scan.extractedText}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="max-w-md mx-auto">
                      <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Premium Feature</h3>
                      <p className="text-muted-foreground mb-6">
                        The detailed AI-generated analysis summary is available with our Deluxe or One-Time plans.
                      </p>
                      <div className="bg-muted/50 border rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-semibold text-foreground mb-2">Upgrade to unlock:</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Comprehensive AI-written summary
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Complete OCR extracted text
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            In-depth compliance analysis
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Market-specific recommendations
                          </li>
                        </ul>
                      </div>
                      <Link
                        href="/dashboard/billing"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Upgrade Your Plan
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Info Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                {canViewFullReport() ? (
                  <>
                    {results?.extractedInfo && (
                      <div className="space-y-4">
                        {/* Ingredients */}
                        {results.extractedInfo.ingredients && results.extractedInfo.ingredients.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
                            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Ingredients</h4>
                            <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-300 space-y-1">
                              {results.extractedInfo.ingredients.map((ingredient: string, index: number) => (
                                <li key={index}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Product Name */}
                        {results.extractedInfo.productName && (
                          <div className="bg-muted rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-2">Product Name (AI)</h4>
                            <p className="text-sm text-muted-foreground">{results.extractedInfo.productName}</p>
                          </div>
                        )}

                        {/* All Extracted Info as JSON */}
                        <details className="bg-muted rounded-lg p-4">
                          <summary className="font-medium text-foreground cursor-pointer">
                            View Raw Extracted Information
                          </summary>
                          <pre className="mt-4 text-xs text-muted-foreground overflow-auto">
                            {JSON.stringify(results.extractedInfo, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}

                    {!results?.extractedInfo && (
                      <div className="text-center py-8">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Extracted Information</h3>
                        <p className="text-muted-foreground">No additional information was extracted.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="max-w-md mx-auto">
                      <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Star className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Premium Feature</h3>
                      <p className="text-muted-foreground mb-6">
                        AI-extracted label information and detailed data extraction are available with our Deluxe or One-Time plans.
                      </p>
                      <div className="bg-muted/50 border rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm font-semibold text-foreground mb-2">Upgrade to unlock:</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            AI-extracted ingredients list
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Product details & certifications
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Warnings & safety information
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Manufacturer & origin data
                          </li>
                        </ul>
                      </div>
                      <Link
                        href="/dashboard/billing"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Upgrade Your Plan
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Raw AI Response (Debug) */}
        <details className="bg-card rounded-2xl shadow-lg border p-6">
          <summary className="font-semibold text-foreground cursor-pointer">
            View Raw AI Response (Debug)
          </summary>
          <pre className="mt-4 text-xs text-muted-foreground overflow-auto bg-muted p-4 rounded-lg">
            {JSON.stringify(results, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}
