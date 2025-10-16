# 🚀 Quick Start Guide - ProductLabelChecker

Get your ProductLabelChecker application up and running with real user authentication in 5 minutes!

## ⚡ Quick Setup (5 minutes)

### 1. Set Up Supabase (2 minutes)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project called "productlabelchecker"
3. Copy your project URL and API keys from Settings → API

### 2. Configure Environment Variables (1 minute)
In your Vercel dashboard, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set Up Database (1 minute)
1. In Supabase, go to SQL Editor
2. Copy and paste the entire content from `supabase-schema.sql`
3. Click "Run" to create all tables

### 4. Deploy (1 minute)
```bash
npx vercel --prod --yes
```

## ✅ That's It!

Your application is now ready for real users with:
- ✅ User registration and authentication
- ✅ Secure password hashing
- ✅ Google OAuth (if configured)
- ✅ User data persistence
- ✅ Production-ready database

## 🔧 Optional: Google OAuth Setup

If you want Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://www.productlabelchecker.com/api/auth/callback/google`
4. Add these environment variables to Vercel:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## 🧪 Test Your Setup

Run this command to verify everything is working:
```bash
npm run test:supabase
```

## 📚 Need More Help?

- **Detailed Setup**: See `SUPABASE_SETUP.md`
- **Google OAuth**: See `GOOGLE_OAUTH_SETUP.md`
- **Stripe Setup**: See `STRIPE_SETUP.md`

## 🎉 You're Ready!

Visit [https://www.productlabelchecker.com](https://www.productlabelchecker.com) to see your live application!

---

**Need help?** Check the troubleshooting section in `SUPABASE_SETUP.md` or create an issue in your repository.