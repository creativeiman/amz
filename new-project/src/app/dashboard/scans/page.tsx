"use client"

import * as React from "react"
import { Plus, Calendar, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "./data-table"
import { createColumns, Scan } from "./columns"
import { ScanSheet } from "./scan-sheet"
import { toast } from "sonner"
import { LoadingPage } from "@/components/loading"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

type AccountUsage = {
  scansUsed: number
  scanLimit: number | null
  resetDate: string | null
}

export default function ScansPage() {
  const [scans, setScans] = React.useState<Scan[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedScan, setSelectedScan] = React.useState<Scan | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [accountUsage, setAccountUsage] = React.useState<AccountUsage | null>(null)

  // Fetch scans
  const fetchScans = React.useCallback(async () => {
    try {
      const response = await fetch("/dashboard/api/scans")
      if (!response.ok) throw new Error("Failed to fetch scans")
      const data = await response.json()
      setScans(data.scans)
      setAccountUsage(data.usage)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Label Scans</h1>
          <p className="text-muted-foreground mt-2">
            Scan product labels for compliance analysis
          </p>
        </div>
        <Button onClick={handleCreateNew} disabled={isLimitReached}>
          <Plus className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>

      {/* Usage Card */}
      {accountUsage && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
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
                  <div className="h-12 w-px bg-border" />
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
              <div className="text-sm text-red-600 font-medium">
                Scan limit reached. Upgrade your plan to continue.
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
