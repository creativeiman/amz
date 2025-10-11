export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600 mb-4">This is a simple test page to check if the application is working.</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✅ Page loads successfully</p>
          <p className="text-sm text-gray-500">✅ No authentication required</p>
          <p className="text-sm text-gray-500">✅ Static content works</p>
        </div>
        <a 
          href="/" 
          className="inline-block mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}



