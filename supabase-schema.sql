-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free' CHECK (plan IN ('free', 'deluxe', 'one-time')),
  is_email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table for OAuth providers
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (identifier, token)
);

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  marketplace VARCHAR(255) NOT NULL,
  label_url TEXT,
  results_json JSONB,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  stripe_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create regulatory_rules table
CREATE TABLE IF NOT EXISTS regulatory_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  marketplace VARCHAR(255) NOT NULL,
  requirement TEXT NOT NULL,
  criticality VARCHAR(50) NOT NULL CHECK (criticality IN ('Critical', 'Warning', 'Recommendation')),
  details TEXT,
  suggestion TEXT,
  visual_example TEXT,
  priority VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, marketplace, requirement)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_rules_category ON regulatory_rules(category);
CREATE INDEX IF NOT EXISTS idx_regulatory_rules_marketplace ON regulatory_rules(marketplace);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scans_updated_at BEFORE UPDATE ON scans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regulatory_rules_updated_at BEFORE UPDATE ON regulatory_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for accounts table
CREATE POLICY "Users can view own accounts" ON accounts
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for sessions table
CREATE POLICY "Users can view own sessions" ON sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policies for scans table
CREATE POLICY "Users can view own scans" ON scans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" ON scans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scans" ON scans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans" ON scans
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for payments table
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample regulatory rules
INSERT INTO regulatory_rules (category, marketplace, requirement, criticality, details, suggestion) VALUES
('Toys', 'US', 'Age grading must be clearly visible', 'Critical', 'Age grading helps parents choose appropriate toys for their children', 'Use large, bold text for age grading (e.g., "AGES 3+")'),
('Toys', 'US', 'Choking hazard warning required for small parts', 'Critical', 'Small parts can be a choking hazard for children under 3', 'Include "CHOKING HAZARD - Small parts. Not for children under 3 years."'),
('Toys', 'US', 'CPSC compliance mark required', 'Critical', 'All toys must meet CPSC safety standards', 'Include "Meets CPSC requirements" or similar compliance statement'),
('Baby Products', 'US', 'FDA registration number required', 'Critical', 'Baby products must be registered with FDA', 'Include FDA registration number on packaging'),
('Baby Products', 'US', 'Nutritional information for food products', 'Critical', 'Baby food must include complete nutritional information', 'Follow FDA nutrition labeling requirements'),
('Cosmetics', 'US', 'FDA ingredient list required', 'Critical', 'All cosmetic ingredients must be listed', 'List ingredients in descending order of predominance'),
('Cosmetics', 'US', 'Net weight declaration required', 'Critical', 'Package must show net weight or volume', 'Include net weight in both metric and US units'),
('Toys', 'UK', 'UKCA marking required', 'Critical', 'Products must bear UKCA mark for UK market', 'Include UKCA mark and UK responsible person details'),
('Toys', 'UK', 'Age appropriate warnings in English', 'Critical', 'All warnings must be in English', 'Ensure all safety warnings are in clear English'),
('Toys', 'Germany', 'CE marking required', 'Critical', 'Products must bear CE mark for EU market', 'Include CE mark and EU responsible person details'),
('Toys', 'Germany', 'German language warnings required', 'Critical', 'All warnings must be in German', 'Include German translations of all safety warnings'),
('Baby Products', 'UK', 'UKCA marking for applicable products', 'Critical', 'Certain baby products need UKCA marking', 'Check if your product category requires UKCA marking'),
('Baby Products', 'Germany', 'CE marking for applicable products', 'Critical', 'Certain baby products need CE marking', 'Check if your product category requires CE marking'),
('Cosmetics', 'UK', 'UK responsible person required', 'Critical', 'Cosmetics need UK responsible person', 'Appoint a UK responsible person for cosmetics'),
('Cosmetics', 'Germany', 'EU responsible person required', 'Critical', 'Cosmetics need EU responsible person', 'Appoint an EU responsible person for cosmetics')
ON CONFLICT (category, marketplace, requirement) DO NOTHING;



