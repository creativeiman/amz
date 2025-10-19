'use client'

import { Globe } from 'lucide-react'

const marketplaces = [
  {
    name: 'United States',
    flag: '🇺🇸',
    gradient: 'from-red-500 via-blue-600 to-indigo-700',
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    gradient: 'from-blue-600 via-red-600 to-indigo-700',
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    gradient: 'from-black via-red-600 to-yellow-500',
  },
]

export function MarketplacesSection() {
  return (
    <section id="marketplaces" className="py-24 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-6">
            <Globe className="w-4 h-4 mr-2" />
            Global Reach
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-orange-900 dark:from-gray-100 dark:via-blue-100 dark:to-orange-100 bg-clip-text text-transparent px-4">
            Supported Marketplaces
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Ensure your products meet the specific requirements for each region with our comprehensive compliance coverage.
          </p>
        </div>

        {/* Marketplaces Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {marketplaces.map((marketplace, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Flag Header */}
              <div className={`h-64 bg-gradient-to-br ${marketplace.gradient} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 text-center">
                  <div className="p-6 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                    <span className="text-8xl">{marketplace.flag}</span>
                  </div>
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-6 py-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{marketplace.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

