'use client'

import { useState } from 'react'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Share2, 
  FileText,
  TrendingUp,
  Shield,
  AlertCircle,
  Info
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ComplianceReportProps {
  report: {
    productName: string
    category: string
    country: string
    status: 'compliant' | 'warning' | 'non-compliant'
    riskLevel: 'Low' | 'Medium' | 'High'
    score: number
    report: {
      score: number
      totalRules: number
      passedRules: number
      failedRules: number
      issues: {
        Critical: Array<{
          element: string
          suggestion: string
        }>
        Warning: Array<{
          element: string
          suggestion: string
        }>
        Recommendation: Array<{
          element: string
          suggestion: string
        }>
      }
      suggestions: string[]
    }
    recommendations: {
      immediate: string[]
      recommended: string[]
      optional: string[]
    }
  }
  onClose: () => void
}

export default function ComplianceReport({ report, onClose }: ComplianceReportProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'recommendations'>('overview')

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      case 'non-compliant':
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'High':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownloadPDF = () => {
    toast.success('PDF download started')
    // TODO: Implement PDF generation
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Compliance Report - ${report.productName}`,
        text: `Compliance Score: ${report.score}%`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Report link copied to clipboard')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Compliance Report</h2>
              <p className="text-blue-100 mt-1">{report.productName}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                  {report.category} • {report.country}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${getRiskLevelColor(report.riskLevel)}`}>
                  {report.riskLevel} Risk
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                title="Download PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                title="Share Report"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Score */}
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full ${getScoreBgColor(report.score)} flex items-center justify-center mb-4`}>
                <span className={`text-3xl font-bold ${getScoreColor(report.score)}`}>
                  {report.score}%
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Compliance Score</h3>
              <p className="text-sm text-gray-600">
                {report.report.passedRules} of {report.report.totalRules} rules passed
              </p>
            </div>

            {/* Status */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                {getStatusIcon(report.status)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{report.status}</h3>
              <p className="text-sm text-gray-600">
                {report.status === 'compliant' && 'All critical requirements met'}
                {report.status === 'warning' && 'Some issues need attention'}
                {report.status === 'non-compliant' && 'Critical issues must be addressed'}
              </p>
            </div>

            {/* Risk Level */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
              <p className="text-sm text-gray-600">
                {report.riskLevel === 'Low' && 'Low risk of compliance issues'}
                {report.riskLevel === 'Medium' && 'Medium risk - monitor closely'}
                {report.riskLevel === 'High' && 'High risk - immediate action needed'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'issues'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Issues ({report.report.issues.Critical.length + report.report.issues.Warning.length + report.report.issues.Recommendation.length})
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recommendations
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Compliance Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Rules Checked:</span>
                      <span className="font-medium">{report.report.totalRules}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Passed:</span>
                      <span className="font-medium text-green-600">{report.report.passedRules}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Failed:</span>
                      <span className="font-medium text-red-600">{report.report.failedRules}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Issue Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">Critical:</span>
                      <span className="font-medium text-red-600">{report.report.issues.Critical.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-600">Warnings:</span>
                      <span className="font-medium text-yellow-600">{report.report.issues.Warning.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600">Recommendations:</span>
                      <span className="font-medium text-blue-600">{report.report.issues.Recommendation.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-6">
              {/* Critical Issues */}
              {report.report.issues.Critical.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Critical Issues ({report.report.issues.Critical.length})
                  </h4>
                  <div className="space-y-3">
                    {report.report.issues.Critical.map((issue, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h5 className="font-medium text-red-900">{issue.element}</h5>
                        <p className="text-sm text-red-700 mt-1">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning Issues */}
              {report.report.issues.Warning.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-yellow-600 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Warnings ({report.report.issues.Warning.length})
                  </h4>
                  <div className="space-y-3">
                    {report.report.issues.Warning.map((issue, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h5 className="font-medium text-yellow-900">{issue.element}</h5>
                        <p className="text-sm text-yellow-700 mt-1">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation Issues */}
              {report.report.issues.Recommendation.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Recommendations ({report.report.issues.Recommendation.length})
                  </h4>
                  <div className="space-y-3">
                    {report.report.issues.Recommendation.map((issue, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-medium text-blue-900">{issue.element}</h5>
                        <p className="text-sm text-blue-700 mt-1">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.report.issues.Critical.length === 0 && 
               report.report.issues.Warning.length === 0 && 
               report.report.issues.Recommendation.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">No Issues Found</h3>
                  <p className="text-gray-600">Your label appears to be fully compliant!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {/* Immediate Actions */}
              {report.recommendations.immediate.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-red-600 mb-4">Immediate Actions Required</h4>
                  <div className="space-y-2">
                    {report.recommendations.immediate.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {report.recommendations.recommended.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-yellow-600 mb-4">Recommended Actions</h4>
                  <div className="space-y-2">
                    {report.recommendations.recommended.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Actions */}
              {report.recommendations.optional.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-blue-600 mb-4">Optional Improvements</h4>
                  <div className="space-y-2">
                    {report.recommendations.optional.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.recommendations.immediate.length === 0 && 
               report.recommendations.recommended.length === 0 && 
               report.recommendations.optional.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">No Recommendations</h3>
                  <p className="text-gray-600">Your label meets all compliance requirements!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Report generated on {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



