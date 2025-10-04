# Supabase Setup Guide

This guide will help you set up Supabase for the Amazon Label Compliance Checker application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub, Google, or email
4. Click "New Project"
5. Choose your organization
6. Enter project details:
   - **Name**: `label-compliance-checker`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
7. Click "Create new project"
8. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## Step 3: Set Up the Database

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase-setup.sql` from this project
4. Click "Run" to execute the SQL
5. This will create the `users` table with proper security policies

## Step 4: Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

## Step 5: Deploy to Vercel

1. Push your code to GitHub
2. In Vercel, go to your project settings
3. Go to **Environment Variables**
4. Add the same environment variables from Step 4
5. Redeploy your application

## Step 6: Test the Integration

1. Go to your deployed application
2. Try to sign up with a new account
3. Check your Supabase dashboard → **Table Editor** → **users**
4. You should see the new user record

## Database Schema

The `users` table includes:
- `id`: UUID primary key
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `plan`: User's subscription plan (free, deluxe, one-time)
- `is_email_verified`: Email verification status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

## Security Features

- **Row Level Security (RLS)** enabled
- Users can only read/update their own data
- Public registration allowed for signup
- Automatic timestamp updates
- Indexed email field for fast lookups

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check that your environment variables are correct
2. **"Table doesn't exist"**: Make sure you ran the SQL setup script
3. **"Permission denied"**: Check your RLS policies in Supabase
4. **"Connection failed"**: Verify your Supabase URL is correct

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Discord](https://discord.supabase.com)
- Check the application logs in Vercel

## Next Steps

Once Supabase is set up, you can:
1. Add more user fields (phone, address, etc.)
2. Implement email verification
3. Add user roles and permissions
4. Set up real-time subscriptions
5. Add file storage for user uploads
