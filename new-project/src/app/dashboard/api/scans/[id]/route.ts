import { NextRequest } from "next/server"
import { ApiHandler, isErrorResponse } from "@/lib/api-handler"
import { prisma } from "@/db/client"
import { AccountPermission } from "@prisma/client"

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

    // Fetch the scan with account info
    const scan = await prisma.scan.findUnique({
      where: { id },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            plan: true,
            ownerId: true,
          },
        },
      },
    })

    if (!scan) {
      return ApiHandler.notFound("Scan not found")
    }

    // Check if user has access to this scan (must be from their account)
    if (scan.accountId !== context.accountId) {
      return ApiHandler.forbidden("Access denied")
    }

    // Transform the data to match the expected format
    const formattedScan = {
      id: scan.id,
      productName: scan.productName,
      category: scan.category,
      marketplaces: scan.marketplaces,
      status: scan.status,
      score: scan.score || 0,
      riskLevel: scan.riskLevel,
      createdAt: scan.createdAt,
      updatedAt: scan.updatedAt,
      labelUrl: scan.labelUrl,
      extractedText: scan.extractedText,
      results: scan.results, // Full AI response or error (includes AI-extracted info)
      plan: scan.account.plan,
    }

    return formattedScan
  })
}
