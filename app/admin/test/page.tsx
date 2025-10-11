export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Test Page</h1>
        <p className="text-gray-600 mb-4">This is a test admin page to verify routing works.</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✅ Admin routing is working</p>
          <p className="text-sm text-gray-500">✅ Page is accessible</p>
          <p className="text-sm text-gray-500">✅ No 404 error</p>
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



