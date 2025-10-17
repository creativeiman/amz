/**
 * MinIO Client Service
 * S3-compatible object storage for file uploads
 */

import { Client } from 'minio'
import { env } from '@/config/env'

// Initialize MinIO client
export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
})

const BUCKET_NAME = env.MINIO_BUCKET_NAME

/**
 * Initialize MinIO bucket (create if not exists)
 */
export async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      console.log(`✅ MinIO bucket '${BUCKET_NAME}' created`)
      
      // Set bucket policy to allow public read access (optional)
      // Uncomment if you want direct public access to files
      // const policy = {
      //   Version: '2012-10-17',
      //   Statement: [
      //     {
      //       Effect: 'Allow',
      //       Principal: { AWS: ['*'] },
      //       Action: ['s3:GetObject'],
      //       Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
      //     },
      //   ],
      // }
      // await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
    }
    return true
  } catch (error) {
    console.error('❌ MinIO bucket initialization failed:', error)
    throw new Error('Failed to initialize MinIO bucket')
  }
}

/**
 * Upload file to MinIO
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  try {
    // Ensure bucket exists
    await ensureBucket()

    // Generate unique file name
    const timestamp = Date.now()
    const sanitizedName = fileName.replace(/[^a-z0-9.-]/gi, '_')
    const objectName = `labels/${timestamp}-${sanitizedName}`

    // Upload file
    await minioClient.putObject(BUCKET_NAME, objectName, file, file.length, {
      'Content-Type': contentType,
    })

    console.log(`✅ File uploaded to MinIO: ${objectName}`)

    // Return the object URL (for internal use)
    return `/uploads/${objectName}`
  } catch (error) {
    console.error('❌ MinIO upload failed:', error)
    throw new Error('Failed to upload file to MinIO')
  }
}

/**
 * Get presigned URL for file download (expires in 7 days)
 */
export async function getPresignedUrl(objectName: string): Promise<string> {
  try {
    // Remove leading /uploads/ if present
    const cleanObjectName = objectName.replace(/^\/uploads\//, '')
    
    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      cleanObjectName,
      7 * 24 * 60 * 60 // 7 days in seconds
    )
    
    return url
  } catch (error) {
    console.error('❌ MinIO presigned URL generation failed:', error)
    throw new Error('Failed to generate presigned URL')
  }
}

/**
 * Get file from MinIO as Buffer
 */
export async function getFile(objectName: string): Promise<Buffer> {
  try {
    // Remove leading /uploads/ if present
    const cleanObjectName = objectName.replace(/^\/uploads\//, '')
    
    const stream = await minioClient.getObject(BUCKET_NAME, cleanObjectName)
    
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
    })
  } catch (error) {
    console.error('❌ MinIO file retrieval failed:', error)
    throw new Error('Failed to retrieve file from MinIO')
  }
}

/**
 * Delete file from MinIO
 */
export async function deleteFile(objectName: string): Promise<void> {
  try {
    // Remove leading /uploads/ if present
    const cleanObjectName = objectName.replace(/^\/uploads\//, '')
    
    await minioClient.removeObject(BUCKET_NAME, cleanObjectName)
    console.log(`✅ File deleted from MinIO: ${cleanObjectName}`)
  } catch (error) {
    console.error('❌ MinIO file deletion failed:', error)
    throw new Error('Failed to delete file from MinIO')
  }
}

/**
 * Check if MinIO is available
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await minioClient.listBuckets()
    return true
  } catch (error) {
    console.error('❌ MinIO health check failed:', error)
    return false
  }
}

