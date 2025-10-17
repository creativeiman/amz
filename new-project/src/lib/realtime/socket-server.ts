/**
 * Socket.io Server for Real-time Updates
 * 
 * Open-source, self-hosted alternative to Pusher
 * Runs alongside Next.js server
 */

import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { publicEnv } from '@/config/env'

let io: SocketIOServer | null = null

export function initSocketServer(httpServer: HTTPServer) {
  if (io) {
    console.log('⚠️  Socket.io already initialized')
    return io
  }

  io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: publicEnv.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`📡 Client connected: ${socket.id}`)

    // Allow clients to subscribe to specific scan updates
    socket.on('subscribe-scan', (scanId: string) => {
      socket.join(`scan-${scanId}`)
      console.log(`📡 Client ${socket.id} subscribed to scan ${scanId}`)
    })

    socket.on('unsubscribe-scan', (scanId: string) => {
      socket.leave(`scan-${scanId}`)
      console.log(`📡 Client ${socket.id} unsubscribed from scan ${scanId}`)
    })

    socket.on('disconnect', () => {
      console.log(`📡 Client disconnected: ${socket.id}`)
    })
  })

  console.log('🚀 Socket.io server initialized')
  return io
}

export function getSocketServer() {
  if (!io) {
    console.warn('⚠️  Socket.io not initialized yet')
  }
  return io
}

// Send update to all clients subscribed to a scan
export function sendSocketUpdate(
  scanId: string,
  event: 'progress' | 'completed' | 'error',
  data: any
) {
  if (!io) {
    // Socket.io not initialized - this is fine if using polling instead
    return
  }

  io.to(`scan-${scanId}`).emit(event, data)
  console.log(`📤 Sent ${event} to scan-${scanId}`)
}

