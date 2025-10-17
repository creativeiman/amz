/**
 * MinIO Initialization Script
 * 
 * Run this script to ensure MinIO bucket is created and configured
 * Usage: pnpm tsx scripts/init-minio.ts
 */

import { ensureBucket, healthCheck } from '../src/lib/minio-client'
import { env } from '../src/config/env'

async function initMinIO() {
  console.log('🚀 Initializing MinIO...')
  console.log(`📍 MinIO Endpoint: ${env.MINIO_ENDPOINT}:${env.MINIO_PORT}`)
  console.log(`📦 Bucket Name: ${env.MINIO_BUCKET_NAME}`)
  console.log('')

  try {
    // Health check
    console.log('🔍 Checking MinIO connection...')
    const isHealthy = await healthCheck()
    
    if (!isHealthy) {
      console.error('❌ MinIO is not available!')
      console.error('Make sure MinIO is running: make minio-start')
      process.exit(1)
    }
    
    console.log('✅ MinIO connection successful!')
    console.log('')

    // Ensure bucket exists
    console.log('📦 Ensuring bucket exists...')
    await ensureBucket()
    console.log('✅ Bucket ready!')
    console.log('')

    console.log('🎉 MinIO initialization complete!')
    console.log('')
    console.log('📝 Access MinIO Console:')
    console.log(`   URL: http://localhost:9001`)
    console.log(`   Login: minioadmin / minioadmin123`)
    console.log('')
    console.log('📝 Bucket Configuration:')
    console.log(`   Bucket: ${env.MINIO_BUCKET_NAME}`)
    console.log(`   Region: us-east-1`)
    console.log('')

  } catch (error) {
    console.error('❌ MinIO initialization failed:', error)
    console.error('')
    console.error('Troubleshooting:')
    console.error('  1. Make sure MinIO is running: make minio-start')
    console.error('  2. Check MinIO logs: make minio-logs')
    console.error('  3. Verify .env.local has correct MinIO credentials')
    process.exit(1)
  }
}

initMinIO()

