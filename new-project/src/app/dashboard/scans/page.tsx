"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Calendar, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "./data-table"
import { createColumns, Scan } from "./columns"
import { ScanSheet } from "./scan-sheet"
import { toast } from "sonner"
import { LoadingPage } from "@/components/loading"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { useSession } from "next-auth/react"

type AccountUsage = {
  scansUsed: number
  scanLimit: number | null
  resetDate: string | null
}

export default function ScansPage() {
  const { data: session } = useSession()
  const [scans, setScans] = React.useState<Scan[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedScan, setSelectedScan] = React.useState<Scan | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [accountUsage, setAccountUsage] = React.useState<AccountUsage | null>(null)
  const [userPermissions, setUserPermissions] = React.useState<string[]>([])

  // Check if user is owner or has SCAN_CREATE permission
  const canCreateScan = React.useMemo(() => {
    const isOwner = session?.user?.isOwner
    const hasPermission = userPermissions.includes('SCAN_CREATE')
    return isOwner || hasPermission
  }, [session?.user?.isOwner, userPermissions])

  // Fetch scans
  const fetchScans = React.useCallback(async () => {
    try {
      const response = await fetch("/dashboard/api/scans")
      if (!response.ok) throw new Error("Failed to fetch scans")
      const data = await response.json()
      setScans(data.scans)
      setAccountUsage(data.usage)
      setUserPermissions(data.permissions || [])
    } catch (error) {
      console.error("Error fetching scans:", error)
      toast.error("Failed to load scans")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchScans()
  }, [fetchScans])

  // Auto-refresh for active scans (QUEUED or PROCESSING)
  React.useEffect(() => {
    // Check if there are any active scans
    const hasActiveScans = scans.some(
      (scan) => scan.status === 'QUEUED' || scan.status === 'PROCESSING'
    )

    if (!hasActiveScans) return

    // Poll every 3 seconds when there are active scans
    console.log('🔄 Auto-polling enabled - active scans detected')
    const interval = setInterval(() => {
      console.log('🔄 Refreshing scans...')
      fetchScans()
    }, 3000) // Refresh every 3 seconds

    return () => {
      console.log('⏸️  Auto-polling disabled')
      clearInterval(interval)
    }
  }, [scans, fetchScans])

  // Handle save scan (create only - scans are view-only after creation)
  const handleSave = React.useCallback(
    async (formData: FormData) => {
      try {
        const response = await fetch("/dashboard/api/scans", {
          method: "POST",
          body: formData, // FormData for file upload
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create scan")
        }

        toast.success("Scan created successfully")
        fetchScans()
        setIsSheetOpen(false)
        setSelectedScan(null)
      } catch (error) {
        console.error("Error saving scan:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to create scan"
        toast.error(errorMessage)
        throw error
      }
    },
    [fetchScans]
  )

  // Handle create new scan
  const handleCreateNew = React.useCallback(() => {
    setSelectedScan(null)
    setIsSheetOpen(true)
  }, [])

  const columns = React.useMemo(
    () => createColumns(),
    []
  )

  const isLimitReached = accountUsage
    ? accountUsage.scanLimit !== null && accountUsage.scansUsed >= accountUsage.scanLimit
    : false

  if (isLoading) {
    return <LoadingPage text="Loading scans..." />
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Label Scans</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Scan product labels for compliance analysis
          </p>
        </div>
        {canCreateScan && (
          <Button onClick={handleCreateNew} disabled={isLimitReached} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        )}
      </div>

      {/* Usage Card */}
      {accountUsage && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Scans Used</div>
                  <div className="text-2xl font-bold">
                    {accountUsage.scansUsed}
                    {accountUsage.scanLimit !== null && (
                      <span className="text-muted-foreground text-lg font-normal">
                        {" "}/ {accountUsage.scanLimit}
                      </span>
                    )}
                    {accountUsage.scanLimit === null && (
                      <span className="text-muted-foreground text-lg font-normal"> / Unlimited</span>
                    )}
                  </div>
                </div>
              </div>

              {accountUsage.resetDate && (
                <>
                  <div className="hidden sm:block h-12 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Resets On</div>
                      <div className="text-lg font-semibold">
                        {format(new Date(accountUsage.resetDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {isLimitReached && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Scan limit reached. Upgrade your plan to continue.
                </span>
                <Link 
                  href="/dashboard/billing"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-orange-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Upgrade Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
        </Card>
      )}

      <DataTable columns={columns} data={scans} />

      <ScanSheet
        scan={selectedScan}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false)
          setSelectedScan(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
