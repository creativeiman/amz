import { NextRequest } from "next/server"
import { ApiHandler, isErrorResponse } from "@/lib/api-handler"
import { prisma } from "@/db/client"
import { uploadFile, validateFile } from "@/lib/file-upload"
import { addScanJob } from "@/lib/queue/scan-queue"
import { Category, AccountPermission } from "@prisma/client"

// GET /dashboard/api/scans - Get all scans for current user's account
export async function GET() {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
    })
    
    if (isErrorResponse(context)) return context

    // Fetch scans for the account
    const scans = await prisma.scan.findMany({
      where: {
        accountId: context.accountId!,
      },
      include: {
        _count: {
          select: {
            issues: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get creator names
    const creatorIds = [...new Set(scans.map((s) => s.createdBy))]
    const creators = await prisma.user.findMany({
      where: {
        id: {
          in: creatorIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    })

    const creatorMap = new Map(creators.map((c) => [c.id, c.name]))

    // Format response
    const formattedScans = scans.map((scan) => ({
      id: scan.id,
      productName: scan.productName,
      category: scan.category,
      marketplaces: scan.marketplaces,
      status: scan.status,
      score: scan.score,
      riskLevel: scan.riskLevel,
      labelUrl: scan.labelUrl,
      createdAt: scan.createdAt.toISOString(),
      createdBy: scan.createdBy,
      createdByName: creatorMap.get(scan.createdBy) || null,
      issuesCount: scan._count.issues,
    }))

    // Get account usage info
    const account = await prisma.account.findUnique({
      where: { id: context.accountId! },
      select: {
        scansUsedThisMonth: true,
        scanLimitPerMonth: true,
        scanLimitResetAt: true,
      },
    })

    return {
      scans: formattedScans,
      usage: {
        scansUsed: account?.scansUsedThisMonth || 0,
        scanLimit: account?.scanLimitPerMonth || null,
        resetDate: account?.scanLimitResetAt?.toISOString() || null,
      },
      permissions: context.permissions || [],
    }
  })
}

// POST /dashboard/api/scans - Create a new scan
export async function POST(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAccount: true,
      requirePermissions: [AccountPermission.SCAN_CREATE],
    })
    
    if (isErrorResponse(context)) return context

    // Get form data
    const formData = await request.formData()
    const productName = formData.get("productName") as string
    const category = formData.get("category") as string
    const marketplacesJson = formData.get("marketplaces") as string
    const labelFile = formData.get("labelFile") as File

    // Validate required fields
    if (!productName || !category || !marketplacesJson || !labelFile) {
      return ApiHandler.badRequest("Missing required fields")
    }

    let marketplaces: string[]
    try {
      marketplaces = JSON.parse(marketplacesJson)
    } catch {
      return ApiHandler.badRequest("Invalid marketplaces format")
    }

    // Get account to check scan limits
    const account = await prisma.account.findUnique({
      where: { id: context.accountId! },
      select: {
        id: true,
        plan: true,
        scansUsedThisMonth: true,
        scanLimitPerMonth: true,
        scanLimitResetAt: true,
      },
    })

    if (!account) {
      return ApiHandler.notFound("Account not found")
    }

    // Check if user has reached scan limit
    if (
      account.scanLimitPerMonth !== null &&
      account.scansUsedThisMonth >= account.scanLimitPerMonth
    ) {
      return ApiHandler.forbidden(
        `Scan limit reached. You have used ${account.scansUsedThisMonth} of ${account.scanLimitPerMonth} scans this month.`
      )
    }

    // Validate file
    const fileValidation = validateFile(labelFile)
    if (!fileValidation.valid) {
      return ApiHandler.badRequest(fileValidation.error || "Invalid file")
    }

    // Upload file
    let labelUrl: string
    try {
      labelUrl = await uploadFile(labelFile, "labels")
    } catch (error) {
      console.error("File upload error:", error)
      return ApiHandler.error(
        "File upload failed",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    }

    // Create scan record
    const scan = await prisma.scan.create({
      data: {
        productName,
        category: category as Category,
        marketplaces,
        labelUrl,
        status: "QUEUED",
        accountId: context.accountId!,
        createdBy: context.userId,
      },
    })

    // Increment scans used
    await prisma.account.update({
      where: { id: context.accountId! },
      data: {
        scansUsedThisMonth: {
          increment: 1,
        },
      },
    })

    // Add to queue for processing
    await addScanJob({
      scanId: scan.id,
      userId: context.userId,
      imageUrl: labelUrl,
      category: category as Category,
      marketplaces,
      productName,
    })

    return {
      message: "Scan created successfully",
      scan: {
        id: scan.id,
        productName: scan.productName,
        category: scan.category,
        status: scan.status,
        createdAt: scan.createdAt.toISOString(),
      },
    }
  })
}
