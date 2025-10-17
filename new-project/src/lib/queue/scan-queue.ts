/**
 * Background Job Queue for Label Analysis
 * 
 * Uses BullMQ (open-source) + Redis for reliable job processing
 * All services run in Docker containers
 */

import { Queue, Worker, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { analyzeLabelWithAI } from '@/lib/ai-service'
import { prisma } from '@/db/client'
import { Category, ScanStatus } from '@prisma/client'
import { sendSocketUpdate } from '@/lib/realtime/socket-server'
import { env } from '@/config/env'
import { getFile } from '@/lib/minio-client'

// Redis connection
const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
})

// Job data types
export interface ScanJobData {
  scanId: string
  userId: string
  imageUrl: string
  category: Category
  marketplaces: string[] // Array of marketplace codes: ["USA", "UK", "DE"]
  productName: string
}

export interface ScanJobProgress {
  stage: 'queued' | 'analyzing' | 'saving' | 'completed' | 'failed'
  percentage: number
  message: string
}

// Create the queue
export const scanQueue = new Queue<ScanJobData>('label-scan', {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times
    backoff: {
      type: 'exponential',
      delay: 2000, // Start with 2 seconds
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 24 * 3600, // Keep for 24 hours
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs for debugging
    },
  },
})

// Worker to process jobs
let worker: Worker<ScanJobData> | null = null

export function startWorker() {
  if (worker) {
    console.log('⚠️  Worker already running')
    return worker
  }

  worker = new Worker<ScanJobData>(
    'label-scan',
    async (job: Job<ScanJobData>) => {
      const { scanId, imageUrl, category, marketplaces, productName } = job.data

      try {
        console.log(`🔄 Processing job ${job.id} for scan ${scanId}`)

        // Update progress: Starting analysis
        const updateProgress = async (progress: ScanJobProgress) => {
          await job.updateProgress(progress)
          // Send real-time update via Socket.io
          sendSocketUpdate(scanId, 'progress', progress)
        }

        await updateProgress({
          stage: 'analyzing',
          percentage: 10,
          message: 'Starting AI analysis...',
        })

        // Update scan status to PROCESSING
        await prisma.scan.update({
          where: { id: scanId },
          data: { status: ScanStatus.PROCESSING },
        })

        // Fetch the image
        await updateProgress({
          stage: 'analyzing',
          percentage: 20,
          message: 'Loading image...',
        })

        const imageBuffer = await fetchImageBuffer(imageUrl)

        // Run AI analysis
        await updateProgress({
          stage: 'analyzing',
          percentage: 30,
          message: 'Analyzing label with Claude AI (30-90 seconds)...',
        })

        const startTime = Date.now()
        const result = await analyzeLabelWithAI(imageBuffer, category, marketplaces)
        const duration = ((Date.now() - startTime) / 1000).toFixed(2)

        console.log(`✅ AI analysis completed in ${duration}s for scan ${scanId}`)

        // Save results
        await updateProgress({
          stage: 'saving',
          percentage: 90,
          message: 'Saving analysis results...',
        })

        await prisma.scan.update({
          where: { id: scanId },
          data: {
            status: ScanStatus.COMPLETED, // AI successfully analyzed, regardless of compliance pass/fail
            score: result.compliance.score,
            riskLevel: result.compliance.riskLevel as any, // Type will match after Prisma regeneration
            results: result as any, // Store full analysis result as JSON
          },
        })

        // Save issues (skip - issues are already stored in results JSON)
        // The full results object contains all issues, no need to duplicate in separate table

        // Completed
        await updateProgress({
          stage: 'completed',
          percentage: 100,
          message: 'Analysis completed!',
        })

        // Send completion notification
        sendSocketUpdate(scanId, 'completed', {
          status: 'COMPLETED',
          complianceScore: result.compliance.score,
          compliancePassed: result.compliance.passed,
          summary: result.summary,
        })

        return { 
          success: true, 
          scanId, 
          complianceScore: result.compliance.score,
          duration: `${duration}s`
        }
      } catch (error) {
        console.error(`❌ Job ${job.id} failed for scan ${scanId}:`, error)

        // Update scan status to FAILED
        await prisma.scan.update({
          where: { id: scanId },
          data: {
            status: ScanStatus.FAILED,
            results: {
              error: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date().toISOString(),
            } as any,
          },
        })

        // Send error notification
        sendSocketUpdate(scanId, 'error', {
          message: error instanceof Error ? error.message : 'Unknown error',
        })

        throw error
      }
    },
    {
      connection,
      concurrency: env.SCAN_WORKER_CONCURRENCY, // Process 2 scans simultaneously
      limiter: {
        max: 10, // Max 10 jobs
        duration: 60000, // per minute (rate limiting for API costs)
      },
    }
  )

  // Worker event handlers
  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed successfully`)
  })

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed with error:`, err.message)
  })

  worker.on('progress', (job, progress) => {
    const p = progress as ScanJobProgress
    console.log(`📊 Job ${job.id}: ${p.stage} - ${p.percentage}% - ${p.message}`)
  })

  console.log(`🚀 Scan worker started (concurrency: ${env.SCAN_WORKER_CONCURRENCY})`)
  return worker
}

export async function stopWorker() {
  if (worker) {
    await worker.close()
    worker = null
    console.log('🛑 Scan worker stopped')
  }
}

// Helper: Fetch image from MinIO or URL
async function fetchImageBuffer(imageUrl: string): Promise<Buffer> {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // External URL - fetch directly
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } else {
    // MinIO stored file - get from object storage
    console.log(`📁 Reading file from MinIO: ${imageUrl}`)
    return await getFile(imageUrl)
  }
}

// Add a new scan job to the queue
export async function addScanJob(data: ScanJobData) {
  const job = await scanQueue.add('analyze-label', data, {
    jobId: data.scanId, // Use scanId as job ID for easy tracking
  })

  console.log(`📝 Added scan job ${job.id} to queue`)
  
  // Send initial queued notification
  sendSocketUpdate(data.scanId, 'progress', {
    stage: 'queued',
    percentage: 0,
    message: 'Scan queued for processing...',
  })

  return job
}

// Get job status
export async function getScanJobStatus(scanId: string) {
  const job = await scanQueue.getJob(scanId)
  if (!job) {
    return null
  }

  const state = await job.getState()
  const progress = job.progress as ScanJobProgress | undefined

  return {
    id: job.id,
    state, // 'waiting', 'active', 'completed', 'failed', 'delayed'
    progress: progress || { stage: 'queued', percentage: 0, message: 'Queued' },
    data: job.data,
  }
}

// Get queue stats
export async function getQueueStats() {
  const [waiting, active, completed, failed] = await Promise.all([
    scanQueue.getWaitingCount(),
    scanQueue.getActiveCount(),
    scanQueue.getCompletedCount(),
    scanQueue.getFailedCount(),
  ])

  return { waiting, active, completed, failed }
}
