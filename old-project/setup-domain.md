# Custom Domain Setup for productlabelchecker.com

## Steps to Complete:

### 1. Add Domain to Vercel
1. Go to https://vercel.com/dashboard
2. Click on your project: `joyeneghalu-gmailcoms-projects/project`
3. Go to **Settings** → **Domains**
4. Click **"Add Domain"**
5. Enter: `productlabelchecker.com`
6. Click **"Add"**

### 2. Configure DNS Records
Add these DNS records to your domain registrar:

**For productlabelchecker.com:**
- Type: A
- Name: @
- Value: 76.76.19.61

**For www.productlabelchecker.com:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

### 3. Update Vercel Environment Variables
Go to **Settings** → **Environment Variables** and add:
```
NEXTAUTH_URL=https://productlabelchecker.com
```

### 4. Update Google OAuth
1. Go to https://console.cloud.google.com/
2. Go to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Update **Authorized redirect URIs** to:
   - `https://productlabelchecker.com/api/auth/callback/google`

### 5. Update Stripe Webhook
1. Go to https://dashboard.stripe.com/
2. Go to **Developers** → **Webhooks**
3. Edit your webhook endpoint
4. Update **Endpoint URL** to:
   - `https://productlabelchecker.com/api/stripe/webhook`

### 6. Deploy
Run: `npx vercel --prod --yes`

## Your Final URL
Once configured, your app will be available at:
**https://productlabelchecker.com**



