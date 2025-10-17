"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export type Account = {
  id: string
  name: string
  slug: string
  plan: "FREE" | "DELUXE" | "ONE_TIME"
  subscriptionStatus: string
  ownerName: string | null
  ownerEmail: string
  ownerId: string
  isEmailVerified: boolean
  isActive: boolean
  teamMembers: number
  scans: number
  payments: number
  scanLimit: number | null
  scansUsed: number
  createdAt: Date
  updatedAt: Date
}

export const createColumns = (
  onEdit: (account: Account) => void,
  onDelete: (accountId: string) => void
): ColumnDef<Account>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-xs text-muted-foreground">{row.original.slug}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owner
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.getValue("ownerName") || "N/A"}</div>
          <div className="text-xs text-muted-foreground">{row.original.ownerEmail}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.getValue("plan") as string
      const variant =
        plan === "DELUXE"
          ? "default"
          : plan === "ONE_TIME"
          ? "secondary"
          : "outline"
      return <Badge variant={variant}>{plan}</Badge>
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "teamMembers",
    header: "Team",
    cell: ({ row }) => {
      const count = row.getValue("teamMembers") as number
      return <div className="text-center">{count + 1}</div> // +1 for owner
    },
  },
  {
    accessorKey: "scans",
    header: "Scans",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.scans}</div>
    },
  },
  {
    accessorKey: "payments",
    header: "Payments",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.payments}</div>
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
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(account.id)}
            >
              Copy account ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(account)}>
              Edit account
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(account.id)}
            >
              Delete account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

