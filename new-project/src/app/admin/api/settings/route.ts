import { NextRequest } from "next/server"
import { ApiHandler, isErrorResponse } from "@/lib/api-handler"
import { prisma } from "@/db/client"

// GET /admin/api/settings - Get system settings
export async function GET() {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAdmin: true,
    })
    
    if (isErrorResponse(context)) return context

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

    return {
      settings: {
        masterPrompt: settings.masterPrompt || "",
        commonRules: settings.commonRules || "",
        usRules: settings.usRules || "",
        ukRules: settings.ukRules || "",
        euRules: settings.euRules || "",
      },
    }
  })
}

// PUT /admin/api/settings - Update system settings
export async function PUT(request: NextRequest) {
  return ApiHandler.handle(async () => {
    const context = await ApiHandler.getUserContext({
      requireAuth: true,
      requireAdmin: true,
    })
    
    if (isErrorResponse(context)) return context

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

    return {
      message: "Settings updated successfully",
      settings,
    }
  })
}
