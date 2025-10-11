# Supabase Admin Dashboard Setup

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## How to Get Your Supabase Keys

1. **Go to your Supabase project dashboard**
2. **Click on "Settings" → "API"**
3. **Copy the following:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`

## Database Setup

Make sure you have run the SQL setup script in your Supabase SQL editor:

```sql
-- Create users table in Supabase
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'deluxe', 'one-time')),
  is_email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own data
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Create a policy that allows users to update their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create a policy that allows public registration (for signup)
CREATE POLICY "Allow public registration" ON users
  FOR INSERT WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Admin Dashboard Access

1. **Go to**: https://your-domain.com/admin/login
2. **Login with**: 
   - Email: `admin@productlabelchecker.com`
   - Password: `admin123`

## What You'll See

The admin dashboard will now show:
- **Real user count** from your Supabase database
- **Plan distribution** (Free, Deluxe, One-Time users)
- **Revenue calculations** based on actual user plans
- **Growth metrics** calculated from user signup dates
- **Real-time alerts** about system status

## Testing

1. **Create a test user** through your signup flow
2. **Check the admin dashboard** - you should see the user count increase
3. **Verify plan distribution** shows the correct user plan
4. **Check revenue metrics** reflect actual paid users

## Troubleshooting

If the admin dashboard shows errors:
1. **Check environment variables** are correctly set
2. **Verify Supabase connection** in your project settings
3. **Check database permissions** for the service role key
4. **Ensure the users table exists** with the correct structure



