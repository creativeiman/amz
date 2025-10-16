# Google OAuth & Stripe Webhooks Setup Guide

## 🔐 Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it: `ProductLabelChecker`

### Step 2: Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press **"Enable"**

### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Configure:
   - **Application type**: Web application
   - **Name**: ProductLabelChecker
   - **Authorized redirect URIs**: 
     - `https://www.productlabelchecker.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google`

### Step 4: Get Your Credentials
After creating, copy:
- **Client ID** (starts with `123456789-abc...googleusercontent.com`)
- **Client Secret** (starts with `GOCSPX-abc...`)

---

## 💳 Stripe Setup

### Step 1: Get Stripe API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to **Developers** → **API Keys**
3. Copy:
   - **Publishable key** (starts with `pk_...`)
   - **Secret key** (starts with `sk_...`)

### Step 2: Create Webhook Endpoint
1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Configure:
   - **Endpoint URL**: `https://www.productlabelchecker.com/api/stripe/webhook`
   - **Events to send**:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `customer.subscription.deleted`
4. Click **"Add endpoint"**
5. Copy the **Webhook signing secret** (starts with `whsec_...`)

---

## 🔧 Vercel Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables:

```
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth
NEXTAUTH_URL=https://www.productlabelchecker.com
NEXTAUTH_SECRET=your-random-secret-key-here

# Supabase (if you set it up)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

---

## 🚀 Testing the Integration

### Test Google OAuth
1. Go to `https://www.productlabelchecker.com/auth/signin`
2. Click **"Continue with Google"**
3. Complete Google OAuth flow
4. Should redirect to dashboard

### Test Stripe Payments
1. Go to `https://www.productlabelchecker.com/#pricing`
2. Click **"Choose Deluxe"** or **"Choose One-Time"**
3. Complete Stripe checkout
4. Should redirect to dashboard with updated plan

### Test Webhooks
1. Check Stripe Dashboard → **Webhooks** → **Your endpoint**
2. Look for successful webhook deliveries
3. Check your Vercel logs for webhook processing

---

## ✅ What's Already Configured

- ✅ NextAuth with Google OAuth + Credentials
- ✅ Stripe Checkout Sessions
- ✅ Stripe Webhook Handlers
- ✅ User Plan Management
- ✅ Database Integration (with fallback to mock data)

---

## 🔍 Troubleshooting

### Google OAuth Issues
- Verify redirect URI matches exactly
- Check that Google+ API is enabled
- Ensure environment variables are set correctly

### Stripe Issues
- Verify webhook endpoint URL is correct
- Check webhook secret matches
- Ensure Stripe keys are from the correct environment (test/live)

### Database Issues
- App works with mock data if Supabase not configured
- Check Supabase environment variables if using real database



