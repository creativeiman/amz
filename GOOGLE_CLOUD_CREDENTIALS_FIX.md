# Google Cloud Vision API Credentials Fix

## 🚨 **Current Issue:**
The OCR is failing with error: `"error:1E08010C:DECODER routines::unsupported"`

This indicates that the Google Cloud Vision API private key format is incorrect.

## 🔧 **Root Cause:**
The private key in Vercel environment variables is not properly formatted with line breaks.

## ✅ **Solution:**

### **Step 1: Fix Private Key Format in Vercel**

Go to Vercel Dashboard → Project Settings → Environment Variables

**Current (Incorrect):**
```
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC82Zw8OJ1QNIOZ\n6Ne7OLGZw3x1jKXzFfQiVZ/MTjPpGJSjT0aOJ7m5uiOroqQ+LAVpx7j6xYez9Goj\ne02mFlet7q+KgHXodaPZcUzmaO5uJhQjiMJ6Z93j3phpSkjhM7FlV4SlnZ0HZSVC\nGetAj4ey361X76D5rk4fP0SF+E6Ani7lbO0LIvd8rsXeoqFFYCXP8EhMs0lSP94N\nnnDoPBv3Y8eKGedpqCa/wciZgy1IQS+rwqjRl06bL/wLxZy6ul2TwNSLbHHewkLJ\nfoqzvU4vcHtB+wORrgPc10ni49uopMv0ZncbXSvyD2E3Nw47RCWTwCEJNYnSfzCg\nSd0wf6UtAgMBAAECggEALQHjxUps24eYcZ7Xg0wwr4eyasV5a2SpCWHEsslUf9IW\n4pDrLMf08HmXNLmPUS3moF40DLf07oNqpEgnqlSa0t4Wwfh5oUwgH5tsC2GoqWGz\n3QAj8U49yKftRPKqSdmrBo8EEwBsQy3s4kMRGRLb8VpzkoiOodLT1YibiR4zf11K\nx5zpr348nbOZuewCg72HNYNCWbu2JlrljUK+7a95q46uU05QQ08MB/N4Qc43yVKs\nE02iq68GyqHSmGVCYGhJgRZgHc4awxWYhKutdZvAwoh8ZkXqwQcPbQ0y4SpwsFSC\njgldWqkC3FT9Z8pp3VcUoDmpRNYRmNtPrsCHSZK7oQKBgQDkldXnkL8TAnmIIzef\nONqE81+/bcq9lg3ZbnIPkLhl3PaTfPxTyEUa5H5u5/0R9VcxZMKLSFNO1Eol2zaZ\nP8O/bkmkwDsBnuwrnj3yCQx7gbQd+GtuWQeBaBIvj33etiPtVpV/RY6aMKoQMXlN\nA2w9L1oiIZdh+O4QDpIwWKtYWQKBgQDTf8x/f0aZ6z+PXRRtZJ5+RwMKG7tTshTx\ndXzrRocMk/A+4qur1CR+0WuzKd64J1uFtfN6mFVQ3YXRkGUj332TruZwz6Gatqj5\ne1UEO0hLyCcl9Sl8wGGptYSK55xO0hBRv9PUex0JnK8X8EoPsutD6Rsd5AGjPLrM\nhMxogqHY9QKBgFN/+HdyhJnpGYQFeVgMaKaQULWY4aqHmd+HXNsavoFXSituSK5C\nRhwgw56319YrjQJaEEbY0LXHDp7tiPBKPrM7EmPAZM2exB7a2z4C2DB1nNol2Pii\nRP+ciKge/pfQaSdVrZ6kRgdFJ5pquCjNy0g+d+pn4ujDChOLfxNyEIVhAoGBANHK\nwx71MSMcpz+eJNUeKdk4t1sfhwHOc9fPosn+e5eOZ5D5ZzBajpj9QsfFkJc68x3/\nDjVdRcOg+UyW3rxmxDnqE8tzKeo9pf9Sx1IbO+tv7uVH+o80havB0me2tuW4mVd9\n4LG0LWmLcmNchxprb9M9Nxi/QqCZbPHSCLDiY4jBAoGBANldxnQ3IYt9A5m+KC+V\nO9jYiFFTi7nKrnigQMLrLaJI69amZfenH745Kc/e2N1QBPr7qpXwEPWE6zJAI/zV\n+aRy6HIyKQ9Li3QgIkrlaQ2eTyLTbbKkgseJBScuamEN/bG/nJzZqOuQaW3MDMyP\nEe/JPFsNy5C/HSXVvq6scIVe\n-----END PRIVATE KEY-----\n"
```

**Fixed (Correct):**
```
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC82Zw8OJ1QNIOZ
6Ne7OLGZw3x1jKXzFfQiVZ/MTjPpGJSjT0aOJ7m5uiOroqQ+LAVpx7j6xYez9Goj
e02mFlet7q+KgHXodaPZcUzmaO5uJhQjiMJ6Z93j3phpSkjhM7FlV4SlnZ0HZSVC
GetAj4ey361X76D5rk4fP0SF+E6Ani7lbO0LIvd8rsXeoqFFYCXP8EhMs0lSP94N
nnDoPBv3Y8eKGedpqCa/wciZgy1IQS+rwqjRl06bL/wLxZy6ul2TwNSLbHHewkLJ
foqzvU4vcHtB+wORrgPc10ni49uopMv0ZncbXSvyD2E3Nw47RCWTwCEJNYnSfzCg
Sd0wf6UtAgMBAAECggEALQHjxUps24eYcZ7Xg0wwr4eyasV5a2SpCWHEsslUf9IW
4pDrLMf08HmXNLmPUS3moF40DLf07oNqpEgnqlSa0t4Wwfh5oUwgH5tsC2GoqWGz
3QAj8U49yKftRPKqSdmrBo8EEwBsQy3s4kMRGRLb8VpzkoiOodLT1YibiR4zf11K
x5zpr348nbOZuewCg72HNYNCWbu2JlrljUK+7a95q46uU05QQ08MB/N4Qc43yVKs
E02iq68GyqHSmGVCYGhJgRZgHc4awxWYhKutdZvAwoh8ZkXqwQcPbQ0y4SpwsFSC
jgldWqkC3FT9Z8pp3VcUoDmpRNYRmNtPrsCHSZK7oQKBgQDkldXnkL8TAnmIIzef
ONqE81+/bcq9lg3ZbnIPkLhl3PaTfPxTyEUa5H5u5/0R9VcxZMKLSFNO1Eol2zaZ
P8O/bkmkwDsBnuwrnj3yCQx7gbQd+GtuWQeBaBIvj33etiPtVpV/RY6aMKoQMXlN
A2w9L1oiIZdh+O4QDpIwWKtYWQKBgQDTf8x/f0aZ6z+PXRRtZJ5+RwMKG7tTshTx
dXzrRocMk/A+4qur1CR+0WuzKd64J1uFtfN6mFVQ3YXRkGUj332TruZwz6Gatqj5
e1UEO0hLyCcl9Sl8wGGptYSK55xO0hBRv9PUex0JnK8X8EoPsutD6Rsd5AGjPLrM
hMxogqHY9QKBgFN/+HdyhJnpGYQFeVgMaKaQULWY4aqHmd+HXNsavoFXSituSK5C
Rhwgw56319YrjQJaEEbY0LXHDp7tiPBKPrM7EmPAZM2exB7a2z4C2DB1nNol2Pii
RP+ciKge/pfQaSdVrZ6kRgdFJ5pquCjNy0g+d+pn4ujDChOLfxNyEIVhAoGBANHK
wx71MSMcpz+eJNUeKdk4t1sfhwHOc9fPosn+e5eOZ5D5ZzBajpj9QsfFkJc68x3/
DjVdRcOg+UyW3rxmxDnqE8tzKeo9pf9Sx1IbO+tv7uVH+o80havB0me2tuW4mVd9
4LG0LWmLcmNchxprb9M9Nxi/QqCZbPHSCLDiY4jBAoGBANldxnQ3IYt9A5m+KC+V
O9jYiFFTi7nKrnigQMLrLaJI69amZfenH745Kc/e2N1QBPr7qpXwEPWE6zJAI/zV
+aRy6HIyKQ9Li3QgIkrlaQ2eTyLTbbKkgseJBScuamEN/bG/nJzZqOuQaW3MDMyP
Ee/JPFsNy5C/HSXVvq6scIVe
-----END PRIVATE KEY-----"
```

### **Step 2: Update All Environment Variables**

Make sure these are set in Vercel:

1. **GOOGLE_CLOUD_PROJECT_ID**: `amazon-compliance-checker`
2. **GOOGLE_CLOUD_PRIVATE_KEY**: (Fixed format above)
3. **GOOGLE_CLOUD_CLIENT_EMAIL**: `label-checker@amazon-compliance-checker.iam.gserviceaccount.com`
4. **GOOGLE_CLOUD_CLIENT_ID**: `101447071190344741736`
5. **GOOGLE_CLOUD_PRIVATE_KEY_ID**: `35a51098a745499bf2c8cab60ba4597d1eed64fb`

### **Step 3: Test the Fix**

After updating the environment variables:

1. **Redeploy**: The changes will take effect on next deployment
2. **Test**: Visit `https://www.productlabelchecker.com/api/test-ocr`
3. **Expected**: Should return success with OCR working

### **Step 4: Test Label Upload**

1. Go to `https://www.productlabelchecker.com`
2. Sign in to dashboard
3. Click "New Scan"
4. Upload a label image
5. Should now work without errors

## 🎯 **Expected Results:**

### **✅ Success Response:**
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
  },
  "testResult": {
    "text": "",
    "confidence": 0,
    "wordCount": 0,
    "lineCount": 0
  }
}
```

### **❌ Still Failing:**
If it still fails, the issue might be:
1. **Billing**: Google Cloud project needs billing enabled
2. **API**: Vision API needs to be enabled
3. **Permissions**: Service account needs proper permissions

## 🔧 **Alternative Solution:**

If the private key format is still causing issues, we can use a different approach:

1. **Use JSON Credentials**: Instead of individual environment variables
2. **Use Application Default Credentials**: For serverless environments
3. **Use a different OCR service**: As a fallback

The key issue is that the private key must have actual line breaks, not `\n` characters.



