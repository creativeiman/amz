'use client'

import { useEffect, useCallback } from 'react'
import { useScanUpdates } from '@/lib/realtime/socket-client'
import { toast } from 'sonner'

/**
 * Hook to subscribe to real-time updates for all scans
 * Shows toast notifications when scans complete
 */
export function useScanRealtime(scanIds: string[], onUpdate: () => void) {
  useEffect(() => {
    if (scanIds.length === 0) return

    const unsubscribers: Array<() => void> = []

    // Subscribe to each scan
    scanIds.forEach((scanId) => {
      const unsubscribe = subscribeToScan(scanId, onUpdate)
      unsubscribers.push(unsubscribe)
    })

    // Cleanup
    return () => {
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [scanIds.join(','), onUpdate])
}

function subscribeToScan(scanId: string, onUpdate: () => void) {
  return useScanUpdates(scanId).subscribe({
    onProgress: (progress) => {
      console.log(`Scan ${scanId}:`, progress.message)
    },
    onCompleted: (data) => {
      if (data.status === 'COMPLETED') {
        toast.success(`Analysis completed!`, {
          description: `Score: ${data.complianceScore}%`,
        })
      } else {
        toast.error('Analysis failed', {
          description: data.summary,
        })
      }
      // Refresh the scans list
      onUpdate()
    },
    onError: (error) => {
      toast.error('Analysis error', {
        description: error.message,
      })
      onUpdate()
    },
  })
}

/**
 * Hook for monitoring a single scan with real-time progress
 */
export function useScanProgress(scanId: string | null) {
  const {progress, isComplete, completionData, error, isConnected} = useScanUpdates(scanId)
  
  return {
    progress,
    isComplete,
    completionData,
    error,
    isConnected,
  }
}

