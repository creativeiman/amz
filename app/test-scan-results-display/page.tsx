'use client'

import { useState, useEffect } from 'react'
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

export default function TestScanResultsDisplay() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load test scan results
    const loadTestResults = async () => {
      try {
        const response = await fetch('/api/test-scan-results?category=baby&marketplace=UK')
        const data = await response.json()
        
        if (data.success) {
          setScanResult(data.scanResult)
          console.log('Test scan results loaded:', data.scanResult)
        } else {
          toast.error('Failed to load test results')
        }
      } catch (error) {
        console.error('Error loading test results:', error)
        toast.error('Failed to load test results')
      } finally {
        setIsLoading(false)
      }
    }

    loadTestResults()
  }, [])

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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Scan Results</h1>
              <p className="text-gray-600 mt-2">
                {scanResult.compliance.productName} • {scanResult.metadata.category} • {scanResult.metadata.marketplace.join(', ')}
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4 mr-2 inline" />
                Download Report
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Share className="w-4 h-4 mr-2 inline" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="mb-8">
          <div className="text-center">
            <div className={`px-6 py-4 rounded-xl border-2 ${getScoreBgColor(scanResult.compliance.complianceScore)}`}>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(scanResult.compliance.complianceScore)}`}>
                  {scanResult.compliance.complianceScore}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Compliance Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

        {/* Issues List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Issues</h3>
          <div className="space-y-4">
            {scanResult.compliance.issues.map((issue, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getIssueColor(issue.type)}`}>
                <div className="flex items-start space-x-3">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{issue.message}</h4>
                    <p className="text-sm text-gray-600 mt-1">{issue.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Debug Information</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(scanResult, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}


