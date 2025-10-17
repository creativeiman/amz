# Queue System Installation Guide

Complete setup for the **open-source, self-hosted** background job queue system.

## 📦 Architecture

```
User Upload → Next.js API → BullMQ Queue → Redis → Worker → Claude AI
                    ↓                                          ↓
              Socket.io ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← Updates
```

## 🛠️ Tech Stack (All Open-Source)

- **BullMQ**: Job queue for Node.js
- **Redis**: Message broker (Docker)
- **Socket.io**: Real-time WebSocket communication
- **PostgreSQL**: Database (already configured)

---

## Step 1: Install Dependencies

```bash
cd new-project

# Install BullMQ and Redis client
pnpm add bullmq ioredis

# Install Socket.io for real-time updates
pnpm add socket.io socket.io-client

# Install types
pnpm add -D @types/ioredis
```

## Step 2: Start Redis with Docker

```bash
# Start Redis
docker-compose -f docker-compose.queue.yml up -d redis

# Verify Redis is running
docker ps | grep redis

# Test Redis connection
docker exec -it amz-redis redis-cli ping
# Expected output: PONG
```

## Step 3: Configure Environment Variables

Your `.env.local` should include:

```env
# Existing configs
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# NEW: Redis Configuration
REDIS_URL=redis://localhost:6379

# NEW: Worker Configuration (optional, defaults to 2)
SCAN_WORKER_CONCURRENCY=2

# NEW: Public App URL (for Socket.io CORS)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Add Worker Script to package.json

Update your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "worker": "tsx src/server/worker.ts",
    "worker:dev": "tsx watch src/server/worker.ts"
  }
}
```

## Step 5: Start the Worker

**Development (separate terminal):**
```bash
cd new-project
pnpm worker
```

You should see:
```
🚀 Starting background worker...
📍 Redis URL: redis://localhost:6379
⚙️  Worker concurrency: 2
🤖 AI enabled: ✅
📦 Queue enabled: ✅
🚀 Scan worker started (concurrency: 2)
✅ Worker started successfully!
🔍 Waiting for jobs...
```

## Step 6: Update Your Scan API

I'll create the updated API route for you. This replaces the synchronous scan with async queue.

---

## 📊 Monitoring

### Redis Commander (Web UI)
```bash
# Start Redis Commander
docker-compose -f docker-compose.queue.yml up -d redis-commander

# Access at: http://localhost:8081
```

### Check Queue Stats
```bash
# Connect to Redis CLI
docker exec -it amz-redis redis-cli

# Check queue length
> LLEN bull:label-scan:waiting
> LLEN bull:label-scan:active
> LLEN bull:label-scan:completed
```

### View Worker Logs
```bash
# If running worker directly
# Check terminal output

# If running with PM2 (production)
pm2 logs amz-worker
```

---

## 🚀 Production Deployment

### Option 1: PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start worker
pm2 start src/server/worker.ts --name amz-worker --interpreter tsx

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
```

### Option 2: Docker
Coming soon - worker Dockerfile

### Option 3: Systemd Service
Create `/etc/systemd/system/amz-worker.service`:
```ini
[Unit]
Description=AMZ Scan Worker
After=network.target redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/amz/new-project
ExecStart=/usr/bin/node dist/server/worker.js
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 🧪 Testing the Queue

### Test 1: Queue a Job Manually
```typescript
// In a script or API route
import { addScanJob } from '@/lib/queue/scan-queue'

await addScanJob({
  scanId: 'test-123',
  userId: 'user-1',
  imageUrl: './test-images/cosmetic-face-mask.png',
  category: 'COSMETICS_PERSONAL_CARE',
  marketplaces: ['US', 'DE'],
  productName: 'Test Product',
})
```

### Test 2: Check Job Status
```bash
# In Redis CLI
docker exec -it amz-redis redis-cli

# List all jobs
> KEYS bull:label-scan:*

# Get job data
> HGETALL bull:label-scan:test-123
```

### Test 3: Monitor Real-time Updates
Open your browser console and connect to Socket.io:
```javascript
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', { path: '/api/socket' })

socket.on('connect', () => {
  console.log('Connected!')
  socket.emit('subscribe-scan', 'test-123')
})

socket.on('progress', (data) => {
  console.log('Progress:', data)
})

socket.on('completed', (data) => {
  console.log('Completed:', data)
})
```

---

## 📈 Benefits vs Synchronous Processing

| Metric | Before (Sync) | After (Async Queue) |
|--------|---------------|---------------------|
| API Response Time | 80+ seconds | < 100ms |
| User Experience | Loading spinner 80s | Real-time progress |
| Concurrent Scans | 1 at a time | 2+ simultaneously |
| Reliability | Timeout risk | Auto-retry |
| Scalability | Single thread | Multi-worker |
| Monitoring | None | Full job tracking |

---

## 🔧 Troubleshooting

### Redis Connection Error
```bash
# Check Redis is running
docker ps | grep redis

# Check logs
docker logs amz-redis

# Restart Redis
docker-compose -f docker-compose.queue.yml restart redis
```

### Worker Not Processing Jobs
```bash
# Check worker is running
ps aux | grep worker

# Check Redis connection from worker
# Look for "Worker started successfully" in logs
```

### Socket.io Connection Failed
- Verify `NEXT_PUBLIC_APP_URL` in `.env.local`
- Check browser console for CORS errors
- Ensure Socket.io path is `/api/socket`

### Jobs Stuck in "Waiting"
```bash
# Check active workers
docker exec -it amz-redis redis-cli
> CLIENT LIST | grep bull

# Force process stalled jobs
> LPOP bull:label-scan:waiting
```

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start Redis
3. ✅ Configure environment
4. ✅ Start worker
5. ⏳ Update scan API (next file I'll create)
6. ⏳ Update frontend components
7. ⏳ Test end-to-end
8. ⏳ Deploy to production

Would you like me to create the updated API routes and React components next?

