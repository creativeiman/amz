'use client'

import { DollarSign, AlertTriangle, Package, FileWarning } from 'lucide-react'

export function WhyTrustSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-orange-900 dark:from-gray-100 dark:via-blue-100 dark:to-orange-100 bg-clip-text text-transparent">
            Why Brands Trust <span className="underline decoration-[#2e3192]">PlabIQ</span>
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <table className="w-full border-collapse shadow-2xl rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-[#2e3192]/10 dark:bg-[#2e3192]/20">
                <th className="py-6 px-6 text-left text-lg font-bold text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-700">
                  Risk
                </th>
                <th className="py-6 px-6 text-left text-lg font-bold text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-700 bg-red-100 dark:bg-red-950">
                  Cost Without PlabIQ
                </th>
                <th className="py-6 px-6 text-left text-lg font-bold text-gray-900 dark:text-gray-100 bg-green-100 dark:bg-green-950">
                  With PlabIQ
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Delisting */}
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-6 px-6 font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Delisting</span>
                  </div>
                </td>
                <td className="py-6 px-6 bg-red-50 dark:bg-red-950/30 border-r border-gray-300 dark:border-gray-700">
                  <span className="text-red-700 dark:text-red-300 font-semibold">$10K–$150K+ in lost sales</span>
                </td>
                <td className="py-6 px-6 bg-green-50 dark:bg-green-950/30">
                  <span className="text-green-700 dark:text-green-300 font-bold text-xl">$0</span>
                </td>
              </tr>

              {/* Account Suspension */}
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-6 px-6 font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <FileWarning className="w-5 h-5 text-orange-500" />
                    <span>Account Suspension</span>
                  </div>
                </td>
                <td className="py-6 px-6 bg-red-50 dark:bg-red-950/30 border-r border-gray-300 dark:border-gray-700">
                  <span className="text-red-700 dark:text-red-300 font-semibold">14–21 days recovery</span>
                </td>
                <td className="py-6 px-6 bg-green-50 dark:bg-green-950/30">
                  <span className="text-green-700 dark:text-green-300 font-bold">Prevented</span>
                </td>
              </tr>

              {/* Rework & Returns */}
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <td className="py-6 px-6 font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-blue-500" />
                    <span>Rework & Returns</span>
                  </div>
                </td>
                <td className="py-6 px-6 bg-red-50 dark:bg-red-950/30 border-r border-gray-300 dark:border-gray-700">
                  <span className="text-red-700 dark:text-red-300 font-semibold">$5K – $50K per batch</span>
                </td>
                <td className="py-6 px-6 bg-green-50 dark:bg-green-950/30">
                  <span className="text-green-700 dark:text-green-300 font-bold">Eliminated</span>
                </td>
              </tr>

              {/* Fines */}
              <tr>
                <td className="py-6 px-6 font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-purple-500" />
                    <span>Fines</span>
                  </div>
                </td>
                <td className="py-6 px-6 bg-red-50 dark:bg-red-950/30 border-r border-gray-300 dark:border-gray-700">
                  <span className="text-red-700 dark:text-red-300 font-semibold">Up to $100K (CPSC/FDA)</span>
                </td>
                <td className="py-6 px-6 bg-green-50 dark:bg-green-950/30">
                  <span className="text-green-700 dark:text-green-300 font-bold">Avoided</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Testimonial */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-l-4 border-[#2e3192]">
            <p className="text-xl text-gray-700 dark:text-gray-300 italic mb-4">
              "One scan caught a missing warning error. Saved us $47,000 in returns."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-[#2e3192] flex items-center justify-center text-white font-bold text-lg">
                CA
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">C. Anele</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">E-commerce Manager, UK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

