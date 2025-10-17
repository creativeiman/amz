# Background Job Queue Setup

This document explains the **open-source, self-hosted** background job queue system for asynchronous AI label analysis.

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │◄────►│  Next.js    │◄────►│   Redis     │
│  (Socket.io)│      │   Server    │      │   (Queue)   │
└─────────────┘      └─────────────┘      └─────────────┘
                              │                    ▲
                              │                    │
                              ▼                    ▼
                     ┌─────────────┐      ┌─────────────┐
                     │  Socket.io  │      │   Worker    │
                     │   Server    │      │  (BullMQ)   │
                     └─────────────┘      └─────────────┘
                                                  │
                                                  ▼
                                          ┌─────────────┐
                                          │   Claude    │
                                          │     AI      │
                                          └─────────────┘
```

## Tech Stack (All Open-Source + Docker)

### 1. **BullMQ** (Job Queue)
- Most popular job queue for Node.js
- Built on Redis
- Features: Retries, priorities, rate limiting, delayed jobs
- Web dashboard: Bull Board

### 2. **Redis** (Message Broker + Cache)
- In-memory data store
- Fast, reliable
- Docker: `redis:7-alpine`

### 3. **Socket.io** (Real-time Updates)
- WebSocket-based real-time communication
- Auto-reconnection, fallbacks
- Self-hosted, no external service

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd new-project
pnpm add bullmq ioredis socket.io socket.io-client
pnpm add -D @types/socket.io @types/ioredis
```

### Step 2: Start Redis with Docker

```bash
# Start Redis
docker-compose -f docker-compose.queue.yml up -d

# Check Redis is running
docker ps | grep redis

# Test Redis connection
docker exec -it amz-redis redis-cli ping
# Should return: PONG
```

### Step 3: Add Environment Variables

Create/update `.env.local`:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379

# Worker Configuration
SCAN_WORKER_CONCURRENCY=2  # Process 2 scans simultaneously

# Existing configs...
DATABASE_URL=...
ANTHROPIC_API_KEY=...
```

### Step 4: Start the Worker Process

**Option A: Development (Separate Terminal)**
```bash
pnpm tsx src/server/worker.ts
```

**Option B: Production (PM2)**
```bash
npm install -g pm2
pm2 start src/server/worker.ts --name amz-worker
pm2 logs amz-worker
```

**Option C: Docker (Coming Soon)**
```bash
docker-compose up worker
```

### Step 5: Update Next.js Server

The Socket.io server needs to be initialized with Next.js.

**Create `src/server/socket-init.ts`** (already created)

**Update your API route or server setup** to initialize Socket.io on startup.

### Step 6: Update Scan Creation API

Replace the synchronous scan analysis with async job queue.

**Before (Slow, Blocking):**
```typescript
// Wait 80+ seconds
const result = await analyzeLabelWithAI(file, category, marketplaces)
return result
```

**After (Fast, Non-Blocking):**
```typescript
// Queue job (instant response)
await addScanJob({
  scanId,
  userId,
  imageUrl,
  category,
  marketplaces,
  productName,
})
return { scanId, status: 'QUEUED' }
```

### Step 7: Update Frontend Components

Use the `useScanUpdates` hook to show real-time progress:

```tsx
'use client'

import { useScanUpdates } from '@/lib/realtime/socket-client'

export function ScanProgress({ scanId }: { scanId: string }) {
  const { progress, isComplete, error } = useScanUpdates(scanId)

  return (
    <div>
      <div className="progress-bar">
        <div style={{ width: `${progress.percentage}%` }} />
      </div>
      <p>{progress.message}</p>
      {isComplete && <p>✅ Analysis complete!</p>}
      {error && <p>❌ Error: {error}</p>}
    </div>
  )
}
```

## Docker Services

### Redis
```bash
# Start
docker-compose -f docker-compose.queue.yml up -d redis

# Monitor logs
docker logs -f amz-redis

# CLI access
docker exec -it amz-redis redis-cli
```

### Redis Commander (Web UI)
```bash
# Start
docker-compose -f docker-compose.queue.yml up -d redis-commander

# Access: http://localhost:8081
```

### Worker (Future)
```bash
# Start worker in Docker
docker-compose -f docker-compose.queue.yml up -d worker
```

## Monitoring

### Queue Stats API
```typescript
GET /api/queue/stats

Response:
{
  "waiting": 2,
  "active": 1,
  "completed": 145,
  "failed": 3
}
```

### Job Status API
```typescript
GET /api/scans/:scanId/status

Response:
{
  "state": "active",
  "progress": {
    "stage": "analyzing",
    "percentage": 45,
    "message": "Analyzing label..."
  }
}
```

### Bull Board Dashboard (Optional)

Install Bull Board for a web dashboard:

```bash
pnpm add @bull-board/api @bull-board/express
```

Access at: `http://localhost:3000/admin/queues`

## Benefits

✅ **Fast Response**: API returns immediately (< 100ms)  
✅ **Better UX**: Real-time progress updates  
✅ **Reliability**: Auto-retry on failures  
✅ **Scalability**: Process multiple scans simultaneously  
✅ **Cost Control**: Rate limiting for API calls  
✅ **Monitoring**: Built-in job tracking  
✅ **Self-Hosted**: No external SaaS fees  
✅ **Docker-Ready**: Easy deployment  

## Comparison

| Feature | Synchronous | Async Queue |
|---------|-------------|-------------|
| Response time | 80+ seconds | < 100ms |
| User experience | Blocking, timeout risk | Real-time updates |
| Scalability | 1 scan at a time | Multiple concurrent |
| Reliability | No retry | Auto-retry |
| Monitoring | None | Full job tracking |
| Cost | High (long connections) | Low (background) |

## Production Deployment

### Using PM2 (Node.js Process Manager)
```bash
# Start worker
pm2 start src/server/worker.ts --name amz-worker

# Auto-start on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Using Docker
```bash
docker-compose -f docker-compose.queue.yml up -d
```

### Using Kubernetes
See `k8s/worker-deployment.yaml` (coming soon)

## Troubleshooting

### Redis connection failed
```bash
# Check Redis is running
docker ps | grep redis

# Test connection
docker exec -it amz-redis redis-cli ping
```

### Worker not processing jobs
```bash
# Check worker logs
pm2 logs amz-worker

# Check queue stats
redis-cli
> LLEN bull:label-scan:waiting
```

### Socket.io not connecting
- Check CORS settings in `socket-server.ts`
- Verify Socket.io path: `/api/socket`
- Check browser console for errors

## Alternative: Server-Sent Events (SSE)

If you prefer not to use Socket.io, you can use SSE (already implemented in `sse-server.ts`):

**Pros:**
- No Socket.io dependency
- Native browser support
- Simpler setup

**Cons:**
- One-way only (server → client)
- Less scalable for multi-server

See `docs/SSE_SETUP.md` for SSE implementation.

## Next Steps

1. ✅ Install dependencies
2. ✅ Start Redis with Docker
3. ⏳ Update scan API to use queue
4. ⏳ Initialize Socket.io server
5. ⏳ Update frontend components
6. ⏳ Test end-to-end flow
7. ⏳ Deploy to production

