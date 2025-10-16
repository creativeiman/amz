# Admin Dashboard Setup Guide

## 🔧 Current Issue
The admin dashboard is not showing real user data from Supabase. This guide will help you configure the environment variables to connect the admin dashboard to your Supabase database.

## 🚀 Step 1: Get Your Supabase Credentials

### 1. Go to Your Supabase Project
- Visit: https://supabase.com/dashboard
- Select your project

### 2. Get API Keys
- Go to **Settings** → **API**
- Copy these values:
  - **Project URL** (starts with `https://`)
  - **anon public key** (starts with `eyJ...`)
  - **service_role secret key** (starts with `eyJ...`)

## 🔧 Step 2: Configure Vercel Environment Variables

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: `joyeneghalu-gmailcoms-projects/project`
- Go to **Settings** → **Environment Variables**

### 2. Add Supabase Environment Variables
Click **"Add New"** and add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Verify Other Environment Variables
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

## 🧪 Step 3: Test Supabase Connection

### 1. Test API Endpoint
Visit: `https://www.productlabelchecker.com/api/admin/test-supabase`

This will show you:
- Whether Supabase is configured
- How many users are in your database
- User details (email, plan, created_at)

### 2. Check Admin Dashboard
Visit: `https://www.productlabelchecker.com/admin/dashboard`

You should now see:
- Real user count from Supabase
- Plan distribution (free, deluxe, one-time)
- Revenue calculations based on actual users
- Real growth metrics

## 📊 What You'll See After Setup

### ✅ Real User Data:
- **Total Users**: Actual count from Supabase
- **Plan Distribution**: Real counts of free/deluxe/one-time users
- **Revenue**: Calculated from actual paid users
- **Growth Metrics**: Real signup dates and growth rates

### ✅ Admin Dashboard Features:
- **Live Statistics**: Real-time user and revenue data
- **Plan Analytics**: Visual breakdown of user plans
- **Growth Tracking**: Month-over-month user growth
- **Revenue Tracking**: MRR and total revenue calculations

## 🔍 Troubleshooting

### If Admin Dashboard Shows 0 Users:

1. **Check Environment Variables**
   - Verify all Supabase variables are set in Vercel
   - Make sure there are no typos in the variable names

2. **Test Supabase Connection**
   - Visit `/api/admin/test-supabase` to see if connection works
   - Check Vercel function logs for error messages

3. **Verify Database**
   - Go to Supabase dashboard → Table Editor
   - Check if users table has data
   - Verify the table structure matches expected schema

### Common Issues:

1. **"Supabase not configured"**
   - Missing environment variables in Vercel
   - Check variable names are exactly correct

2. **"Failed to fetch users"**
   - Supabase credentials are incorrect
   - Database permissions issue
   - Check service role key has correct permissions

3. **"0 users found"**
   - Database is empty
   - Wrong table name or structure
   - Check Supabase table editor

## 📈 Expected Results

### With Your Current Users:
- **Total Users**: Should show 2+ users (free + deluxe)
- **Plan Distribution**: 
  - Free: 1 user
  - Deluxe: 1 user  
  - One-Time: 0 users
- **Revenue**: $29.99/month (1 deluxe user × $29.99)
- **Growth**: Real signup dates and growth rates

### Admin Dashboard Will Show:
- **User Metrics**: Real user counts and growth
- **Revenue Metrics**: Actual MRR and total revenue
- **Plan Distribution**: Visual breakdown of user plans
- **Growth Analytics**: Real month-over-month growth
- **Real-time Updates**: Data refreshes when you click refresh

## 🎯 Next Steps

1. **Configure Environment Variables** in Vercel
2. **Test Supabase Connection** using the test endpoint
3. **Verify Admin Dashboard** shows real data
4. **Monitor User Growth** as new users sign up
5. **Track Revenue** as users upgrade to paid plans

The admin dashboard will then show real data from your Supabase database, including the new deluxe user! 🎉📊✨



