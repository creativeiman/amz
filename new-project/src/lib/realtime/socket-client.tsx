/**
 * Socket.io Client Hook for React Components
 * 
 * Use this to subscribe to real-time scan updates
 */

'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

function getSocket() {
  if (!socket) {
    socket = io({
      path: '/api/socket',
      autoConnect: true,
    })
  }
  return socket
}

export interface ScanProgress {
  stage: 'queued' | 'analyzing' | 'saving' | 'completed' | 'failed'
  percentage: number
  message: string
}

export interface ScanCompleted {
  status: 'COMPLETED' | 'FAILED'
  complianceScore?: number
  summary?: string
}

/**
 * Hook to subscribe to real-time scan updates
 * 
 * @example
 * const { progress, isComplete, error } = useScanUpdates(scanId)
 */
export function useScanUpdates(scanId: string | null) {
  const [progress, setProgress] = useState<ScanProgress>({
    stage: 'queued',
    percentage: 0,
    message: 'Initializing...',
  })
  const [isComplete, setIsComplete] = useState(false)
  const [completionData, setCompletionData] = useState<ScanCompleted | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!scanId) return

    const socket = getSocket()

    // Connection handlers
    socket.on('connect', () => {
      console.log('✅ Socket connected')
      setIsConnected(true)
      socket.emit('subscribe-scan', scanId)
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
      setIsConnected(false)
    })

    // Scan update handlers
    socket.on('progress', (data: ScanProgress) => {
      console.log('📊 Progress update:', data)
      setProgress(data)
    })

    socket.on('completed', (data: ScanCompleted) => {
      console.log('✅ Scan completed:', data)
      setIsComplete(true)
      setCompletionData(data)
      setProgress({
        stage: 'completed',
        percentage: 100,
        message: 'Analysis completed!',
      })
    })

    socket.on('error', (data: { message: string }) => {
      console.error('❌ Scan error:', data)
      setError(data.message)
      setProgress({
        stage: 'failed',
        percentage: 0,
        message: `Error: ${data.message}`,
      })
    })

    // Connect socket
    socket.connect()

    // Cleanup
    return () => {
      socket.emit('unsubscribe-scan', scanId)
      socket.off('connect')
      socket.off('disconnect')
      socket.off('progress')
      socket.off('completed')
      socket.off('error')
    }
  }, [scanId])

  // Return both the state and a subscribe function for manual subscription
  return {
    progress,
    isComplete,
    completionData,
    error,
    isConnected,
    subscribe: (handlers: {
      onProgress?: (progress: ScanProgress) => void
      onCompleted?: (data: ScanCompleted) => void
      onError?: (error: { message: string }) => void
    }) => {
      if (!scanId) return () => {}

      const socket = getSocket()

      if (handlers.onProgress) socket.on('progress', handlers.onProgress)
      if (handlers.onCompleted) socket.on('completed', handlers.onCompleted)
      if (handlers.onError) socket.on('error', handlers.onError)

      socket.emit('subscribe-scan', scanId)

      return () => {
        socket.emit('unsubscribe-scan', scanId)
        if (handlers.onProgress) socket.off('progress', handlers.onProgress)
        if (handlers.onCompleted) socket.off('completed', handlers.onCompleted)
        if (handlers.onError) socket.off('error', handlers.onError)
      }
    },
  }
}

