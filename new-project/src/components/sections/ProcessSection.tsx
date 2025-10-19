'use client'

import { Clock, Upload, Search, BarChart3, FileText, Rocket } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Upload,
    title: 'Upload Label',
    description: 'Upload your product label as an image, PDF, or text document for analysis.',
    gradient: 'from-orange-600 to-blue-600',
    iconGradient: 'from-orange-100 to-blue-100 dark:from-orange-950 dark:to-blue-950',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    number: 2,
    icon: Search,
    title: 'Select Parameters',
    description: 'Choose product category, target marketplaces, and applicable regulations.',
    gradient: 'from-blue-600 to-cyan-600',
    iconGradient: 'from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    number: 3,
    icon: BarChart3,
    title: 'Automated Analysis',
    description: 'Our system analyzes your label against selected regulatory requirements.',
    gradient: 'from-green-600 to-emerald-600',
    iconGradient: 'from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    number: 4,
    icon: FileText,
    title: 'Detailed Report',
    description: 'Receive a comprehensive compliance report with specific recommendations.',
    gradient: 'from-orange-600 to-red-600',
    iconGradient: 'from-orange-100 to-red-100 dark:from-orange-950 dark:to-red-950',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-background dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
            <Clock className="w-4 h-4 mr-2" />
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-orange-900 dark:from-gray-100 dark:via-blue-100 dark:to-orange-100 bg-clip-text text-transparent px-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Our simple 4-step process ensures your labels are compliant with all regulations using advanced AI technology.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-0">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative border border-white/50 dark:border-slate-800/50"
            >
              {/* Step Number */}
              <div className={`absolute -top-4 sm:-top-6 left-2 sm:-left-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                {step.number}
              </div>

              {/* Content */}
              <div className="text-center pt-6 sm:pt-8">
                <div className={`p-3 sm:p-4 bg-gradient-to-br ${step.iconGradient} rounded-2xl inline-block mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${step.iconColor}`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-20 text-center">
          <a 
            href="#pricing"
            className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 inline-flex items-center justify-center"
          >
            <Rocket className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Try It Now
          </a>
        </div>
      </div>
    </section>
  )
}

