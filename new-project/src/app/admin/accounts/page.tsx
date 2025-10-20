"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "./data-table"
import { createColumns, Account } from "./columns"
import { AccountSheet } from "./account-sheet"
import { toast } from "sonner"
import { api, ApiError } from "@/lib/api-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [accountToDelete, setAccountToDelete] = React.useState<Account | null>(null)

  // Fetch accounts
  const fetchAccounts = React.useCallback(async () => {
    try {
      const data = await api.get<{ accounts: Account[] }>("/admin/api/accounts")
      setAccounts(data.accounts)
    } catch (error) {
      console.error("Error fetching accounts:", error)
      const message = error instanceof ApiError ? error.message : "Failed to load accounts"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  // Handle edit account
  const handleEdit = React.useCallback((account: Account) => {
    setSelectedAccount(account)
    setIsSheetOpen(true)
  }, [])

  // Handle delete account - just open the dialog
  const handleDelete = React.useCallback(
    (accountId: string) => {
      const account = accounts.find((a) => a.id === accountId)
      if (account) {
        setAccountToDelete(account)
      }
    },
    [accounts]
  )

  // Confirm delete account
  const confirmDelete = React.useCallback(async () => {
    if (!accountToDelete) return

    try {
      await api.delete(`/admin/api/accounts/${accountToDelete.id}`)
      toast.success("Account deleted successfully")
      fetchAccounts()
    } catch (error) {
      console.error("Error deleting account:", error)
      const message = error instanceof ApiError ? error.message : "Failed to delete account"
      toast.error(message)
    } finally {
      setAccountToDelete(null)
    }
  }, [accountToDelete, fetchAccounts])

  // Handle save account (create or update)
  const handleSave = React.useCallback(
    async (data: {
      accountName: string
      ownerName: string
      ownerEmail: string
      plan: "FREE" | "DELUXE" | "ONE_TIME"
      isEmailVerified: boolean
      isActive: boolean
    }) => {
      try {
        const isUpdate = !!selectedAccount

        if (isUpdate) {
          await api.put(`/admin/api/accounts/${selectedAccount.id}`, data)
        } else {
          await api.post("/admin/api/accounts", data)
        }

        toast.success(
          isUpdate ? "Account updated successfully" : "Account created successfully"
        )
        fetchAccounts()
        setIsSheetOpen(false)
        setSelectedAccount(null)
      } catch (error) {
        console.error("Error saving account:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to save account"
        toast.error(errorMessage)
        throw error
      }
    },
    [selectedAccount, fetchAccounts]
  )

  // Handle create new account
  const handleCreateNew = React.useCallback(() => {
    setSelectedAccount(null)
    setIsSheetOpen(true)
  }, [])

  const columns = React.useMemo(
    () => createColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading accounts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all accounts and their team members
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <DataTable columns={columns} data={accounts} />

      <AccountSheet
        account={selectedAccount}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false)
          setSelectedAccount(null)
        }}
        onSave={handleSave}
      />

      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <div>
                  This action cannot be undone. This will permanently delete the account
                  and remove all associated data including scans, team members, and payment history.
                </div>
                {accountToDelete && (
                  <div className="mt-4 rounded-md bg-muted p-3 space-y-1">
                    <div className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">Account:</span> {accountToDelete.name}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">Owner:</span> {accountToDelete.ownerName || "N/A"}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">Email:</span> {accountToDelete.ownerEmail}
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
