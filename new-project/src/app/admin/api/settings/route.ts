import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/db/client"

// GET /admin/api/settings - Get system settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create settings (singleton pattern)
    let settings = await prisma.systemSettings.findUnique({
      where: { id: "system_settings" },
    })

    if (!settings) {
      // Create default settings
      settings = await prisma.systemSettings.create({
        data: {
          id: "system_settings",
          masterPrompt: null,
          commonRules: null,
          usRules: null,
          ukRules: null,
          euRules: null,
        },
      })
    }

    return NextResponse.json({
      settings: {
        masterPrompt: settings.masterPrompt || "",
        commonRules: settings.commonRules || "",
        usRules: settings.usRules || "",
        ukRules: settings.ukRules || "",
        euRules: settings.euRules || "",
      },
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /admin/api/settings - Update system settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      masterPrompt,
      commonRules,
      usRules,
      ukRules,
      euRules,
    } = body

    // Upsert settings
    const settings = await prisma.systemSettings.upsert({
      where: { id: "system_settings" },
      update: {
        masterPrompt: masterPrompt || null,
        commonRules: commonRules || null,
        usRules: usRules || null,
        ukRules: ukRules || null,
        euRules: euRules || null,
      },
      create: {
        id: "system_settings",
        masterPrompt: masterPrompt || null,
        commonRules: commonRules || null,
        usRules: usRules || null,
        ukRules: ukRules || null,
        euRules: euRules || null,
      },
    })

    return NextResponse.json({
      message: "Settings updated successfully",
      settings,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

