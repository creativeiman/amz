'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, Play, Shield, Zap, CheckCircle } from 'lucide-react'

export function HeroSection() {
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadClick = () => {
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
    }, 2000)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900" />
      <div className="absolute inset-0 bg-black/20" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1715635845581-b1683792ed25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxjb21wbGlhbmNlfGVufDB8fHx8MTc1OTUzMDc2OXww&ixlib=rb-4.1.0&q=80&w=1080")',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Compliance Analysis
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Amazon Label Compliance
            </span>
            <br />
            <span className="text-white">Reviewer</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed">
            Analyze your product labels for compliance with FDA, CPSC, EU/UKCA regulations and Amazon policies. 
            Ensure your toys, baby products, cosmetics, and personal care items meet marketplace requirements.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Upload Label Now
                </>
              )}
            </button>
            
            <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full border border-white/30 hover:border-white/50 shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center">
              <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
              Watch Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-8 text-white/70">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">FDA Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium">Instant Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  )
}
