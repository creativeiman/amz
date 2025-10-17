# 🚀 Queue System - Quick Start Guide

This guide will get the background job queue system running in **5 minutes**.

## ✅ Prerequisites

- ✅ Dependencies installed (`pnpm install` already ran)
- ✅ Redis Docker container running
- ✅ Database updated with QUEUED status

## 🏃 Quick Start

### Step 1: Start Redis (if not running)

```bash
cd new-project
pnpm redis:start
```

### Step 2: Start the Worker

**Open a NEW terminal window and run:**

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

### Step 3: Start Next.js (in original terminal)

```bash
pnpm dev
```

### Step 4: Test It! 

1. Go to http://localhost:3000/dashboard/scans
2. Click "**+ New Scan**"
3. Upload a label image (use `./test-images/cosmetic-face-mask.png`)
4. Fill in details:
   - Product Name: Test Product
   - Category: Cosmetics/Personal Care
   - Marketplaces: US, DE
5. Click "**Create Scan**"

**What happens:**
- ✅ Scan appears instantly with status **QUEUED** (gray badge)
- ✅ Worker picks it up → status changes to **PROCESSING** (blue, pulsing)
- ✅ 30-90 seconds later → status changes to **COMPLETED** (green)
- ✅ Toast notification appears: "Analysis completed! Score: X%"
- ✅ Page auto-refreshes with results

## 📊 Monitoring

### Check Redis

```bash
# View Redis logs
pnpm redis:logs

# Connect to Redis CLI
docker exec amz-redis redis-cli

# Check queue status
> LLEN bull:label-scan:waiting
> LLEN bull:label-scan:active
```

### Check Worker

Watch the worker terminal - you'll see:
```
📝 Added scan job abc123 to queue
🔄 Processing job abc123 for scan abc123
📊 Job abc123: analyzing - 30% - Analyzing label with Claude AI...
✅ AI analysis completed in 75.32s for scan abc123
✅ Job abc123 completed successfully
```

### Check Next.js Logs

Watch for:
```
✅ Socket connected
📊 Progress: analyzing - 45%
✅ Scan completed: score 85%
```

## 🎯 How It Works

```
User Upload
   ↓
API saves to DB (status: QUEUED)
   ↓
API adds job to Redis queue
   ↓
API returns immediately (< 100ms)
   ↓
Worker picks up job
   ↓
Worker updates status to PROCESSING
   ↓
Worker calls Claude AI (30-90 seconds)
   ↓
Worker saves results to DB
   ↓
Worker sends Socket.io update
   ↓
UI auto-refreshes & shows toast
```

## 🐛 Troubleshooting

### Redis not running
```bash
pnpm redis:start
# Check it's running
docker ps | grep amz-redis
```

### Worker not processing
```bash
# Make sure Redis is running
docker ps | grep amz-redis

# Check worker logs for errors
# Look for "Worker started successfully!"
```

### No real-time updates
- Check browser console for Socket.io connection
- Socket.io path should be `/api/socket`
- Check for CORS errors

### Jobs stuck in queue
```bash
docker exec amz-redis redis-cli
> LLEN bull:label-scan:waiting
> LPOP bull:label-scan:waiting
```

## 📝 Environment Variables

Make sure your `.env.local` has:

```env
# Existing
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...

# NEW - Add these
REDIS_URL=redis://localhost:6379
SCAN_WORKER_CONCURRENCY=2
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎉 Success Checklist

- [ ] Redis container running (`docker ps | grep amz-redis`)
- [ ] Worker running and showing "✅ Worker started successfully!"
- [ ] Next.js dev server running
- [ ] Created a test scan
- [ ] Scan status changed: QUEUED → PROCESSING → COMPLETED
- [ ] Toast notification appeared
- [ ] Results visible in table

## 📚 Next Steps

- Read `docs/INSTALLATION_QUEUE.md` for production deployment
- Check `docs/QUEUE_SETUP.md` for advanced configuration
- See `docker-compose.queue.yml` for Redis Commander UI

## 🆘 Need Help?

**Check worker logs:**
```bash
# If using pnpm worker
# Look in terminal for errors

# If using PM2 (production)
pm2 logs amz-worker
```

**Check Redis:**
```bash
docker logs amz-redis
```

**Check Next.js:**
- Browser console (F12)
- Check for Socket.io connection errors
- Check Network tab for API calls

---

**Status Colors:**
- 🟢 COMPLETED - Analysis finished
- 🔵 PROCESSING - Worker analyzing (pulsing)
- ⚪ QUEUED - Waiting in queue
- 🔴 FAILED - Analysis error

