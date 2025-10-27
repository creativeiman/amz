/**
 * Hook to sync user's plan between database and JWT session
 * Automatically refreshes session when plan changes in DB
 */

import { useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function usePlanSync() {
  const { data: session, status } = useSession()

  const checkAndSyncPlan = useCallback(async (forceRefresh = false) => {
    if (status !== 'authenticated' || !session?.user) return

    try {
      // Fetch fresh account data from server
      const response = await fetch('/dashboard/api/account', {
        cache: 'no-store', // Force fresh data
      })
      if (!response.ok) return

      const accountData = await response.json()
      const dbPlan = accountData.account?.plan

      // Compare DB plan with JWT plan
      if (dbPlan && dbPlan !== session.user.plan) {
        console.log(`[Plan Sync] Plan mismatch detected: JWT=${session.user.plan}, DB=${dbPlan}`)
        
        if (forceRefresh) {
          console.log('[Plan Sync] Force refreshing NOW (hard reload)...')
          // For immediate updates (after payment), force hard refresh
          window.location.reload()
        } else {
          console.log('[Plan Sync] JWT will auto-sync within 30 seconds on next request')
          // For background checks, let JWT auto-sync naturally
        }
      }
    } catch (error) {
      console.error('[Plan Sync] Error checking plan:', error)
    }
  }, [session, status])

  // Check on mount and when returning to the page
  useEffect(() => {
    checkAndSyncPlan()

    // Also check when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndSyncPlan()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkAndSyncPlan])

  // Also expose manual refresh function
  return {
    refreshPlan: checkAndSyncPlan,
    currentPlan: session?.user?.plan || 'FREE',
    isLoading: status === 'loading',
  }
}

