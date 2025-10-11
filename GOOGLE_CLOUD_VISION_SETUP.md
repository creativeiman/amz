# Google Cloud Vision API Setup Guide

## 🔑 Environment Variables for Vercel

Add these environment variables to your Vercel project:

### **Step 1: Go to Vercel Dashboard**
1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar

### **Step 2: Add Each Environment Variable**

Add these **exactly** as shown (copy and paste each one):

```bash
GOOGLE_CLOUD_PROJECT_ID=amazon-compliance-checker
```

```bash
GOOGLE_CLOUD_PRIVATE_KEY_ID=35a51098a745499bf2c8cab60ba4597d1eed64fb
```

```bash
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC82Zw8OJ1QNIOZ\n6Ne7OLGZw3x1jKXzFfQiVZ/MTjPpGJSjT0aOJ7m5uiOroqQ+LAVpx7j6xYez9Goj\ne02mFlet7q+KgHXodaPZcUzmaO5uJhQjiMJ6Z93j3phpSkjhM7FlV4SlnZ0HZSVC\nGetAj4ey361X76D5rk4fP0SF+E6Ani7lbO0LIvd8rsXeoqFFYCXP8EhMs0lSP94N\nnnDoPBv3Y8eKGedpqCa/wciZgy1IQS+rwqjRl06bL/wLxZy6ul2TwNSLbHHewkLJ\nfoqzvU4vcHtB+wORrgPc10ni49uopMv0ZncbXSvyD2E3Nw47RCWTwCEJNYnSfzCg\nSd0wf6UtAgMBAAECggEALQHjxUps24eYcZ7Xg0wwr4eyasV5a2SpCWHEsslUf9IW\n4pDrLMf08HmXNLmPUS3moF40DLf07oNqpEgnqlSa0t4Wwfh5oUwgH5tsC2GoqWGz\n3QAj8U49yKftRPKqSdmrBo8EEwBsQy3s4kMRGRLb8VpzkoiOodLT1YibiR4zf11K\nx5zpr348nbOZuewCg72HNYNCWbu2JlrljUK+7a95q46uU05QQ08MB/N4Qc43yVKs\nE02iq68GyqHSmGVCYGhJgRZgHc4awxWYhKutdZvAwoh8ZkXqwQcPbQ0y4SpwsFSC\njgldWqkC3FT9Z8pp3VcUoDmpRNYRmNtPrsCHSZK7oQKBgQDkldXnkL8TAnmIIzef\nONqE81+/bcq9lg3ZbnIPkLhl3PaTfPxTyEUa5H5u5/0R9VcxZMKLSFNO1Eol2zaZ\nP8O/bkmkwDsBnuwrnj3yCQx7gbQd+GtuWQeBaBIvj33etiPtVpV/RY6aMKoQMXlN\nA2w9L1oiIZdh+O4QDpIwWKtYWQKBgQDTf8x/f0aZ6z+PXRRtZJ5+RwMKG7tTshTx\ndXzrRocMk/A+4qur1CR+0WuzKd64J1uFtfN6mFVQ3YXRkGUj332TruZwz6Gatqj5\ne1UEO0hLyCcl9Sl8wGGptYSK55xO0hBRv9PUex0JnK8X8EoPsutD6Rsd5AGjPLrM\nhMxogqHY9QKBgFN/+HdyhJnpGYQFeVgMaKaQULWY4aqHmd+HXNsavoFXSituSK5C\nRhwgw56319YrjQJaEEbY0LXHDp7tiPBKPrM7EmPAZM2exB7a2z4C2DB1nNol2Pii\nRP+ciKge/pfQaSdVrZ6kRgdFJ5pquCjNy0g+d+pn4ujDChOLfxNyEIVhAoGBANHK\nwx71MSMcpz+eJNUeKdk4t1sfhwHOc9fPosn+e5eOZ5D5ZzBajpj9QsfFkJc68x3/\nDjVdRcOg+UyW3rxmxDnqE8tzKeo9pf9Sx1IbO+tv7uVH+o80havB0me2tuW4mVd9\n4LG0LWmLcmNchxprb9M9Nxi/QqCZbPHSCLDiY4jBAoGBANldxnQ3IYt9A5m+KC+V\nO9jYiFFTi7nKrnigQMLrLaJI69amZfenH745Kc/e2N1QBPr7qpXwEPWE6zJAI/zV\n+aRy6HIyKQ9Li3QgIkrlaQ2eTyLTbbKkgseJBScuamEN/bG/nJzZqOuQaW3MDMyP\nEe/JPFsNy5C/HSXVvq6scIVe\n-----END PRIVATE KEY-----\n"
```

```bash
GOOGLE_CLOUD_CLIENT_EMAIL=label-checker@amazon-compliance-checker.iam.gserviceaccount.com
```

```bash
GOOGLE_CLOUD_CLIENT_ID=101447071190344741736
```

```bash
GOOGLE_CLOUD_AUTH_URI=https://accounts.google.com/o/oauth2/auth
```

```bash
GOOGLE_CLOUD_TOKEN_URI=https://oauth2.googleapis.com/token
```

```bash
GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
```

```bash
GOOGLE_CLOUD_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/label-checker%40amazon-compliance-checker.iam.gserviceaccount.com
```

```bash
GOOGLE_CLOUD_UNIVERSE_DOMAIN=googleapis.com
```

### **Step 3: Environment Settings**

For each environment variable:
- ✅ **Production**: Yes
- ✅ **Preview**: Yes  
- ✅ **Development**: Yes

### **Step 4: Deploy**

After adding all environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger a new deployment

## 🧪 Testing the OCR

Once deployed, test the OCR functionality:
1. Go to your dashboard
2. Click "New Scan"
3. Upload a label image
4. The OCR should now work with Google Cloud Vision API

## 🔧 Troubleshooting

### **If OCR still fails:**
1. Check that all environment variables are added correctly
2. Ensure the private key includes the `\n` characters
3. Verify the project ID matches your Google Cloud project
4. Check Vercel deployment logs for any errors

### **Common Issues:**
- **Private Key Format**: Must include `\n` characters for line breaks
- **Quotes**: Private key must be wrapped in double quotes
- **Environment**: Must be added to all environments (Production, Preview, Development)

## 📋 Summary

You need to add **10 environment variables** to Vercel:
1. `GOOGLE_CLOUD_PROJECT_ID`
2. `GOOGLE_CLOUD_PRIVATE_KEY_ID`
3. `GOOGLE_CLOUD_PRIVATE_KEY`
4. `GOOGLE_CLOUD_CLIENT_EMAIL`
5. `GOOGLE_CLOUD_CLIENT_ID`
6. `GOOGLE_CLOUD_AUTH_URI`
7. `GOOGLE_CLOUD_TOKEN_URI`
8. `GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL`
9. `GOOGLE_CLOUD_CLIENT_X509_CERT_URL`
10. `GOOGLE_CLOUD_UNIVERSE_DOMAIN`

After adding these and redeploying, your OCR functionality will work with real Google Cloud Vision API! 🎉