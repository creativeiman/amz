'use client'

import { useState } from 'react'
import { Upload, FolderOpen, CheckCircle, AlertTriangle, AlertCircle, Info, FileText } from 'lucide-react'

const sampleReport = [
  {
    type: 'success',
    icon: CheckCircle,
    title: 'Required Warning Statements',
    description: 'All mandatory warnings for toy products are present and correctly formatted.',
    color: 'border-green-500',
    iconColor: 'text-green-500',
  },
  {
    type: 'error',
    icon: AlertCircle,
    title: 'CE/UKCA Marking',
    description: 'The UKCA mark is missing for UK marketplace compliance. This is required for all toys sold in the UK post-Brexit.',
    color: 'border-red-500',
    iconColor: 'text-red-500',
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Amazon Policy Requirements',
    description: 'Choking hazard warning present but not formatted according to Amazon policy. Recommended to adjust font size and placement.',
    color: 'border-yellow-500',
    iconColor: 'text-yellow-500',
  },
  {
    type: 'info',
    icon: Info,
    title: 'Recommendation',
    description: 'Add UK Responsible Person information and adjust warning format to comply with all requirements.',
    color: 'border-blue-500',
    iconColor: 'text-blue-500',
  },
]

export function UploadDemoSection() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop logic here
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Upload Section */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
              <Upload className="w-4 h-4 mr-2" />
              Try It Free
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Upload Your Label for Compliance Review
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Start with a free basic analysis of your product label. Ensure your products meet regulatory requirements before listing on Amazon.
            </p>

            {/* Upload Area */}
            <div
              className={`group bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-2xl p-12 text-center transition-all duration-300 hover:shadow-xl ${
                isDragging ? 'border-purple-400 bg-purple-50' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-16 h-16 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Drag & Drop Your Label File</h3>
              <p className="text-gray-500 mb-8 text-lg">or</p>
              <button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 flex items-center justify-center mx-auto">
                <FolderOpen className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Browse Files
              </button>
              <p className="text-sm text-gray-500 mt-6 font-medium">Accepts JPG, PNG, PDF up to 10MB</p>
            </div>
          </div>

          {/* Sample Report */}
          <div className="lg:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-10 rounded-2xl shadow-xl border border-white/50">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mr-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Sample Compliance Report</h3>
            </div>

            <div className="space-y-6">
              {sampleReport.map((item, index) => (
                <div
                  key={index}
                  className={`group bg-white/80 backdrop-blur-sm p-6 rounded-xl border-l-4 ${item.color} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-start">
                    <item.icon className={`w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200 ${item.iconColor}`} />
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
