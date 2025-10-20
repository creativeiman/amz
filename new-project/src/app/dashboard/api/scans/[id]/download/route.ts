import { NextRequest } from "next/server"
import { ApiHandler, isErrorResponse } from "@/lib/api-handler"
import { prisma } from "@/db/client"
import { getPresignedUrl } from "@/lib/minio-client"
import { AccountPermission } from "@prisma/client"

/**
 * Generate presigned URL for downloading label from MinIO
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
      requirePermissions: [AccountPermission.SCAN_VIEW],
    })
    
    if (isErrorResponse(context)) return context

    const { id } = await params

    // Get scan
    const scan = await prisma.scan.findUnique({
      where: { id },
      select: {
        id: true,
        labelUrl: true,
        productName: true,
        originalFilename: true,
        accountId: true,
      },
    })

    if (!scan) {
      return ApiHandler.notFound("Scan not found")
    }

    // Check if scan belongs to user's account
    if (scan.accountId !== context.accountId) {
      return ApiHandler.forbidden("Access denied")
    }

    if (!scan.labelUrl) {
      return ApiHandler.notFound("No label file found")
    }

    // Generate presigned URL from MinIO (expires in 1 hour)
    const presignedUrl = await getPresignedUrl(scan.labelUrl)

    // Use original filename if available, otherwise generate from product name
    const filename = scan.originalFilename || `${scan.productName}-label.${scan.labelUrl.split(".").pop()}`

    return {
      url: presignedUrl,
      filename,
      expiresIn: 3600, // 1 hour
    }
  })
}
