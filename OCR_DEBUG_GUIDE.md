# OCR Debug Guide - Label Processing Fix

## 🔧 **Debugging Steps Completed:**

### **1. ✅ Enhanced Error Handling**
- **Lazy Client Initialization**: Google Cloud Vision client now initializes only when needed
- **Environment Variable Validation**: Checks for all required Google Cloud credentials
- **Specific Error Messages**: Clear error codes for different failure types
- **Fallback Mechanism**: Backup OCR when Google Cloud Vision fails

### **2. ✅ Improved OCR Service (`lib/ocr-service.ts`)**
```typescript
// Before: Client initialized at module load (could fail silently)
const client = new ImageAnnotatorClient({...})

// After: Lazy initialization with error handling
function initializeClient() {
  if (!GOOGLE_CLOUD_PROJECT_ID || !GOOGLE_CLOUD_PRIVATE_KEY || !GOOGLE_CLOUD_CLIENT_EMAIL) {
    throw new Error('Missing required Google Cloud Vision environment variables')
  }
  // ... proper initialization
}
```

### **3. ✅ Enhanced API Error Handling (`/api/scan/ocr/route.ts`)**
- **Specific Error Codes**: CONFIG_ERROR, AUTH_ERROR, QUOTA_ERROR, OCR_ERROR
- **Fallback OCR**: Uses backup method when primary fails
- **Detailed Logging**: Better error tracking and debugging

### **4. ✅ Test Endpoint (`/api/test-ocr`)**
- **Environment Check**: Verifies all Google Cloud variables are present
- **API Test**: Tests Google Cloud Vision with a simple image
- **Debug Information**: Returns detailed status and error information

## 🧪 **Testing the Fix:**

### **Step 1: Test Environment Variables**
Visit: `https://your-domain.vercel.app/api/test-ocr`

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Google Cloud Vision API is working",
  "envCheck": {
    "GOOGLE_CLOUD_PROJECT_ID": true,
    "GOOGLE_CLOUD_PRIVATE_KEY": true,
    "GOOGLE_CLOUD_CLIENT_EMAIL": true,
    "GOOGLE_CLOUD_CLIENT_ID": true,
    "GOOGLE_CLOUD_PRIVATE_KEY_ID": true
  }
}
```

**Expected Response (Failure):**
```json
{
  "success": false,
  "error": "Missing environment variables",
  "missing": ["GOOGLE_CLOUD_PROJECT_ID", "GOOGLE_CLOUD_PRIVATE_KEY"],
  "envCheck": {...}
}
```

### **Step 2: Test Label Upload**
1. Go to dashboard → "New Scan"
2. Upload a clear label image
3. Select category and marketplace
4. Click "Scan Label"

**Expected Behavior:**
- ✅ **Success**: Shows scan results with extracted text and compliance analysis
- ⚠️ **Fallback**: Shows "OCR service temporarily unavailable" message
- ❌ **Error**: Shows specific error message with error code

## 🔍 **Common Issues & Solutions:**

### **Issue 1: "Missing environment variables"**
**Solution**: Check Vercel environment variables
```bash
# Required variables in Vercel:
GOOGLE_CLOUD_PROJECT_ID=amazon-compliance-checker
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_CLOUD_CLIENT_EMAIL=label-checker@amazon-compliance-checker.iam.gserviceaccount.com
GOOGLE_CLOUD_CLIENT_ID=101447071190344741736
GOOGLE_CLOUD_PRIVATE_KEY_ID=35a51098a745499bf2c8cab60ba4597d1eed64fb
```

### **Issue 2: "Authentication failed"**
**Solution**: Verify Google Cloud credentials
- Check if service account key is valid
- Ensure private key includes `\n` characters
- Verify project ID matches your Google Cloud project

### **Issue 3: "Quota exceeded"**
**Solution**: Check Google Cloud billing and quotas
- Enable billing on Google Cloud project
- Check Vision API quotas in Google Cloud Console
- Wait for quota reset (usually 24 hours)

### **Issue 4: "OCR processing failed"**
**Solution**: Check image format and size
- Use supported formats: JPG, PNG, GIF, BMP, WEBP
- Keep file size under 10MB
- Ensure image is clear and readable

## 🚀 **Deployment Verification:**

### **Check 1: Environment Variables**
```bash
# In Vercel dashboard:
# Settings → Environment Variables
# Verify all 5 Google Cloud variables are present
```

### **Check 2: API Test**
```bash
# Test the OCR endpoint
curl https://your-domain.vercel.app/api/test-ocr
```

### **Check 3: Full Flow Test**
1. Upload a test label image
2. Check browser console for errors
3. Verify scan results are generated

## 📊 **Error Codes Reference:**

| Code | Meaning | Solution |
|------|---------|----------|
| `CONFIG_ERROR` | Missing environment variables | Add Google Cloud credentials to Vercel |
| `AUTH_ERROR` | Invalid credentials | Check service account key format |
| `QUOTA_ERROR` | API quota exceeded | Check Google Cloud billing/quota |
| `OCR_ERROR` | Text extraction failed | Try different image or check format |
| `UNKNOWN_ERROR` | Unexpected error | Check server logs for details |

## 🎯 **Expected Results:**

### **✅ Success Case:**
- Label uploads successfully
- Text is extracted from image
- Compliance analysis runs
- Results page shows detailed report
- "Detailed Report" button works

### **⚠️ Fallback Case:**
- Shows "OCR service temporarily unavailable" message
- Still provides basic compliance analysis
- User can retry with different image

### **❌ Error Case:**
- Shows specific error message
- Provides error code for debugging
- Suggests next steps to user

## 🔧 **Next Steps if Still Failing:**

1. **Check Vercel Logs**: Go to Vercel dashboard → Functions → View logs
2. **Test Environment**: Use `/api/test-ocr` endpoint
3. **Verify Credentials**: Double-check Google Cloud service account
4. **Check Billing**: Ensure Google Cloud project has billing enabled
5. **Contact Support**: If all else fails, check Google Cloud support

The OCR system is now much more robust with proper error handling and fallback mechanisms! 🚀



