# Supported File Types

## Overview

The system handles different file types for product label uploads.

---

## ✅ Supported File Types

### 1. **Images (Recommended)**
- **JPEG/JPG** - Best for photos
- **PNG** - Best for graphics with transparency
- **GIF** - Animated/static images
- **WebP** - Modern format, smaller size

**Display:** Direct image rendering
**AI Analysis:** Claude can analyze images directly
**Storage:** MinIO object storage

---

### 2. **PDF Documents**
- **PDF** - Portable Document Format

**Display:** Embedded PDF viewer (iframe)
**AI Analysis:** Claude can analyze PDFs (extracts images/text)
**Storage:** MinIO object storage
**Note:** Some browsers may not support inline PDF viewing

---

## ❌ NOT Supported (Currently)

### Word Documents
- **.doc** - Microsoft Word (old format)
- **.docx** - Microsoft Word (modern format)

**Why not supported:**
1. Requires conversion to PDF or images
2. Complex formatting makes AI analysis difficult
3. Security concerns with executable macros
4. Browser cannot display natively

**Workaround:** Convert Word to PDF before uploading

---

## File Handling Flow

```
User uploads file
    ↓
Validation (file type & size)
    ↓
MinIO Storage
    ↓
Worker retrieves file
    ↓
Claude AI Analysis
    ↓
Results displayed
```

---

## Display Logic

### Detail Page (`[id]/page.tsx`)

```typescript
{scan.labelUrl.toLowerCase().endsWith('.pdf') ? (
  // PDF Viewer - uses iframe
  <iframe src={`/api${scan.labelUrl}`} />
) : (
  // Image Viewer - uses img tag
  <img src={`/api${scan.labelUrl}`} />
)}
```

---

## File Size Limits

| File Type | Max Size | Reason |
|-----------|----------|--------|
| Images    | 10 MB    | Balance quality vs upload speed |
| PDF       | 10 MB    | Typical label document size |

---

## Adding Support for Word Files (Optional)

If you want to support Word files:

### Option 1: Server-Side Conversion
```bash
# Install LibreOffice for conversion
pnpm add libreoffice-convert

# Convert .docx → PDF on upload
# Then store PDF in MinIO
```

### Option 2: Reject with Better Message
```typescript
// In file-upload.ts validation
if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
  return {
    valid: false,
    error: 'Word files not supported. Please convert to PDF first.'
  }
}
```

### Option 3: Accept but Convert Client-Side
```typescript
// Use mammoth.js to extract text
import mammoth from 'mammoth'

// Convert .docx to HTML
const result = await mammoth.convertToHtml({
  arrayBuffer: await file.arrayBuffer()
})
```

---

## Claude AI Compatibility

| File Type | Claude Support | Notes |
|-----------|----------------|-------|
| JPEG/PNG  | ✅ Direct      | Best results |
| PDF       | ✅ Extract     | Claude extracts images & text |
| GIF       | ✅ Direct      | First frame analyzed |
| Word      | ❌ No          | Must convert to PDF/image first |

---

## Current Implementation

### File Validation

```typescript
// src/lib/file-upload.ts
allowedTypes = [
  "image/jpeg",
  "image/jpg", 
  "image/png",
  "application/pdf"  // PDF supported!
]
```

### Upload Form

```typescript
// src/app/dashboard/scans/scan-sheet.tsx
accept="image/jpeg,image/png,image/jpg,application/pdf"
```

### Display Component

```typescript
// src/app/dashboard/scans/[id]/page.tsx
- Images: <img> tag
- PDFs: <iframe> tag
```

---

## Best Practices

### For Users
1. ✅ **Prefer images** (JPEG/PNG) for best results
2. ✅ **Use PDF** for multi-page documents
3. ❌ **Avoid Word files** - convert to PDF first
4. 📏 **Keep files under 10MB**
5. 📸 **High resolution** for better OCR accuracy

### For Developers
1. ✅ Validate file type before upload
2. ✅ Check file size (prevent large uploads)
3. ✅ Display appropriate viewer based on file type
4. ✅ Handle errors gracefully
5. ✅ Test with different file formats

---

## Troubleshooting

### Image won't display
- ✅ Check MinIO is running: `make minio-logs`
- ✅ Verify file uploaded: MinIO Console (http://localhost:9001)
- ✅ Check API route: `/api/uploads/[...path]`

### PDF won't display
- ✅ Browser may block iframe
- ✅ Try downloading instead (Download button)
- ✅ Check browser console for errors

### File upload fails
- ✅ Check file size < 10MB
- ✅ Verify file type is allowed
- ✅ Check MinIO connection

---

## Future Enhancements

1. **Add more image formats**
   - BMP, TIFF, SVG support

2. **Better PDF viewer**
   - Use react-pdf or pdf.js
   - Add zoom, pagination controls

3. **Word file support**
   - Server-side conversion to PDF
   - Client-side mammoth.js preview

4. **Image optimization**
   - Compress before upload
   - Generate thumbnails

5. **Drag & drop improvements**
   - Multi-file upload
   - Progress indicators

