import { Metadata } from 'next'
import { Shield, FileText, Scale, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Product Label Checker',
  description: 'Terms of Service for Product Label Checker - AI-powered compliance validation for Amazon sellers',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-blue-700 dark:from-orange-900 dark:via-orange-950 dark:to-blue-950 py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Scale className="w-4 h-4 mr-2" />
              Legal Agreement
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Terms of Service
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
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Welcome to Product Label Checker</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  These Terms of Service ("Terms") govern your access to and use of Product Label Checker's services, 
                  including our website, AI-powered compliance analysis tools, and related services (collectively, the "Service"). 
                  By accessing or using our Service, you agree to be bound by these Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <Section
            number="1"
            title="Acceptance of Terms"
            icon={<Shield className="w-6 h-6" />}
          >
            <p>By creating an account or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You must be at least 18 years old to use our Service</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree to notify us immediately of any unauthorized use of your account</li>
            </ul>
          </Section>

          {/* Section 2 */}
          <Section
            number="2"
            title="Service Description"
            icon={<FileText className="w-6 h-6" />}
          >
            <p>Product Label Checker provides AI-powered compliance analysis for product labels intended for sale on Amazon marketplaces, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Label Scanning:</strong> Upload and analyze product label images</li>
              <li><strong>Compliance Checking:</strong> Automated validation against FDA, CPSC, and EU regulations</li>
              <li><strong>Multi-Market Support:</strong> Analysis for USA, UK, and Germany marketplaces</li>
              <li><strong>Category-Specific Rules:</strong> Specialized checks for Toys, Baby Products, and Cosmetics/Personal Care</li>
              <li><strong>Team Collaboration:</strong> Share results and collaborate with team members (Deluxe and One-Time plans)</li>
              <li><strong>Report Generation:</strong> Detailed compliance reports with actionable recommendations</li>
            </ul>
          </Section>

          {/* Section 3 */}
          <Section
            number="3"
            title="Subscription Plans and Billing"
            icon={<Scale className="w-6 h-6" />}
          >
            <h3 className="font-semibold text-lg mb-3">3.1 Available Plans</h3>
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400">Basic (Free)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">1 scan per account lifetime, basic compliance report, view-only results</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400">One-Time Use ($99.99)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Single comprehensive scan, 30-day access, all Deluxe features, no recurring charges</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-600 dark:text-orange-400">Deluxe ($29.99/month)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Unlimited scans, team collaboration (up to 2 users), priority support, unlimited history</p>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-3 mt-6">3.2 Payment Terms</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>All fees are in USD and are non-refundable except as required by law</li>
              <li>Subscription fees are billed monthly in advance for Deluxe plans</li>
              <li>One-Time Use purchases are charged immediately upon purchase</li>
              <li>We use Stripe for secure payment processing</li>
              <li>You authorize us to charge your payment method for all fees</li>
              <li>Prices are subject to change with 30 days' notice</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3 mt-6">3.3 Cancellation and Refunds</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may cancel your Deluxe subscription at any time through your account settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds for partial months or unused scans</li>
              <li>One-Time Use purchases are non-refundable after the scan is completed</li>
              <li>We reserve the right to issue refunds at our discretion</li>
            </ul>
          </Section>

          {/* Section 4 */}
          <Section
            number="4"
            title="User Responsibilities and Conduct"
            icon={<AlertTriangle className="w-6 h-6" />}
          >
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Upload content that violates any law or infringes on others' rights</li>
              <li>Use the Service to scan labels for illegal or counterfeit products</li>
              <li>Attempt to reverse engineer, decompile, or extract our AI algorithms</li>
              <li>Share your account credentials with others</li>
              <li>Use automated systems (bots, scrapers) to access the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Resell or redistribute our Service without permission</li>
            </ul>
          </Section>

          {/* Section 5 */}
          <Section
            number="5"
            title="Intellectual Property Rights"
            icon={<Shield className="w-6 h-6" />}
          >
            <h3 className="font-semibold text-lg mb-3">5.1 Our Rights</h3>
            <p className="mb-4">
              The Service, including all content, features, functionality, software, AI models, and technology, 
              is owned by Product Label Checker and is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="font-semibold text-lg mb-3 mt-6">5.2 Your Content</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain all rights to the product label images you upload</li>
              <li>You grant us a limited license to process and analyze your uploaded content</li>
              <li>We may use anonymized, aggregated data to improve our Service</li>
              <li>You represent that you have the right to upload and share your content</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3 mt-6">5.3 Restrictions</h3>
            <p>You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission.</p>
          </Section>

          {/* Section 6 */}
          <Section
            number="6"
            title="Disclaimers and Limitations of Liability"
            icon={<AlertTriangle className="w-6 h-6" />}
          >
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">IMPORTANT DISCLAIMER</p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-2 text-sm">
                Product Label Checker is a compliance assistance tool. Our AI-powered analysis is provided "AS IS" 
                and should not be considered as legal advice or a guarantee of regulatory compliance.
              </p>
            </div>

            <h3 className="font-semibold text-lg mb-3">6.1 No Warranty</h3>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>We do not guarantee that our analysis is error-free or complete</li>
              <li>Compliance requirements change frequently; you are responsible for verifying current regulations</li>
              <li>Our Service should supplement, not replace, professional legal and regulatory advice</li>
              <li>We make no warranties about the accuracy, reliability, or availability of the Service</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">6.2 Limitation of Liability</h3>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PRODUCT LABEL CHECKER SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Product recalls or regulatory penalties</li>
              <li>Damage to reputation or goodwill</li>
              <li>Loss of data or information</li>
              <li>Cost of substitute services</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim, 
              or $100, whichever is greater.
            </p>
          </Section>

          {/* Section 7 */}
          <Section
            number="7"
            title="Data Security and Privacy"
            icon={<Shield className="w-6 h-6" />}
          >
            <p>
              We take data security seriously and implement industry-standard measures to protect your information. 
              However, no system is 100% secure. For detailed information about how we collect, use, and protect your data, 
              please review our <a href="/privacy" className="text-orange-600 hover:text-orange-700 underline">Privacy Policy</a>.
            </p>
          </Section>

          {/* Section 8 */}
          <Section
            number="8"
            title="Termination"
            icon={<AlertTriangle className="w-6 h-6" />}
          >
            <h3 className="font-semibold text-lg mb-3">8.1 By You</h3>
            <p className="mb-4">You may terminate your account at any time through your account settings or by contacting support.</p>

            <h3 className="font-semibold text-lg mb-3">8.2 By Us</h3>
            <p className="mb-4">We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Non-payment of fees</li>
              <li>Abusive behavior toward our team or other users</li>
              <li>Any reason we deem necessary to protect our Service or users</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3 mt-6">8.3 Effect of Termination</h3>
            <p>Upon termination, your right to access and use the Service will immediately cease. We may delete your data after termination, subject to our data retention policies.</p>
          </Section>

          {/* Section 9 */}
          <Section
            number="9"
            title="Changes to Terms"
            icon={<FileText className="w-6 h-6" />}
          >
            <p>
              We may update these Terms from time to time. We will notify you of material changes by email or through 
              the Service at least 30 days before the changes take effect. Your continued use of the Service after 
              changes become effective constitutes acceptance of the updated Terms.
            </p>
          </Section>

          {/* Section 10 */}
          <Section
            number="10"
            title="Governing Law and Dispute Resolution"
            icon={<Scale className="w-6 h-6" />}
          >
            <h3 className="font-semibold text-lg mb-3">10.1 Governing Law</h3>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions.
            </p>

            <h3 className="font-semibold text-lg mb-3">10.2 Dispute Resolution</h3>
            <p className="mb-4">
              Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, 
              except that either party may seek injunctive relief in court for intellectual property infringement.
            </p>

            <h3 className="font-semibold text-lg mb-3">10.3 Class Action Waiver</h3>
            <p>
              You agree that any dispute resolution proceedings will be conducted only on an individual basis and 
              not in a class, consolidated, or representative action.
            </p>
          </Section>

          {/* Section 11 */}
          <Section
            number="11"
            title="Miscellaneous"
            icon={<FileText className="w-6 h-6" />}
          >
            <ul className="space-y-3">
              <li>
                <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Product Label Checker.
              </li>
              <li>
                <strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions will remain in effect.
              </li>
              <li>
                <strong>No Waiver:</strong> Our failure to enforce any right or provision does not constitute a waiver.
              </li>
              <li>
                <strong>Assignment:</strong> You may not assign these Terms without our consent. We may assign our rights and obligations.
              </li>
              <li>
                <strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our reasonable control.
              </li>
            </ul>
          </Section>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-950/30 dark:to-blue-950/30 rounded-2xl p-8 mt-12 border border-orange-200 dark:border-orange-800">
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Email:</strong> <a href="mailto:legal@productlabelchecker.com" className="text-orange-600 hover:text-orange-700 underline">legal@productlabelchecker.com</a></p>
              <p><strong>Support:</strong> <a href="mailto:support@productlabelchecker.com" className="text-orange-600 hover:text-orange-700 underline">support@productlabelchecker.com</a></p>
              <p><strong>Website:</strong> <a href="https://www.plabiq.com" className="text-orange-600 hover:text-orange-700 underline">www.plabiq.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ 
  number, 
  title, 
  icon, 
  children 
}: { 
  number: string
  title: string
  icon: React.ReactNode
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-orange-600 dark:text-orange-400">
              {icon}
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <div className="text-gray-600 dark:text-gray-300 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
