# 🚀 Supabase Setup Guide for ProductLabelChecker

This guide will help you set up Supabase for your production-ready ProductLabelChecker application.

## 📋 Prerequisites

- A Supabase account (free at [supabase.com](https://supabase.com))
- Your project deployed on Vercel

## 🔧 Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign up or log in to your account
   - Click "New Project"

2. **Configure Your Project**
   - **Name**: `productlabelchecker` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Start with the free plan

3. **Wait for Setup**
   - Supabase will take 1-2 minutes to set up your project
   - You'll be redirected to the project dashboard when ready

## 🗄️ Step 2: Set Up Database Schema

1. **Go to SQL Editor**
   - In your Supabase dashboard, click "SQL Editor" in the left sidebar
   - Click "New Query"

2. **Run the Schema Script**
   - Copy the entire content from `supabase-schema.sql` file
   - Paste it into the SQL editor
   - Click "Run" to execute the script

3. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `users`
     - `accounts`
     - `sessions`
     - `verification_tokens`
     - `scans`
     - `payments`
     - `regulatory_rules`

## 🔐 Step 3: Configure Authentication

1. **Go to Authentication Settings**
   - Click "Authentication" in the left sidebar
   - Click "Settings" tab

2. **Configure Site URL**
   - **Site URL**: `https://www.productlabelchecker.com`
   - **Redirect URLs**: Add these URLs:
     - `https://www.productlabelchecker.com/api/auth/callback/google`
     - `https://www.productlabelchecker.com/api/auth/callback/credentials`
     - `https://www.productlabelchecker.com/dashboard`

3. **Enable Email Authentication**
   - In "Auth Providers" section
   - Make sure "Email" is enabled
   - Configure email templates if needed

4. **Configure Google OAuth** (if using Google sign-in)
   - Enable "Google" provider
   - Add your Google OAuth credentials:
     - **Client ID**: Your Google OAuth Client ID
     - **Client Secret**: Your Google OAuth Client Secret

## 🔑 Step 4: Get API Keys

1. **Go to Settings**
   - Click "Settings" in the left sidebar
   - Click "API" tab

2. **Copy Required Keys**
   - **Project URL**: Copy this (you'll need it for `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public key**: Copy this (you'll need it for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role secret key**: Copy this (you'll need it for `SUPABASE_SERVICE_ROLE_KEY`)

## ⚙️ Step 5: Configure Environment Variables

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Go to your project dashboard
   - Click "Settings" tab
   - Click "Environment Variables"

2. **Add Supabase Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Verify Other Environment Variables**
   Make sure these are also set:
   ```
   NEXTAUTH_URL=https://www.productlabelchecker.com
   NEXTAUTH_SECRET=your-nextauth-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   ```

## 🚀 Step 6: Deploy and Test

1. **Redeploy Your Application**
   ```bash
   npx vercel --prod --yes
   ```

2. **Test User Registration**
   - Go to `https://www.productlabelchecker.com/auth/signup`
   - Create a new account
   - Verify you're redirected to the dashboard

3. **Test User Sign-in**
   - Go to `https://www.productlabelchecker.com/auth/signin`
   - Sign in with your created account
   - Verify you're redirected to the dashboard

4. **Test Google OAuth** (if configured)
   - Try signing in with Google
   - Verify the account is created and you're redirected to dashboard

## 🔍 Step 7: Verify Database

1. **Check User Creation**
   - Go to Supabase Dashboard → Table Editor → users
   - Verify your test user appears in the table

2. **Check Authentication**
   - Go to Supabase Dashboard → Authentication → Users
   - Verify your user appears in the auth users table

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**
   - Check that your environment variables are correctly set
   - Verify the Supabase URL and keys are correct

2. **"User already exists"**
   - This is normal behavior - the user already exists in the database
   - Try signing in instead of creating a new account

3. **Google OAuth not working**
   - Verify Google OAuth credentials are correct
   - Check that redirect URIs are properly configured in Google Console

4. **Database connection errors**
   - Verify all Supabase environment variables are set
   - Check that the database schema was created successfully

### Getting Help:

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **NextAuth Docs**: [next-auth.js.org](https://next-auth.js.org)

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Authentication configured
- [ ] Environment variables set
- [ ] Application redeployed
- [ ] User registration working
- [ ] User sign-in working
- [ ] Google OAuth working (if configured)
- [ ] Users visible in Supabase dashboard

## 🎉 You're Ready!

Once all steps are completed, your ProductLabelChecker application will be fully production-ready with:

- ✅ Real user registration and authentication
- ✅ Secure password hashing
- ✅ Google OAuth integration
- ✅ User data persistence
- ✅ Row-level security
- ✅ Scalable database architecture

Your application is now ready for real users! 🚀