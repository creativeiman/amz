import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/client"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Check if user has access to this scan
    const userAccount = await prisma.accountMember.findFirst({
      where: {
        userId: session.user.id,
        accountId: scan.accountId,
        isActive: true,
      },
    })

    const isOwner = scan.account.ownerId === session.user.id

    if (!userAccount && !isOwner) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
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

    return NextResponse.json(formattedScan)
  } catch (error) {
    console.error("Error fetching scan:", error)
    return NextResponse.json(
      { error: "Failed to fetch scan" },
      { status: 500 }
    )
  }
}
