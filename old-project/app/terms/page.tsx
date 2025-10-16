export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Label, you accept and agree to be bound by the 
              terms and provision of this agreement.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily use Label for personal, 
              non-commercial transitory viewing only. This is the grant of a license, 
              not a transfer of title.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Service Description</h2>
            <p className="text-gray-600 mb-4">
              Label provides AI-powered compliance validation for Amazon sellers. 
              We help check FDA, CPSC, and EU/UKCA regulations for various product categories.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">User Responsibilities</h2>
            <p className="text-gray-600 mb-4">
              Users are responsible for ensuring the accuracy of information provided and 
              for complying with all applicable laws and regulations.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              In no event shall Label or its suppliers be liable for any damages 
              arising out of the use or inability to use the service.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at 
              legal@labelcompliance.com
            </p>
          </div>
          
          <div className="mt-8">
            <a 
              href="/" 
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
