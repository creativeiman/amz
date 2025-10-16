import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check all Google Cloud environment variables
    const envVars = {
      GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
      GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY ? 'SET' : 'NOT SET',
      GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      GOOGLE_CLOUD_CLIENT_ID: process.env.GOOGLE_CLOUD_CLIENT_ID,
      GOOGLE_CLOUD_PRIVATE_KEY_ID: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
      GOOGLE_CLOUD_AUTH_URI: process.env.GOOGLE_CLOUD_AUTH_URI,
      GOOGLE_CLOUD_TOKEN_URI: process.env.GOOGLE_CLOUD_TOKEN_URI,
      GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL: process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL,
      GOOGLE_CLOUD_CLIENT_X509_CERT_URL: process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
      GOOGLE_CLOUD_UNIVERSE_DOMAIN: process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN
    }

    const missingVars = Object.entries(envVars)
      .filter(([key, value]) => !value || value === 'NOT SET')
      .map(([key]) => key)

    // Check private key format if it exists
    let privateKeyInfo = null
    if (process.env.GOOGLE_CLOUD_PRIVATE_KEY) {
      const key = process.env.GOOGLE_CLOUD_PRIVATE_KEY
      privateKeyInfo = {
        length: key.length,
        startsWith: key.substring(0, 30),
        endsWith: key.substring(key.length - 30),
        hasBeginMarker: key.includes('-----BEGIN PRIVATE KEY-----'),
        hasEndMarker: key.includes('-----END PRIVATE KEY-----'),
        hasNewlines: key.includes('\n'),
        lineCount: key.split('\n').length
      }
    }

    return NextResponse.json({
      success: true,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      },
      envVars,
      missingVars,
      privateKeyInfo,
      recommendations: missingVars.length > 0 ? [
        'Set missing environment variables in Vercel dashboard',
        'Ensure GOOGLE_CLOUD_PRIVATE_KEY includes proper line breaks',
        'Verify all credentials are from the same service account'
      ] : [
        'All environment variables are set',
        'Check private key format if OCR still fails'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



