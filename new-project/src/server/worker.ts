#!/usr/bin/env tsx
/**
 * Background Worker Process
 * 
 * Run this separately from Next.js:
 * - Development: npm run worker
 * - Production: pm2 start dist/worker.js
 * - Docker: node dist/worker.js
 */

import { startWorker, stopWorker } from '@/lib/queue/scan-queue'
import { env, features } from '@/config/env'

async function main() {
  console.log('🚀 Starting background worker...')
  console.log(`📍 Redis URL: ${env.REDIS_URL}`)
  console.log(`⚙️  Worker concurrency: ${env.SCAN_WORKER_CONCURRENCY}`)
  console.log(`🤖 AI enabled: ${features.hasAI ? '✅' : '❌'}`)
  console.log(`📦 Queue enabled: ${features.hasQueue ? '✅' : '❌'}`)

  if (!features.hasAI) {
    console.error('❌ ANTHROPIC_API_KEY not configured')
    process.exit(1)
  }

  if (!features.hasQueue) {
    console.error('❌ REDIS_URL not configured')
    process.exit(1)
  }

  // Start the worker
  startWorker()

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('⚠️  SIGTERM received, shutting down gracefully...')
    await stopWorker()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    console.log('⚠️  SIGINT received, shutting down gracefully...')
    await stopWorker()
    process.exit(0)
  })

  console.log('✅ Worker started successfully!')
  console.log('🔍 Waiting for jobs...')
}

main().catch((error) => {
  console.error('❌ Worker failed to start:', error)
  process.exit(1)
})

