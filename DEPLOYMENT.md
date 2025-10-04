# 🚀 Deployment Guide - Amazon Label Compliance Checker

This guide will walk you through deploying your application to production and making it live.

## 📋 Pre-Deployment Checklist

### 1. Complete Core Features
- [ ] File upload and OCR integration
- [ ] Compliance rules engine
- [ ] Payment processing
- [ ] Results page with scoring
- [ ] Email notifications

### 2. Set Up External Services
- [ ] Database (PostgreSQL)
- [ ] Authentication (Google OAuth)
- [ ] Payments (Stripe)
- [ ] OCR (Google Cloud Vision)
- [ ] AI (OpenAI)
- [ ] Email (SendGrid/Resend)

### 3. Security & Performance
- [ ] Environment variables secured
- [ ] SSL certificates
- [ ] CDN setup
- [ ] Error monitoring
- [ ] Analytics tracking

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Perfect for Next.js applications
- Automatic deployments from GitHub
- Built-in CDN and edge functions
- Easy environment variable management
- Free tier available

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/amazon-compliance-checker.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Configure build settings (auto-detected for Next.js)

3. **Set Environment Variables**
   ```env
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   OPENAI_API_KEY=sk-...
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

### Option 2: Railway

**Why Railway?**
- Great for full-stack apps
- Built-in PostgreSQL
- Easy environment management
- Good pricing

**Steps:**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy**
   ```bash
   railway init
   railway up
   ```

3. **Add Database**
   ```bash
   railway add postgresql
   railway run npx prisma db push
   ```

### Option 3: DigitalOcean App Platform

**Why DigitalOcean?**
- Good performance
- Reasonable pricing
- Full control
- Good for scaling

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended for Vercel)

1. **In Vercel Dashboard:**
   - Go to Storage tab
   - Create Postgres database
   - Copy connection string

2. **Update Environment Variables:**
   ```env
   DATABASE_URL=postgres://...
   ```

3. **Run Migrations:**
   ```bash
   npx prisma db push
   ```

### Option 2: Supabase (Free Tier Available)

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy connection string

2. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

3. **Deploy Schema:**
   ```bash
   npx prisma db push
   ```

### Option 3: PlanetScale (MySQL)

1. **Create Database:**
   - Go to [planetscale.com](https://planetscale.com)
   - Create database
   - Get connection string

2. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

## 🔐 External Services Setup

### 1. Google OAuth Setup

1. **Go to Google Cloud Console:**
   - [console.cloud.google.com](https://console.cloud.google.com)

2. **Create OAuth 2.0 Credentials:**
   - APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)

3. **Get Credentials:**
   - Copy Client ID and Client Secret
   - Add to environment variables

### 2. Stripe Setup

1. **Create Stripe Account:**
   - Go to [stripe.com](https://stripe.com)
   - Complete account setup
   - Switch to live mode

2. **Get API Keys:**
   - Dashboard > Developers > API Keys
   - Copy Publishable Key and Secret Key

3. **Set Up Webhooks:**
   - Webhooks > Add endpoint
   - URL: `https://your-domain.com/api/payments/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`

4. **Create Products:**
   - Products > Add Product
   - Basic Plan: $19 one-time
   - Professional Plan: $49/month
   - Enterprise Plan: $199/month

### 3. Google Cloud Vision API

1. **Enable Vision API:**
   - Google Cloud Console > APIs & Services > Library
   - Search "Vision API" > Enable

2. **Create Service Account:**
   - IAM & Admin > Service Accounts
   - Create service account
   - Download JSON key file

3. **Set Environment Variables:**
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_KEY_FILE=path/to/key.json
   ```

### 4. OpenAI Setup

1. **Create OpenAI Account:**
   - Go to [platform.openai.com](https://platform.openai.com)

2. **Get API Key:**
   - API Keys > Create new secret key
   - Copy key to environment variables

3. **Set Usage Limits:**
   - Set monthly spending limits
   - Monitor usage in dashboard

### 5. Email Service (SendGrid)

1. **Create SendGrid Account:**
   - Go to [sendgrid.com](https://sendgrid.com)

2. **Get API Key:**
   - Settings > API Keys
   - Create API key with full access

3. **Verify Sender:**
   - Sender Authentication > Single Sender
   - Verify your email address

## 🔧 Production Configuration

### 1. Update Next.js Config

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'img.icons8.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    // ... other env vars
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### 2. Add Error Monitoring

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### 3. Add Analytics

```bash
npm install @vercel/analytics
```

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🚀 Go-Live Checklist

### Pre-Launch
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] External services configured
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Error monitoring active
- [ ] Analytics tracking enabled

### Testing
- [ ] User registration works
- [ ] Authentication flows work
- [ ] File upload works
- [ ] Payment processing works
- [ ] Email notifications work
- [ ] Mobile responsiveness tested
- [ ] Performance tested (Lighthouse > 90)

### Launch Day
- [ ] Deploy to production
- [ ] Test all critical flows
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Announce launch

## 📊 Post-Launch Monitoring

### 1. Set Up Monitoring

```bash
# Install monitoring tools
npm install @vercel/analytics @sentry/nextjs
```

### 2. Key Metrics to Track

- **User Metrics:**
  - Daily/Monthly Active Users
  - Sign-up conversion rate
  - User retention

- **Business Metrics:**
  - Revenue (MRR)
  - Customer acquisition cost
  - Churn rate

- **Technical Metrics:**
  - Page load times
  - API response times
  - Error rates
  - Uptime

### 3. Set Up Alerts

- High error rates (>5%)
- Slow response times (>2s)
- Payment failures
- Database connection issues

## 🔄 Continuous Deployment

### 1. GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx prisma db push
```

### 2. Branch Strategy

- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches

## 🎯 Marketing & Launch

### 1. Pre-Launch Marketing

- **Content Marketing:**
  - Blog posts about compliance
  - Case studies
  - YouTube tutorials

- **Social Media:**
  - Twitter/X announcements
  - LinkedIn posts
  - Facebook groups

- **Community:**
  - Amazon seller forums
  - Reddit r/FulfillmentByAmazon
  - Discord communities

### 2. Launch Strategy

- **Soft Launch:**
  - Beta testing with 50 users
  - Gather feedback
  - Fix critical issues

- **Public Launch:**
  - Product Hunt launch
  - Press release
  - Social media campaign

- **Growth Phase:**
  - SEO optimization
  - Paid advertising
  - Partnership outreach

## 📞 Support Setup

### 1. Help Center

- Create help documentation
- FAQ section
- Video tutorials
- Contact form

### 2. Customer Support

- Email: support@labelcompliance.com
- Live chat (Intercom/Crisp)
- Discord community
- Status page

## 🎉 Success Metrics

### Month 1 Goals
- 200+ sign-ups
- 50+ paid conversions
- 500+ scans completed
- 4.5+ NPS score

### Month 3 Goals
- 1,000+ sign-ups
- 200+ paid conversions
- $5,000+ MRR
- 85%+ retention rate

### Month 6 Goals
- 5,000+ sign-ups
- 1,000+ paid conversions
- $25,000+ MRR
- Product-market fit

---

**Ready to go live? Let's make it happen! 🚀**
