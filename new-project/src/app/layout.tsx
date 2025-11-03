import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plabiq | Product Label Compliance Checker for Amazon Sellers",
  description: "Get your Amazon product labels compliant with PlabIQ. Audit in 60 seconds and avoid costly errors. Start your free label scan today!",
  icons: {
    icon: [
      { url: '/plabiq-logo-black.png' },
      { url: '/plabiq-logo-black.png', sizes: '32x32', type: 'image/png' },
      { url: '/plabiq-logo-black.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/plabiq-logo-black.png',
    shortcut: '/plabiq-logo-black.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-75TGPDVJ3N"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-75TGPDVJ3N');
          `}
        </Script>

        {/* Hotjar */}
        <Script
          src="https://t.contentsquare.net/uxa/3dce7c318f81b.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
