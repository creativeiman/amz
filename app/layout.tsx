import type { Metadata } from 'next'
import { Inter, Lato } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lato = Lato({ 
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LabelCompliance - Amazon Label Compliance Checker',
  description: 'AI-powered compliance validation for Amazon sellers. Check FDA, CPSC, EU/UKCA regulations for Toys, Baby Products, and Cosmetics.',
  keywords: 'Amazon compliance, label checker, FDA compliance, CPSC, UKCA, toy safety, baby products, cosmetics',
  authors: [{ name: 'LabelCompliance Team' }],
  creator: 'LabelCompliance',
  publisher: 'LabelCompliance',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://labelcompliance.com'),
  openGraph: {
    title: 'LabelCompliance - Amazon Label Compliance Checker',
    description: 'AI-powered compliance validation for Amazon sellers. Prevent costly suspensions and ensure regulatory compliance.',
    url: 'https://labelcompliance.com',
    siteName: 'LabelCompliance',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LabelCompliance - Amazon Label Compliance Checker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LabelCompliance - Amazon Label Compliance Checker',
    description: 'AI-powered compliance validation for Amazon sellers. Prevent costly suspensions and ensure regulatory compliance.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lato.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
