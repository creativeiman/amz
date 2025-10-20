/**
 * File Upload Utilities
 * 
 * This module handles file uploads for scan labels using MinIO (S3-compatible storage).
 * 
 * MinIO Setup:
 * 1. Start MinIO: docker-compose -f docker-compose.queue.yml up -d minio
 * 2. Access MinIO Console: http://localhost:9001 (minioadmin / minioadmin123)
 * 3. Configure .env.local with MinIO credentials
 * 
 * Benefits:
 * - S3-compatible API (easy migration to AWS S3 if needed)
 * - Docker containerized
 * - Open-source and free
 * - Production-ready
 */

import { uploadFile as minioUpload, deleteFile as minioDelete } from './minio-client'

/**
 * Upload file to MinIO storage
 * @param file - The file to upload
 * @param folder - Folder/prefix for the file (not used with MinIO, kept for API compatibility)
 * @returns Object with URL and original filename
 */
export async function uploadFile(file: File, folder: string = "labels"): Promise<{ url: string; originalFilename: string }> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to MinIO
    const url = await minioUpload(buffer, file.name, file.type)

    console.log(`✅ File uploaded successfully: ${url}`)
    return { url, originalFilename: file.name }
  } catch (error) {
    console.error("❌ Error uploading file to MinIO:", error)
    throw new Error("Failed to upload file to MinIO")
  }
}

/**
 * Delete file from MinIO storage
 * @param url - The URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    await minioDelete(url)
    console.log(`✅ File deleted successfully: ${url}`)
  } catch (error) {
    console.error("❌ Error deleting file from MinIO:", error)
    throw new Error("Failed to delete file from MinIO")
  }
}

/**
 * Validate file before upload
 * @param file - The file to validate
 * @param maxSize - Maximum file size in bytes (default: 10MB)
 * @param allowedTypes - Allowed MIME types
 */
export function validateFile(
  file: File,
  maxSize: number = 10 * 1024 * 1024, // 10MB
  allowedTypes: string[] = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    }
  }

  return { valid: true }
}

