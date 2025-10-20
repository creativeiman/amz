import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/client"
import { uploadFile, validateFile } from "@/lib/file-upload"
import { addScanJob } from "@/lib/queue/scan-queue"
import { Category } from "@prisma/client"

// GET /dashboard/api/scans - Get all scans for current user's account
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        ownedAccounts: true,
        accountMemberships: {
          include: {
            account: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Determine which account to use and get permissions
    let accountId: string
    let userPermissions: string[] = []
    
    if (user.ownedAccounts.length > 0) {
      accountId = user.ownedAccounts[0].id
      // Owners have all permissions
      userPermissions = ['SCAN_CREATE', 'SCAN_VIEW', 'SCAN_EDIT', 'SCAN_DELETE', 'TEAM_VIEW', 'TEAM_INVITE', 'TEAM_REMOVE']
    } else if (user.accountMemberships.length > 0) {
      accountId = user.accountMemberships[0].accountId
      // Get member's permissions
      userPermissions = user.accountMemberships[0].permissions || []
    } else {
      return NextResponse.json({ error: "No account found" }, { status: 404 })
    }

    // Fetch scans for the account
    const scans = await prisma.scan.findMany({
      where: {
        accountId,
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
      where: { id: accountId },
      select: {
        scansUsedThisMonth: true,
        scanLimitPerMonth: true,
        scanLimitResetAt: true,
      },
    })

    return NextResponse.json({
      scans: formattedScans,
      usage: {
        scansUsed: account?.scansUsedThisMonth || 0,
        scanLimit: account?.scanLimitPerMonth || null,
        resetDate: account?.scanLimitResetAt?.toISOString() || null,
      },
      permissions: userPermissions,
    })
  } catch (error) {
    console.error("Error fetching scans:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /dashboard/api/scans - Create a new scan
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const productName = formData.get("productName") as string
    const category = formData.get("category") as string
    const marketplacesJson = formData.get("marketplaces") as string
    const labelFile = formData.get("labelFile") as File

    // Validate required fields
    if (!productName || !category || !marketplacesJson || !labelFile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    let marketplaces: string[]
    try {
      marketplaces = JSON.parse(marketplacesJson)
    } catch {
      return NextResponse.json(
        { error: "Invalid marketplaces format" },
        { status: 400 }
      )
    }

    // Get user's account
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        ownedAccounts: true,
        accountMemberships: {
          include: {
            account: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Determine which account to use and check permissions
    let accountId: string
    let canCreate = false
    
    if (user.ownedAccounts.length > 0) {
      accountId = user.ownedAccounts[0].id
      canCreate = true // Owners can always create
    } else if (user.accountMemberships.length > 0) {
      accountId = user.accountMemberships[0].accountId
      // Check if user has SCAN_CREATE permission
      const permissions = user.accountMemberships[0].permissions || []
      canCreate = permissions.includes('SCAN_CREATE')
    } else {
      return NextResponse.json({ error: "No account found" }, { status: 404 })
    }

    // Check permission
    if (!canCreate) {
      return NextResponse.json({ error: "You don't have permission to create scans" }, { status: 403 })
    }

    // Check account scan limits
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    if (
      account.scanLimitPerMonth !== null &&
      account.scansUsedThisMonth >= account.scanLimitPerMonth
    ) {
      return NextResponse.json(
        { error: "Scan limit reached for this month" },
        { status: 403 }
      )
    }

    // Validate file
    const validation = validateFile(labelFile)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Upload file to storage
    const labelUrl = await uploadFile(labelFile, "labels")

    // Create scan with QUEUED status
    const scan = await prisma.scan.create({
      data: {
        accountId,
        createdBy: session.user.id,
        productName,
        category: category as Category,
        marketplaces,
        labelUrl,
        originalFilename: labelFile.name, // Preserve original filename
        status: "QUEUED", // Changed from PROCESSING to QUEUED
      },
    })

    // Increment scans used
    await prisma.account.update({
      where: { id: accountId },
      data: {
        scansUsedThisMonth: {
          increment: 1,
        },
      },
    })

    // Queue the scan job for background processing
    await addScanJob({
      scanId: scan.id,
      userId: session.user.id,
      imageUrl: labelUrl,
      category: category as Category,
      marketplaces: marketplaces,
      productName,
    })

    return NextResponse.json(
      {
        message: "Scan queued for processing",
        scan: {
          id: scan.id,
          productName: scan.productName,
          status: scan.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating scan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
