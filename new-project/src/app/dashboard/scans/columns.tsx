"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { api, ApiError } from "@/lib/api-client"

type TranslationFunction = (key: string, fallback?: string) => string

export type Scan = {
  id: string
  productName: string
  category: "TOYS" | "BABY_PRODUCTS" | "COSMETICS_PERSONAL_CARE"
  marketplaces: string[]
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED"
  score: number | null
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | null
  createdAt: string
  createdBy: string
  createdByName: string | null
  labelUrl?: string
}

// Category labels moved to translation function

const statusColors = {
  QUEUED: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400",
  PROCESSING: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 animate-pulse",
  COMPLETED: "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 dark:bg-green-500/20 dark:text-green-400",
  FAILED: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
}

const riskColors = {
  LOW: "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20",
  CRITICAL: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20",
}

const marketplaceFlags: Record<string, string> = {
  US: "🇺🇸",
  UK: "🇬🇧",
  DE: "🇩🇪",
}

export const createColumns = (t: TranslationFunction): ColumnDef<Scan>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t('columns.productName', 'Product Name')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Link 
          href={`/dashboard/scans/${row.original.id}`}
          className="block group"
        >
          <div className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
            {row.getValue("productName")}
            <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-xs text-muted-foreground">
            {t(`category.${row.original.category.toLowerCase()}`, row.original.category)}
          </div>
        </Link>
      )
    },
  },
  {
    accessorKey: "marketplaces",
    header: () => t('columns.marketplaces', 'Marketplaces'),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {row.original.marketplaces.map((mp) => (
            <span key={mp} className="text-xl" title={mp}>
              {marketplaceFlags[mp] || mp}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: () => t('columns.status', 'Status'),
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant="outline" className={statusColors[status]}>
          {t(`status.${status.toLowerCase()}`, status)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t('columns.score', 'Score')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const score = row.original.score
      if (score === null) return <span className="text-muted-foreground">-</span>
      
      const scoreColor = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"
      
      return (
        <div className="text-center">
          <span className={`font-semibold ${scoreColor}`}>{score}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "riskLevel",
    header: () => t('columns.risk', 'Risk'),
    cell: ({ row }) => {
      const risk = row.original.riskLevel
      if (!risk) return <span className="text-muted-foreground">-</span>
      return (
        <Badge variant="outline" className={riskColors[risk]}>
          {t(`risk.${risk.toLowerCase()}`, risk)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdByName",
    header: () => t('columns.createdBy', 'Created By'),
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.createdByName || t('unknown', 'Unknown')}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t('columns.created', 'Created')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const scan = row.original

      const handleDownload = async () => {
        if (!scan.labelUrl) return

        try {
          // Get presigned URL from MinIO
          const data = await api.get<{ url: string; filename: string }>(`/dashboard/api/scans/${scan.id}/download`)

          // Fetch file as blob to force download (not open in browser)
          const fileResponse = await fetch(data.url)
          if (!fileResponse.ok) throw new Error('Failed to fetch file')
          const blob = await fileResponse.blob()
          
          // Create blob URL and trigger download
          const blobUrl = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = blobUrl
          link.download = data.filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Clean up blob URL
          window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
          console.error('Download failed:', error)
          const message = error instanceof ApiError ? error.message : 'Failed to download label. Please try again.'
          alert(message)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('columns.actions', 'Actions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/scans/${scan.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                {t('columns.viewDetails', 'View Details')}
              </Link>
            </DropdownMenuItem>
            {scan.labelUrl && (
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                {t('columns.downloadLabel', 'Download Label')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
