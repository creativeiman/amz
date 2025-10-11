-- Create payments table in Supabase
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('deluxe', 'one-time')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Create an index on stripe_id for Stripe integration
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_id);

-- Enable Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own payments
CREATE POLICY "Users can read their own payments" ON payments
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create a policy that allows service role to insert payments (for webhooks)
CREATE POLICY "Service role can insert payments" ON payments
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows service role to update payments
CREATE POLICY "Service role can update payments" ON payments
  FOR UPDATE WITH CHECK (true);

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



