'use client'

import { Star, Gavel, ShoppingCart, Package, Upload, Search, Globe } from 'lucide-react'

const features = [
  {
    icon: Gavel,
    title: 'Regulatory Compliance',
    description: 'Check against FDA/CPSC (USA), UK Responsible Person, and EU/UKCA standards for complete regulatory coverage.',
    gradient: 'from-orange-100 to-blue-100 dark:from-orange-950 dark:to-blue-950',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: ShoppingCart,
    title: 'Amazon Policy Verification',
    description: 'Ensure your labels meet Amazon\'s specific policies to prevent listing removals and account suspensions.',
    gradient: 'from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Package,
    title: 'Product Category Focus',
    description: 'Specialized in toys, baby products, cosmetics, and personal care items with category-specific requirements.',
    gradient: 'from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    icon: Upload,
    title: 'Multiple Format Analysis',
    description: 'Upload labels as images, PDFs, or text for flexible analysis based on your available materials.',
    gradient: 'from-orange-100 to-red-100 dark:from-orange-950 dark:to-red-950',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: Search,
    title: 'Detailed Reports',
    description: 'Receive comprehensive reports with clear explanations of compliance issues and suggestions for correction.',
    gradient: 'from-indigo-100 to-orange-100 dark:from-indigo-950 dark:to-orange-950',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: Globe,
    title: 'Multi-Market Support',
    description: 'Target USA, UK, and German marketplaces with region-specific compliance checks and requirements.',
    gradient: 'from-pink-100 to-rose-100 dark:from-pink-950 dark:to-rose-950',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-background dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2" />
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-orange-900 dark:from-gray-100 dark:via-blue-100 dark:to-orange-100 bg-clip-text text-transparent px-4">
            Comprehensive Compliance Analysis
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Our tool ensures your products meet all regulatory requirements across multiple marketplaces with AI-powered precision.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50 dark:border-slate-800/50"
            >
              <div className={`p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

