import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - PlabIQ | Product Label Compliance Insights',
  description: 'Stay updated with the latest insights, tips, and best practices for Amazon product label compliance and regulatory updates.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            PlabIQ Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay informed with the latest compliance insights, regulatory updates, and best practices for Amazon sellers.
          </p>
        </div>

        {/* Blogstraps Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div id="bs-blog" data-key="519ead5627f1b0c0a957e861425ffb68"></div>
        </div>
      </div>
    </div>
  )
}

