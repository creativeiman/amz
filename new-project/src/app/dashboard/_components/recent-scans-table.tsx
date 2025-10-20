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
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No scans yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Upload your first product label to get started with compliance checking
            </p>
            <Button onClick={onNewScan} size="lg">
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
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/dashboard/scans/${scan.id}`)}
            >
              <div className="flex-1">
                <h4 className="font-semibold">{scan.productName}</h4>
                <div className="flex items-center gap-2 mt-1">
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
              <div className="flex items-center gap-4">
                {scan.score !== null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold">{scan.score}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                )}
                <Button variant="ghost" size="icon">
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

