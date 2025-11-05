'use client'

import Link from 'next/link'
import { Upload, Shield, Zap, ShoppingBag } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-orange-900 to-blue-900 dark:from-orange-950 dark:via-orange-950 dark:to-blue-950" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1715635845581-b1683792ed25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxjb21wbGlhbmNlfGVufDB8fHx8MTc1OTUzMDc2OXww&ixlib=rb-4.1.0&q=80&w=1080")',
        }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Compliance Analysis
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent drop-shadow-2xl">
              Stop Losing Sales to Label Errors and Compliance Pitfalls
            </span>
          </h1>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg">
            Audit Your Product Labels in 60 Seconds
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 max-w-3xl leading-relaxed drop-shadow-lg">
            PlabIQ scans your label, flags every issue, and gives you exact fixes instantly.
          </p>

          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-12 drop-shadow-lg">
            No consultants. No guesswork. Just <span className="text-yellow-300">100% compliance confidence</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link
              href="/register"
              className="group bg-[#2e3192] hover:bg-[#252776] text-white font-bold py-4 px-10 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[#2e3192]/25 flex items-center justify-center"
            >
              <Upload className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Start Free Label Audit
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-8 text-white">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <ShoppingBag className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium drop-shadow-lg">Built for Amazon Sellers</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium drop-shadow-lg">Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-medium drop-shadow-lg">Instant Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  )
}

