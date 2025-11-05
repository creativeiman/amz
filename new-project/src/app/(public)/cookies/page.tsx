import type { Metadata } from 'next'
import { Cookie, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy - PlabIQ',
  description: 'Learn about how PlabIQ uses cookies and similar tracking technologies to provide and improve our service.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative bg-[#2e3192] py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20">
              <Cookie className="w-4 h-4 mr-2" />
              Cookie Usage
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Cookie Policy
            </h1>
            <p className="text-lg sm:text-xl text-white/90 drop-shadow-lg">
              Last updated: October 27, 2025
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
                <Shield className="w-8 h-8 text-[#2e3192]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Policy</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  This Cookie Policy explains how Cotlidon Group ("we," "us," "our," or "PlabIQ") uses cookies and similar tracking technologies on our website and service at plabiq.com and related domains (collectively, the "Service").
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  This Cookie Policy should be read in conjunction with our Privacy Policy and Terms of Service. By using our Service, you consent to the use of cookies as described in this policy.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <Section title="1. Introduction">
            <h3 className="font-semibold text-lg mb-3">1.1 Company Information</h3>
            <ul className="list-none space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Company Name:</strong> Cotlidon Group</li>
              <li><strong>Company Registration Number:</strong> 14706189</li>
              <li><strong>Registered Office Address:</strong> 128 City Road, London, United Kingdom, EC1V 2NX</li>
              <li><strong>Contact Email:</strong> support@plabiq.com</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">1.2 Updates to This Policy</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our business operations, or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Last Updated" date at the top of this policy and notify you through the Service or via email where appropriate.
            </p>
          </Section>

          {/* Section 2 */}
          <Section title="2. What Are Cookies?">
            <h3 className="font-semibold text-lg mb-3">2.1 Definition</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and provide information to website owners.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Cookies typically contain:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>The name of the website that created the cookie</li>
              <li>A unique identifier</li>
              <li>An expiration date</li>
              <li>Other information, depending on the cookie's purpose</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3 mt-6">2.2 Types of Cookies by Duration</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser. They are used to maintain your session while you navigate through the Service.</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6"><strong>Persistent Cookies:</strong> These remain on your device for a set period of time or until you delete them. They are used to remember your preferences and settings across multiple visits.</p>

            <h3 className="font-semibold text-lg mb-3 mt-6">2.3 First-Party vs. Third-Party Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>First-Party Cookies:</strong> Set by PlabIQ directly. We use these to provide essential functionality and improve your experience.</p>
            <p className="text-gray-600 dark:text-gray-300"><strong>Third-Party Cookies:</strong> Set by external services we use, such as Google Analytics. These help us understand how users interact with our Service.</p>
          </Section>

          {/* Section 3 */}
          <Section title="3. How We Use Cookies">
            <p className="text-gray-600 dark:text-gray-300 mb-6">We use cookies and similar technologies for the following purposes:</p>

            <h3 className="font-semibold text-lg mb-3">3.1 Essential Cookies (Strictly Necessary)</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These cookies are essential for the Service to function properly and cannot be disabled in our systems.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Purpose:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300 mb-4">
              <li>Enable you to log in to your account</li>
              <li>Maintain your session while using the Service</li>
              <li>Remember your authentication status</li>
              <li>Provide security features</li>
              <li>Enable basic functionality of the Service</li>
              <li>Protect against fraud and abuse</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Legal Basis:</strong> These cookies are necessary for the performance of our contract with you and to provide the Service you have requested.</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6"><strong>Can you opt out?</strong> No. Without these cookies, the Service cannot function properly.</p>

            <h3 className="font-semibold text-lg mb-3">3.2 Functional Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These cookies enable enhanced functionality and personalisation but are not essential to the Service's basic operation.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Purpose:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Customise your user interface</li>
              <li>Remember your language preference</li>
              <li>Store your timezone</li>
              <li>Remember items in your analysis queue</li>
              <li>Maintain your display preferences (light/dark mode)</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Legal Basis:</strong> These cookies are based on our legitimate interests in providing you with a personalised and efficient service.</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6"><strong>Can you opt out?</strong> Yes, but disabling these cookies may affect your user experience.</p>

            <h3 className="font-semibold text-lg mb-3">3.3 Analytics and Performance Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              These cookies help us understand how visitors use our Service, which pages are most popular, and how users navigate through the site.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Purpose:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300 mb-4">
              <li>Track how many people visit the Service</li>
              <li>Monitor which pages are viewed and how long visitors spend on each page</li>
              <li>Understand how users navigate through the Service</li>
              <li>Identify technical issues or errors</li>
              <li>Measure the effectiveness of our features</li>
              <li>Analyze user behavior to improve the Service</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Third-Party Service Used:</strong> Google Analytics. We use Google Analytics to collect and analyze usage data. The information collected includes pages visited, time spent on pages, click patterns, device and browser information, approximate geographic location, and referring websites.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Google Analytics Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#2e3192] hover:underline">https://policies.google.com/privacy</a>
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Legal Basis:</strong> These cookies are based on our legitimate interests in understanding how our Service is used and improving its performance.</p>
            <p className="text-gray-600 dark:text-gray-300"><strong>Can you opt out?</strong> Yes. You can use our cookie consent tool to disable analytics cookies, install the Google Analytics Opt-out Browser Add-on, or adjust your browser settings to block third-party cookies.</p>
          </Section>

          {/* Section 4 */}
          <Section title="4. Other Tracking Technologies">
            <p className="text-gray-600 dark:text-gray-300 mb-6">In addition to cookies, we may use other tracking technologies:</p>

            <h3 className="font-semibold text-lg mb-3">4.1 Web Beacons (Pixels)</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Web beacons are tiny graphics with a unique identifier that track whether content has been viewed. We may use web beacons in email communications to track whether emails have been opened and in web pages to track visitor activity.
            </p>

            <h3 className="font-semibold text-lg mb-3">4.2 Local Storage</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may use browser local storage (HTML5 local storage) to store certain preferences and data locally on your device. Unlike cookies, local storage data does not expire and is not transmitted to our servers with every request.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>What we store:</strong></p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300 mb-6">
              <li>User interface preferences</li>
              <li>Temporary form data</li>
              <li>Cache data to improve performance</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">4.3 Session Storage</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Similar to local storage, but session storage data is deleted when you close your browser tab.
            </p>
          </Section>

          {/* Section 5 */}
          <Section title="5. Detailed Cookie Table">
            <p className="text-gray-600 dark:text-gray-300 mb-6">Below is a detailed list of cookies we use:</p>

            <div className="overflow-x-auto mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Essential Cookies</h3>
              <table className="min-w-full border border-gray-300 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Cookie Name</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Duration</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">session_id</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Maintains your logged-in session</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">First-party</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">auth_token</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Authentication and security</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">First-party</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">csrf_token</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Protects against cross-site request forgery</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">First-party</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">cookie_consent</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Remembers your cookie preferences</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">First-party</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Functional Cookies</h3>
              <table className="min-w-full border border-gray-300 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Cookie Name</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Duration</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">user_preferences</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Stores your UI preferences</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">First-party</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">language</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Remembers your language choice</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">First-party</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">theme</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Remembers light/dark mode preference</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">First-party</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analytics Cookies (Google Analytics)</h3>
              <table className="min-w-full border border-gray-300 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Cookie Name</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Duration</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">_ga</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Distinguishes unique users</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2 years</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Third-party (Google)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">_ga_*</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Used to persist session state</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">2 years</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Third-party (Google)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">_gid</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Distinguishes users</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">24 hours</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Third-party (Google)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">_gat</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Throttle request rate</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 minute</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Third-party (Google)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Section 6 */}
          <Section title="6. How to Manage Cookies">
            <p className="text-gray-600 dark:text-gray-300 mb-6">You have several options to manage or disable cookies:</p>

            <h3 className="font-semibold text-lg mb-3">6.1 Browser Settings</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              All modern browsers allow you to control cookies through their settings. You can block all cookies, block third-party cookies only, delete cookies after closing the browser, or delete existing cookies.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">For more information about managing cookies in your browser, visit: <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#2e3192] hover:underline">www.allaboutcookies.org</a></p>

            <h3 className="font-semibold text-lg mb-3">6.2 Google Analytics Opt-Out</h3>
            <p className="text-gray-600 dark:text-gray-300">
              To opt out of Google Analytics tracking across all websites, install the Google Analytics Opt-out Browser Add-on: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#2e3192] hover:underline">https://tools.google.com/dlpage/gaoptout</a>
            </p>
          </Section>

          {/* Section 7 */}
          <Section title="7. Consequences of Disabling Cookies">
            
            <h3 className="font-semibold text-lg mb-3">7.1 Essential Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you disable essential cookies, you will not be able to log into your PlabIQ account, use the label scanning functionality, or access any features that require authentication.
            </p>

            <h3 className="font-semibold text-lg mb-3">7.2 Functional Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              If you disable functional cookies, you may experience loss of personalized settings and need to re-enter preferences each visit. The Service will still function, but your experience will be less personalized.
            </p>

            <h3 className="font-semibold text-lg mb-3">7.3 Analytics Cookies</h3>
            <p className="text-gray-600 dark:text-gray-300">
              If you disable analytics cookies, your usage will not be tracked for analytics purposes. You can disable analytics cookies without impacting your ability to use the Service.
            </p>
          </Section>

          {/* Section 8 */}
          <Section title="8. Data Protection and Your Rights">
            
            <h3 className="font-semibold text-lg mb-3">8.1 UK GDPR Compliance</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our use of cookies complies with the UK General Data Protection Regulation (UK GDPR) and the Privacy and Electronic Communications Regulations (PECR).
            </p>

            <h3 className="font-semibold text-lg mb-3">8.2 Your Rights</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Under UK GDPR, you have rights regarding your personal data, including data collected through cookies:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300 mb-4">
              <li>Right to access your data</li>
              <li>Right to rectify inaccurate data</li>
              <li>Right to erase your data ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300">
              To exercise these rights, contact us at support@plabiq.com or refer to our Privacy Policy.
            </p>
          </Section>

          {/* Section 9 */}
          <Section title="9. Questions and Contact Information">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Email:</strong> support@plabiq.com</p>
              <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Postal Address:</strong></p>
              <p className="text-gray-600 dark:text-gray-300">Cotlidon Group</p>
              <p className="text-gray-600 dark:text-gray-300">128 City Road</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">London, United Kingdom, EC1V 2NX</p>
            </div>

            <h3 className="font-semibold text-lg mb-3">Complaints</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              If you believe we have not handled your cookie data appropriately, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO):
            </p>
            <ul className="list-none space-y-1 text-gray-600 dark:text-gray-300">
              <li><strong>Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#2e3192] hover:underline">https://ico.org.uk</a></li>
              <li><strong>Telephone:</strong> 0303 123 1113</li>
              <li><strong>Address:</strong> Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
            </ul>
          </Section>

          {/* Section 10 */}
          <Section title="10. Summary">
            <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-[#2e3192] p-6 rounded">
              <p className="text-gray-600 dark:text-gray-300 mb-4"><strong>What cookies do we use?</strong></p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300 mb-6">
                <li>Essential cookies (required for the Service to function)</li>
                <li>Functional cookies (remember your preferences)</li>
                <li>Analytics cookies (Google Analytics, to understand usage)</li>
              </ul>

              <p className="text-gray-600 dark:text-gray-300 mb-4"><strong>Can you opt out?</strong></p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300 mb-6">
                <li>Essential cookies: No, they are required</li>
                <li>Functional and analytics cookies: Yes, through browser settings</li>
              </ul>

              <p className="text-gray-600 dark:text-gray-300 mb-4"><strong>How long are cookies stored?</strong></p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300">
                <li>Session cookies: Until you close your browser</li>
                <li>Persistent cookies: From 24 hours to 2 years</li>
              </ul>
            </div>
          </Section>

          {/* Acknowledgment */}
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              By continuing to use our Service after reviewing this Cookie Policy, you acknowledge that you understand how we use cookies and consent to such use in accordance with the preferences you have set.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              © 2025 Cotlidon Group. All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

function Section({ 
  title, 
  children 
}: { 
  title: string
  children: React.ReactNode 
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="text-gray-600 dark:text-gray-300 space-y-4">
        {children}
      </div>
    </div>
  )
}

