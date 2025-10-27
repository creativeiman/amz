/**
 * Environment Configuration
 * Type-safe access to environment variables
 */

// Validate required environment variables (skip in build time)
const requiredEnvVars = ['DATABASE_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'] as const

if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Missing environment variable: ${envVar}`)
    }
  }
}

// Server-side environment variables
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,

  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,

  // OAuth Providers
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '',
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET || '',

  // Stripe (Server-side)
  STRIPE_MODE: process.env.STRIPE_MODE || 'sandbox', // 'sandbox' or 'live'
  STRIPE_TEST_SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY || '',
  STRIPE_LIVE_SECRET_KEY: process.env.STRIPE_LIVE_SECRET_KEY || '',
  STRIPE_TEST_WEBHOOK_SECRET: process.env.STRIPE_TEST_WEBHOOK_SECRET || '',
  STRIPE_LIVE_WEBHOOK_SECRET: process.env.STRIPE_LIVE_WEBHOOK_SECRET || '',

  // AI Service
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',

  // Email (Resend)
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'noreply@notif.plabiq.com',

  // Redis & Queue
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  SCAN_WORKER_CONCURRENCY: parseInt(process.env.SCAN_WORKER_CONCURRENCY || '2'),

  // MinIO (S3-Compatible Object Storage)
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  MINIO_PORT: parseInt(process.env.MINIO_PORT || '9000'),
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin123',
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME || 'product-labels',
  MINIO_USE_SSL: process.env.MINIO_USE_SSL === 'true',
} as const

// Client-side public environment variables
export const publicEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY || '',
  NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY || '',
  // Test mode price IDs
  NEXT_PUBLIC_STRIPE_TEST_ONE_TIME_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_TEST_ONE_TIME_PRICE_ID || '',
  NEXT_PUBLIC_STRIPE_TEST_DELUXE_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_TEST_DELUXE_PRICE_ID || '',
  // Live mode price IDs
  NEXT_PUBLIC_STRIPE_LIVE_ONE_TIME_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_LIVE_ONE_TIME_PRICE_ID || '',
  NEXT_PUBLIC_STRIPE_LIVE_DELUXE_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_LIVE_DELUXE_PRICE_ID || '',
} as const

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Stripe mode helpers
export const getStripeSecretKey = () => {
  return env.STRIPE_MODE === 'live' ? env.STRIPE_LIVE_SECRET_KEY : env.STRIPE_TEST_SECRET_KEY
}

export const getStripePublishableKey = () => {
  return env.STRIPE_MODE === 'live' 
    ? publicEnv.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY 
    : publicEnv.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
}

export const getStripeWebhookSecret = () => {
  return env.STRIPE_MODE === 'live' ? env.STRIPE_LIVE_WEBHOOK_SECRET : env.STRIPE_TEST_WEBHOOK_SECRET
}

export const getStripeOneTimePriceId = () => {
  return env.STRIPE_MODE === 'live' 
    ? publicEnv.NEXT_PUBLIC_STRIPE_LIVE_ONE_TIME_PRICE_ID 
    : publicEnv.NEXT_PUBLIC_STRIPE_TEST_ONE_TIME_PRICE_ID
}

export const getStripeDeluxePriceId = () => {
  return env.STRIPE_MODE === 'live' 
    ? publicEnv.NEXT_PUBLIC_STRIPE_LIVE_DELUXE_PRICE_ID 
    : publicEnv.NEXT_PUBLIC_STRIPE_TEST_DELUXE_PRICE_ID
}

// Feature flags based on env availability
export const features = {
  hasGoogleAuth: !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
  hasFacebookAuth: !!env.FACEBOOK_CLIENT_ID && !!env.FACEBOOK_CLIENT_SECRET,
  hasStripe: !!getStripeSecretKey() && !!getStripePublishableKey(),
  hasEmail: !!env.RESEND_API_KEY,
  hasAI: !!env.ANTHROPIC_API_KEY,
  hasQueue: !!env.REDIS_URL,
  hasMinIO: !!env.MINIO_ENDPOINT && !!env.MINIO_ACCESS_KEY && !!env.MINIO_SECRET_KEY,
} as const

// Type exports for better autocomplete
export type Env = typeof env
export type PublicEnv = typeof publicEnv
export type Features = typeof features

