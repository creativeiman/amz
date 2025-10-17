import { NextRequest, NextResponse } from "next/server"
import { getFile } from "@/lib/minio-client"

/**
 * Proxy route to serve images from MinIO
 * This allows Next.js Image component to work with MinIO-stored files
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    const fullPath = `/uploads/${path}`
    
    console.log(`📸 Serving image from MinIO: ${fullPath}`)

    // Get file from MinIO
    const buffer = await getFile(fullPath)

    // Determine content type from file extension
    const ext = path.split('.').pop()?.toLowerCase()
    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      pdf: 'application/pdf',
      webp: 'image/webp',
    }
    const contentType = contentTypes[ext || ''] || 'application/octet-stream'

    // Return image with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('❌ Error serving image from MinIO:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
}

