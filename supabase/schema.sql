-- Bhavana Studio Database Schema
-- Run this in your Supabase SQL Editor

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  bride_name TEXT,
  groom_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Library
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  default_price NUMERIC NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packages
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  service_ids UUID[] DEFAULT '{}',
  terms TEXT,
  deliverables TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  contract_number TEXT,
  event_date DATE,
  reception_date DATE,
  venue TEXT,
  event_time TEXT,
  subtotal NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  discount_type TEXT DEFAULT 'amount',
  gst_enabled BOOLEAN DEFAULT FALSE,
  gst_percent NUMERIC DEFAULT 18,
  advance NUMERIC DEFAULT 0,
  balance NUMERIC DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  sections JSONB DEFAULT '{}',
  album_details TEXT,
  terms TEXT,
  deliverables TEXT,
  payment_schedule JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contract Services (line items)
CREATE TABLE IF NOT EXISTS contract_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  description TEXT DEFAULT '',
  enabled BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Terms Templates
CREATE TABLE IF NOT EXISTS terms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Terms Templates
CREATE TABLE IF NOT EXISTS payment_terms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes Templates
CREATE TABLE IF NOT EXISTS notes_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App Settings (singleton)
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_config JSONB DEFAULT '{}',
  default_terms TEXT,
  default_deliverables TEXT,
  default_gst_percent NUMERIC DEFAULT 18,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_client ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_event_date ON contracts(event_date);
CREATE INDEX IF NOT EXISTS idx_contract_services_contract ON contract_services(contract_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (enable when auth is configured)
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
-- etc.
