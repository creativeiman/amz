# MinIO Integration Guide

## Overview

MinIO is an **S3-compatible object storage** system that runs in Docker. It's used for storing uploaded product label images (JPG, PNG, PDF).

## Benefits

✅ **S3-Compatible** - Easy migration to AWS S3 if needed  
✅ **Open Source** - Free and production-ready  
✅ **Docker-based** - Easy to deploy  
✅ **Self-hosted** - Full control over your data  
✅ **High Performance** - Built in Go for speed  

---

## Quick Start

### 1. Start MinIO
```bash
make minio-start
```

### 2. Initialize Bucket
```bash
cd new-project
pnpm minio:init
```

### 3. Access MinIO Console
- **URL**: http://localhost:9001
- **Username**: `minioadmin`
- **Password**: `minioadmin123`

---

## Environment Variables

Add to `.env.local`:

```env
# MinIO (S3-Compatible Object Storage)
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin123"
MINIO_BUCKET_NAME="product-labels"
MINIO_USE_SSL="false"
```

---

## Architecture

### Upload Flow

```
User uploads file → API receives file → MinIO stores file → Returns URL
                      (scan-sheet.tsx)    (minio-client.ts)
```

### Analysis Flow

```
Worker needs file → Fetches from MinIO → Sends to Claude AI
  (scan-queue.ts)      (minio-client.ts)
```

---

## File Structure

```
src/
├── lib/
│   ├── minio-client.ts      # MinIO SDK wrapper
│   └── file-upload.ts        # File upload utilities (uses MinIO)
├── lib/queue/
│   └── scan-queue.ts         # Worker fetches files from MinIO
scripts/
└── init-minio.ts             # Bucket initialization script
```

---

## API Reference

### `minio-client.ts`

```typescript
// Upload file
const url = await uploadFile(buffer, 'image.jpg', 'image/jpeg')

// Get file
const buffer = await getFile('/uploads/labels/123-image.jpg')

// Get presigned URL (for downloads)
const url = await getPresignedUrl('/uploads/labels/123-image.jpg')

// Delete file
await deleteFile('/uploads/labels/123-image.jpg')

// Health check
const isHealthy = await healthCheck()
```

---

## Makefile Commands

```bash
make minio-start     # Start MinIO
make minio-stop      # Stop MinIO
make minio-logs      # View logs
make minio-restart   # Restart MinIO
```

---

## Production Deployment

### Option 1: Keep MinIO (Self-hosted)

1. Deploy MinIO to your server
2. Update `MINIO_ENDPOINT` in production env
3. Set `MINIO_USE_SSL="true"`
4. Use strong credentials

### Option 2: Migrate to AWS S3

MinIO is S3-compatible, so migration is easy:

1. Install AWS SDK: `pnpm add @aws-sdk/client-s3`
2. Update `minio-client.ts` to use AWS SDK
3. Point to S3 buckets
4. No code changes needed elsewhere!

---

## Troubleshooting

### MinIO not starting

```bash
# Check if container is running
docker ps | grep minio

# Check logs
make minio-logs

# Restart MinIO
make minio-restart
```

### Bucket not created

```bash
# Run initialization script
pnpm minio:init
```

### Connection refused

- Make sure MinIO is running: `make minio-start`
- Check ports 9000 (API) and 9001 (Console) are not in use
- Verify `.env.local` has correct `MINIO_ENDPOINT`

---

## Security Notes

### Development

- Default credentials: `minioadmin` / `minioadmin123`
- Accessible only on localhost
- No SSL (HTTP only)

### Production

- **Change credentials** in environment variables
- **Enable SSL** (`MINIO_USE_SSL="true"`)
- **Use firewall** to restrict access
- **Consider** AWS S3 for better security

---

## Storage Path

Files are stored in MinIO as:

```
Bucket: product-labels
Path: labels/{timestamp}-{filename}
Example: labels/1697456789123-cosmetic-face-mask.png
```

---

## Monitoring

### Check MinIO Status

```bash
# Health check
curl http://localhost:9000/minio/health/live

# List buckets
docker exec amz-minio mc ls local/
```

### View Stored Files

Access MinIO Console: http://localhost:9001

---

## Migration from Local Storage

The old system used `public/uploads/` folder. MinIO replaces this with:

| Old (Local)                     | New (MinIO)                           |
|---------------------------------|---------------------------------------|
| `public/uploads/labels/x.jpg`   | MinIO bucket: `product-labels/labels/x.jpg` |
| Direct file system access       | S3-compatible API                     |
| Not scalable                    | Production-ready                      |

---

## Next Steps

1. ✅ MinIO is running
2. ✅ Bucket created
3. ✅ File upload working
4. ✅ Worker can fetch files
5. 🔄 Test complete upload → analysis flow
6. 📝 Update prod deployment docs

---

## Support

- **MinIO Docs**: https://min.io/docs/
- **Docker Image**: https://hub.docker.com/r/minio/minio
- **S3 API Compatibility**: https://docs.aws.amazon.com/AmazonS3/latest/API/

