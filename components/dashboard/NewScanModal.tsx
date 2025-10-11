'use client'

import { useState } from 'react'
import { 
  X, 
  Upload, 
  Package,
  FileImage,
  CheckCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface NewScanModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewScanModal({ isOpen, onClose }: NewScanModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    targetMarketplaces: [] as string[]
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const categories = [
    'Toys',
    'Baby Products', 
    'Cosmetics/Personal Care'
  ]

  const marketplaces = [
    { id: 'US', name: 'United States', flag: '🇺🇸' },
    { id: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { id: 'Germany', name: 'Germany', flag: '🇩🇪' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMarketplaceChange = (marketplaceId: string) => {
    setFormData(prev => ({
      ...prev,
      targetMarketplaces: prev.targetMarketplaces.includes(marketplaceId)
        ? prev.targetMarketplaces.filter(id => id !== marketplaceId)
        : [...prev.targetMarketplaces, marketplaceId]
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setUploadedFile(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.productName || !formData.category || formData.targetMarketplaces.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!uploadedFile) {
      toast.error('Please upload a file')
      return
    }

    setIsLoading(true)

    try {
      let ocrResult = null
      
      // Process OCR with uploaded file
      if (uploadedFile) {
        toast.loading('Extracting text from label...', { id: 'ocr-processing' })
        
        const formDataForOCR = new FormData()
        formDataForOCR.append('file', uploadedFile)
        formDataForOCR.append('category', formData.category.toLowerCase().replace(' ', ''))
        formDataForOCR.append('marketplace', JSON.stringify(formData.targetMarketplaces))
        formDataForOCR.append('productName', formData.productName)
        
        const ocrResponse = await fetch('/api/scan/ocr', {
          method: 'POST',
          body: formDataForOCR
        })
        
        if (!ocrResponse.ok) {
          throw new Error('OCR processing failed')
        }
        
        ocrResult = await ocrResponse.json()
        toast.success('Text extracted successfully!', { id: 'ocr-processing' })
      }
      
      // Simulate additional processing
      toast.loading('Analyzing compliance...', { id: 'compliance-analysis' })
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Label scan completed successfully!', { id: 'compliance-analysis' })
      
      // Store scan results
      if (ocrResult) {
        console.log('OCR Results:', ocrResult.data)
        // Store scan results with scan ID
        const scanData = {
          ...ocrResult.data,
          scanId: ocrResult.scanId
        }
        localStorage.setItem('latestScanResult', JSON.stringify(scanData))
      }
      
      onClose()
      
      // Redirect to results page
      window.location.href = '/dashboard/scan-results'
    } catch (error) {
      console.error('Scan processing error:', error)
      toast.error('Failed to process label. Please try again.')
      toast.dismiss('ocr-processing')
      toast.dismiss('compliance-analysis')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">New Label Scan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Label File
            </label>
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileImage className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drag and drop your label here
                    </p>
                    <p className="text-gray-600 mb-4">
                      or click to browse files (JPG, PNG, PDF)
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </label>
                  </div>
                )}
            </div>
          </div>


          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Product Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Target Marketplaces */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Marketplaces *
                </label>
                <div className="space-y-2">
                  {marketplaces.map(marketplace => (
                    <label key={marketplace.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.targetMarketplaces.includes(marketplace.id)}
                        onChange={() => handleMarketplaceChange(marketplace.id)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {marketplace.flag} {marketplace.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-600 to-blue-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Scan Label
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
