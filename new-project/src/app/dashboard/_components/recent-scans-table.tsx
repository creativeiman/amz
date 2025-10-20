"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye } from "lucide-react"

interface Scan {
  id: string
  productName: string
  category: string
  score: number | null
  riskLevel: string | null
  status: string
  createdAt: string
}

interface RecentScansTableProps {
  scans: Scan[]
  onNewScan: () => void
}

export function RecentScansTable({ scans, onNewScan }: RecentScansTableProps) {
  const router = useRouter()

  const getRiskBadgeVariant = (riskLevel: string | null) => {
    switch (riskLevel) {
      case 'LOW':
        return 'default'
      case 'MEDIUM':
        return 'secondary'
      case 'HIGH':
        return 'destructive'
      case 'CRITICAL':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default'
      case 'PROCESSING':
        return 'secondary'
      case 'FAILED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (scans.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Scans</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-muted rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">No scans yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-sm">
              Upload your first product label to get started with compliance checking
            </p>
            <Button onClick={onNewScan} size="lg" className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              Start Your First Scan
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Scans</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer gap-3"
              onClick={() => router.push(`/dashboard/scans/${scan.id}`)}
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base truncate">{scan.productName}</h4>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                  <Badge variant="outline" className="text-xs">
                    {scan.category.replace('_', ' ')}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(scan.status)} className="text-xs">
                    {scan.status}
                  </Badge>
                  {scan.riskLevel && (
                    <Badge variant={getRiskBadgeVariant(scan.riskLevel)} className="text-xs">
                      {scan.riskLevel}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(scan.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0">
                {scan.score !== null && (
                  <div className="text-left sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold">{scan.score}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                )}
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

