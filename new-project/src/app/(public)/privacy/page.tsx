import { Metadata } from 'next'
import { Shield, Lock, Eye, Database, Cookie, Mail, UserCheck, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Product Label Checker',
  description: 'Privacy Policy for Product Label Checker - Learn how we collect, use, and protect your data',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-blue-700 dark:from-orange-900 dark:via-orange-950 dark:to-blue-950 py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Shield className="w-4 h-4 mr-2" />
              Your Privacy Matters
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-white/90 drop-shadow-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  At Product Label Checker, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our AI-powered compliance analysis service.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  By using our Service, you agree to the collection and use of information in accordance with this policy. 
                  If you do not agree with our policies and practices, please do not use our Service.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <Section
            title="Information We Collect"
            icon={<Database className="w-6 h-6" />}
          >
            <h3 className="font-semibold text-lg mb-3">1.1 Information You Provide to Us</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Account Information</h4>
                <ul className="list-disc pl-6 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Name and email address</li>
                  <li>Password (encrypted and hashed)</li>
                  <li>Company/business name (optional)</li>
                  <li>Profile picture (if using Google OAuth)</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Payment Information</h4>
                <ul className="list-disc pl-6 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Billing details processed securely through Stripe</li>
                  <li>We do NOT store credit card numbers on our servers</li>
                  <li>Payment history and transaction records</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Product Label Data</h4>
                <ul className="list-disc pl-6 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Product label images you upload</li>
                  <li>Product names and categories</li>
                  <li>Target marketplaces (USA, UK, Germany)</li>
                  <li>Scan results and compliance reports</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Communications</h4>
                <ul className="list-disc pl-6 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Support requests and correspondence</li>
                  <li>Feedback and survey responses</li>
                  <li>Email preferences and notifications</li>
                </ul>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-3 mt-6">1.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, scan history</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies, analytics cookies</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3 mt-6">1.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google OAuth:</strong> Name, email, profile picture (if you sign in with Google)</li>
              <li><strong>Stripe:</strong> Payment processing and transaction data</li>
              <li><strong>Analytics Services:</strong> Aggregated usage statistics</li>
            </ul>
          </Section>

          {/* Section 2 */}
          <Section
            title="How We Use Your Information"
            icon={<Eye className="w-6 h-6" />}
          >
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>To Provide Our Service:</strong> Process label scans, generate compliance reports, manage your account
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>To Process Payments:</strong> Handle subscriptions, process transactions, send invoices
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>To Communicate:</strong> Send welcome emails, password resets, team invitations, service updates
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>To Improve Our Service:</strong> Analyze usage patterns, train AI models, fix bugs, develop new features
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>To Ensure Security:</strong> Detect fraud, prevent abuse, protect against security threats
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong>To Comply with Legal Obligations:</strong> Respond to legal requests, enforce our Terms of Service
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mt-6">
              <p className="font-semibold text-blue-800 dark:text-blue-200">AI Model Training</p>
              <p className="text-blue-700 dark:text-blue-300 mt-2 text-sm">
                We may use anonymized, aggregated data from label scans to improve our AI compliance algorithms. 
                Individual product labels are never shared publicly or with third parties.
              </p>
            </div>
          </Section>

          {/* Section 3 */}
          <Section
            title="How We Share Your Information"
            icon={<Globe className="w-6 h-6" />}
          >
            <p className="mb-4">We do NOT sell your personal information. We may share your information in the following circumstances:</p>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">We work with trusted third-party service providers:</p>
                <ul className="list-disc pl-6 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li><strong>Stripe:</strong> Payment processing</li>
                  <li><strong>Resend:</strong> Transactional emails</li>
                  <li><strong>Anthropic (Claude AI):</strong> AI-powered label analysis</li>
                  <li><strong>Railway/Hosting:</strong> Infrastructure and database hosting</li>
                  <li><strong>MinIO:</strong> Secure file storage</li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Team Members</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  If you're on a Deluxe or One-Time plan, your scan results may be visible to other team members in your workspace.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We may disclose information if required by law, court order, or government request, or to protect our rights and safety.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.
                </p>
              </div>
            </div>
          </Section>

          {/* Section 4 */}
          <Section
            title="Data Security"
            icon={<Lock className="w-6 h-6" />}
          >
            <p className="mb-4">We implement industry-standard security measures to protect your information:</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">🔐 Encryption</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">All data transmitted over HTTPS/TLS. Passwords are hashed with bcrypt.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🛡️ Access Controls</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">Role-based permissions. Multi-factor authentication available.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">💾 Secure Storage</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">PostgreSQL database with encryption at rest. MinIO for file storage.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🔍 Monitoring</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">Regular security audits and vulnerability scanning.</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mt-6">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">Important Note</p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-2 text-sm">
                While we implement strong security measures, no system is 100% secure. You are responsible for 
                maintaining the confidentiality of your account credentials.
              </p>
            </div>
          </Section>

          {/* Section 5 */}
          <Section
            title="Data Retention"
            icon={<Database className="w-6 h-6" />}
          >
            <p className="mb-4">We retain your information for as long as necessary to provide our Service and comply with legal obligations:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active, plus 90 days after deletion</li>
              <li><strong>Scan Results:</strong> FREE plan - 30 days; Deluxe - unlimited; One-Time - 30 days</li>
              <li><strong>Payment Records:</strong> Retained for 7 years for tax and accounting purposes</li>
              <li><strong>Support Communications:</strong> Retained for 2 years</li>
              <li><strong>Analytics Data:</strong> Aggregated data retained indefinitely</li>
            </ul>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              You can request deletion of your data at any time by contacting support. Some data may be retained 
              as required by law or for legitimate business purposes.
            </p>
          </Section>

          {/* Section 6 */}
          <Section
            title="Your Privacy Rights"
            icon={<UserCheck className="w-6 h-6" />}
          >
            <p className="mb-4">Depending on your location, you may have the following rights:</p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-orange-600 dark:text-orange-400">✓</div>
                <div>
                  <strong>Access:</strong> Request a copy of the personal information we hold about you
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-orange-600 dark:text-orange-400">✓</div>
                <div>
                  <strong>Correction:</strong> Request correction of inaccurate or incomplete information
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-orange-600 dark:text-orange-400">✓</div>
                <div>
                  <strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-orange-600 dark:text-orange-400">✓</div>
                <div>
                  <strong>Portability:</strong> Request a copy of your data in a machine-readable format
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-orange-600 dark:text-orange-400">✓</div>
                <div>
                  <strong>Opt-Out:</strong> Unsubscribe from marketing emails (transactional emails cannot be opted out)
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-orange-600 dark:text-orange-400">✓</div>
                <div>
                  <strong>Restrict Processing:</strong> Request limitation on how we use your information
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-orange-600 dark:text-orange-400">✓</div>
                <div>
                  <strong>Object:</strong> Object to processing of your information for certain purposes
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              To exercise these rights, please contact us at <a href="mailto:privacy@productlabelchecker.com" className="text-orange-600 hover:text-orange-700 underline">privacy@productlabelchecker.com</a>. 
              We will respond within 30 days.
            </p>
          </Section>

          {/* Section 7 */}
          <Section
            title="Cookies and Tracking"
            icon={<Cookie className="w-6 h-6" />}
          >
            <p className="mb-4">We use cookies and similar tracking technologies to enhance your experience:</p>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Essential Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Required for authentication, security, and basic functionality. Cannot be disabled.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Analytics Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Help us understand how you use our Service to improve performance and features.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Preference Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Remember your settings like theme preference and language.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              You can control cookies through your browser settings. Note that disabling cookies may affect Service functionality.
            </p>
          </Section>

          {/* Section 8 */}
          <Section
            title="Children's Privacy"
            icon={<Shield className="w-6 h-6" />}
          >
            <p>
              Our Service is not intended for children under 18 years of age. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact 
              us immediately, and we will delete it.
            </p>
          </Section>

          {/* Section 9 */}
          <Section
            title="International Data Transfers"
            icon={<Globe className="w-6 h-6" />}
          >
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure 
              appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              For users in the European Economic Area (EEA), we comply with GDPR requirements for international data transfers.
            </p>
          </Section>

          {/* Section 10 */}
          <Section
            title="Changes to This Privacy Policy"
            icon={<Mail className="w-6 h-6" />}
          >
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by email 
              or through a prominent notice on our Service at least 30 days before the changes take effect. Your 
              continued use of the Service after changes become effective constitutes acceptance of the updated Privacy Policy.
            </p>
          </Section>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/30 dark:to-blue-950/30 rounded-2xl p-8 mt-12 border border-orange-200 dark:border-orange-800">
            <h2 className="text-2xl font-bold mb-4">Contact Us About Privacy</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Privacy Officer:</strong> <a href="mailto:privacy@productlabelchecker.com" className="text-orange-600 hover:text-orange-700 underline">privacy@productlabelchecker.com</a></p>
              <p><strong>Support:</strong> <a href="mailto:support@productlabelchecker.com" className="text-orange-600 hover:text-orange-700 underline">support@productlabelchecker.com</a></p>
              <p><strong>Website:</strong> <a href="https://www.plabiq.com" className="text-orange-600 hover:text-orange-700 underline">www.plabiq.com</a></p>
            </div>

            <div className="mt-6 pt-6 border-t border-orange-200 dark:border-orange-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Data Protection Rights:</strong> If you are located in the EEA or UK, you have the right to lodge 
                a complaint with your local data protection authority if you believe we have not complied with applicable 
                data protection laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ 
  title, 
  icon, 
  children 
}: { 
  title: string
  icon: React.ReactNode
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-3 mb-6">
        <div className="text-orange-600 dark:text-orange-400">
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="text-gray-600 dark:text-gray-300 space-y-4">
        {children}
      </div>
    </div>
  )
}
