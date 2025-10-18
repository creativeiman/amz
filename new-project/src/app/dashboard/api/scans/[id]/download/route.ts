import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/client"
import { getPresignedUrl } from "@/lib/minio-client"

/**
 * Generate presigned URL for downloading label from MinIO
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
        account: {
          select: {
            ownerId: true,
          },
        },
      },
    })

    if (!scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Check access permissions
    const isOwner = scan.account.ownerId === session.user.id
    const isMember = await prisma.accountMember.findUnique({
      where: {
        accountId_userId: {
          accountId: scan.accountId,
          userId: session.user.id,
        },
      },
    })

    if (!isOwner && !isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!scan.labelUrl) {
      return NextResponse.json({ error: "No label file found" }, { status: 404 })
    }

    // Generate presigned URL from MinIO (expires in 1 hour)
    const presignedUrl = await getPresignedUrl(scan.labelUrl)

    // Use original filename if available, otherwise generate from product name
    const filename = scan.originalFilename || `${scan.productName}-label.${scan.labelUrl.split(".").pop()}`

    return NextResponse.json({
      url: presignedUrl,
      filename,
      expiresIn: 3600, // 1 hour
    })
  } catch (error) {
    console.error("Error generating download URL:", error)
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    )
  }
}

