import { useState, useEffect, useCallback } from 'react'

/**
 * Account data shape from API
 */
export type Account = {
  id: string
  name: string
  slug: string
  plan: 'FREE' | 'DELUXE' | 'ONE_TIME'
  businessName: string | null
  billingEmail: string | null
  primaryMarketplace: string | null
  productCategories: string[]
  subscriptionCancelAt?: string | null // ISO date string when subscription will be canceled
}

/**
 * Custom hook to fetch fresh account data from API (bypasses JWT cache)
 * 
 * @returns Object with account data, loading state, error, and refetch function
 * 
 * @example
 * ```tsx
 * const { account, isLoading, error, refetch } = useFreshAccount()
 * 
 * if (isLoading) return <Spinner />
 * if (error) return <Error />
 * 
 * return <div>Current Plan: {account?.plan}</div>
 * ```
 */
export function useFreshAccount() {
  const [account, setAccount] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAccount = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/dashboard/api/account', {
        cache: 'no-store', // Always fetch fresh from server
      })
      
      if (response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json()
          // Handle both response structures: result.data.account and result.account
          const accountData = result.data?.account || result.account
          setAccount(accountData)
        } else {
          // Not JSON (probably HTML redirect), user is not authenticated
          setAccount(null)
        }
      } else if (response.status === 401 || response.status === 403) {
        // User not authenticated - not an error, just not logged in
        setAccount(null)
      } else {
        // Check if it's JSON error response
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to fetch account: ${response.statusText}`)
        } else {
          // HTML error page (redirect), treat as unauthenticated
          setAccount(null)
        }
      }
    } catch (err) {
      // Network error, JSON parse error, or unauthenticated user
      // Silently fail for unauthenticated users (common case for public pages)
      console.debug('[useFreshAccount] Could not fetch account:', err instanceof Error ? err.message : 'Unknown error')
      setAccount(null)
      // Don't set error state for auth issues, only for real errors
      if (err instanceof Error && !err.message.includes('JSON')) {
        setError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccount()
  }, [fetchAccount])

  return { 
    account, 
    isLoading, 
    error, 
    refetch: fetchAccount 
  }
}

