-- Forward OS Initial Schema Migration
-- Database: PostgreSQL 14+
-- Date: 2024-06-09

-- ==================== ENABLE EXTENSIONS ====================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "hstore";

-- ==================== ENUMS ====================

CREATE TYPE user_type AS ENUM ('seller', 'broker');
CREATE TYPE kyc_document_type AS ENUM ('id_photo', 'proof_of_address', 'business_verification', 'broker_license', 'eo_insurance');
CREATE TYPE kyc_verification_status AS ENUM ('pending', 'verified', 'rejected', 'manual_review');
CREATE TYPE consent_status AS ENUM ('pending', 'approved', 'rejected', 'revoked');
CREATE TYPE listing_status AS ENUM ('draft', 'pending_verification', 'live', 'closed', 'delisted');
CREATE TYPE commission_status AS ENUM ('pending_deal', 'earned', 'payment_processed', 'paid');
CREATE TYPE ingestion_event_type AS ENUM (
  'wizard_started',
  'wizard_step_completed',
  'kyc_document_uploaded',
  'kyc_verification_completed',
  'consent_requested',
  'consent_approved',
  'listing_created',
  'listing_published',
  'commission_earned',
  'commission_paid'
);

-- ==================== SELLER_IDENTITY ====================

CREATE TABLE seller_identity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  company_name VARCHAR(255),
  date_of_birth DATE,
  citizenship VARCHAR(2),
  residence_country VARCHAR(2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP
);

CREATE INDEX idx_seller_email ON seller_identity(email);
CREATE INDEX idx_seller_phone ON seller_identity(phone_number);

-- ==================== BROKER_IDENTITY ====================

CREATE TABLE broker_identity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(50) NOT NULL UNIQUE,
  license_state VARCHAR(2),
  license_type VARCHAR(50) NOT NULL,
  years_in_business INTEGER,
  license_verification_status kyc_verification_status DEFAULT 'pending',
  license_verification_date TIMESTAMP,
  license_expiry_date DATE,
  eo_insurance_provider VARCHAR(255),
  eo_insurance_policy_number VARCHAR(50),
  eo_insurance_amount DECIMAL(15, 2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_broker_email ON broker_identity(email);
CREATE INDEX idx_broker_license ON broker_identity(license_number);

-- ==================== BUSINESS ====================

CREATE TABLE business (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES seller_identity(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES broker_identity(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  website VARCHAR(255),
  primary_location VARCHAR(255) NOT NULL,
  operating_countries VARCHAR(20)[],
  year_founded INTEGER NOT NULL,
  years_in_operation INTEGER,
  team_size INTEGER NOT NULL,
  why_selling_reason TEXT NOT NULL,
  ideal_buyer_profile TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_seller ON business(seller_id);
CREATE INDEX idx_business_broker ON business(broker_id);
CREATE INDEX idx_business_name ON business USING gin(business_name gin_trgm_ops);
CREATE INDEX idx_business_type ON business(business_type);

-- ==================== FINANCIAL_METRICS ====================

CREATE TABLE financial_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL UNIQUE REFERENCES business(id) ON DELETE CASCADE,
  annual_revenue DECIMAL(15, 2) NOT NULL,
  annual_revenue_verified BOOLEAN DEFAULT FALSE,
  revenue_verification_method VARCHAR(50),
  valuation DECIMAL(15, 2) NOT NULL,
  valuation_method VARCHAR(50),
  yoy_growth_rate DECIMAL(5, 2) NOT NULL,
  growth_rate_3year DECIMAL(5, 2),
  ebitda DECIMAL(15, 2),
  net_profit DECIMAL(15, 2),
  monthly_recurring_revenue DECIMAL(15, 2),
  customer_count INTEGER,
  churn_rate DECIMAL(5, 2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reporting_period VARCHAR(20)
);

CREATE INDEX idx_financial_business ON financial_metrics(business_id);

-- ==================== KYC_DOCUMENTS ====================

CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  user_type user_type NOT NULL,
  document_type kyc_document_type NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_format VARCHAR(10) NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  storage_provider VARCHAR(50) NOT NULL,
  verification_status kyc_verification_status DEFAULT 'pending',
  ai_verification_score INTEGER DEFAULT 0,
  ai_verification_details JSONB DEFAULT '{}',
  manual_review_required BOOLEAN DEFAULT FALSE,
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  expires_at TIMESTAMP,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kyc_user ON kyc_documents(user_id, user_type);
CREATE INDEX idx_kyc_status ON kyc_documents(verification_status);
CREATE INDEX idx_kyc_uploaded ON kyc_documents(uploaded_at);

-- ==================== LISTING ====================

CREATE TABLE listing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES seller_identity(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES broker_identity(id) ON DELETE SET NULL,
  business_id UUID NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  status listing_status DEFAULT 'draft',
  published_at TIMESTAMP,
  closed_at TIMESTAMP,
  is_visible BOOLEAN DEFAULT FALSE,
  visibility_start_date TIMESTAMP,
  visibility_end_date TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP,
  published_by UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listing_seller ON listing(seller_id);
CREATE INDEX idx_listing_broker ON listing(broker_id);
CREATE INDEX idx_listing_business ON listing(business_id);
CREATE INDEX idx_listing_status ON listing(status);
CREATE INDEX idx_listing_visible ON listing(is_visible, visibility_end_date);

-- ==================== LISTING_PHOTOS ====================

CREATE TABLE listing_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  display_order INTEGER NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listing_photos ON listing_photos(listing_id, display_order);

-- ==================== CONSENT_RECORD ====================

CREATE TABLE consent_record (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID NOT NULL REFERENCES broker_identity(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES seller_identity(id) ON DELETE CASCADE,
  listing_ids UUID[] NOT NULL,
  status consent_status DEFAULT 'pending',
  consent_given_at TIMESTAMP,
  consent_verification_method VARCHAR(50) NOT NULL,
  consent_proof JSONB DEFAULT '{}',
  broker_commission_percentage DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
  broker_company_name VARCHAR(255) NOT NULL,
  broker_license_number VARCHAR(50) NOT NULL,
  revoked_at TIMESTAMP,
  revocation_reason TEXT,
  revoked_by_user_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consent_broker ON consent_record(broker_id);
CREATE INDEX idx_consent_seller ON consent_record(seller_id);
CREATE INDEX idx_consent_status ON consent_record(status);

-- ==================== BROKER_LISTING_RELATIONSHIP ====================

CREATE TABLE broker_listing_relationship (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID NOT NULL REFERENCES broker_identity(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES seller_identity(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  consent_status consent_status DEFAULT 'pending',
  consent_given_at TIMESTAMP,
  consent_verification_method VARCHAR(50),
  consent_proof JSONB DEFAULT '{}',
  permissions JSONB DEFAULT '{
    "canEditListing": true,
    "canViewAnalytics": true,
    "canViewBuyerInquiries": true,
    "canSendMessages": true,
    "canModifyPrice": false,
    "canCloseOrDelete": false
  }',
  commission_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.0100,
  commission_status commission_status DEFAULT 'pending_deal',
  revoked_at TIMESTAMP,
  revoked_by_user_id UUID,
  revocation_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_broker_listing ON broker_listing_relationship(broker_id, listing_id);
CREATE INDEX idx_seller_listing ON broker_listing_relationship(seller_id, listing_id);

-- ==================== COMMISSION_RECORD ====================

CREATE TABLE commission_record (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id UUID NOT NULL REFERENCES broker_identity(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES seller_identity(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  deal_id UUID,
  deal_value DECIMAL(15, 2) NOT NULL,
  deal_closure_date TIMESTAMP,
  deal_verification_status VARCHAR(50) DEFAULT 'pending',
  commission_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.0100,
  commission_amount DECIMAL(15, 2) NOT NULL,
  commission_status commission_status DEFAULT 'pending_deal',
  payment_schedule VARCHAR(20) DEFAULT 'net_30',
  payment_date TIMESTAMP,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(255),
  payment_verification_url VARCHAR(500),
  broker_notes TEXT,
  forward_os_notes TEXT,
  verified_by UUID,
  verified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_commission_broker ON commission_record(broker_id);
CREATE INDEX idx_commission_seller ON commission_record(seller_id);
CREATE INDEX idx_commission_status ON commission_record(commission_status);
CREATE INDEX idx_commission_deal ON commission_record(deal_id);

-- ==================== COMPLIANCE_AUDIT_LOG (Immutable) ====================

CREATE TABLE compliance_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id UUID NOT NULL,
  user_type user_type NOT NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID NOT NULL,
  change_before JSONB,
  change_after JSONB,
  reason TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  verified BOOLEAN DEFAULT FALSE,
  signature VARCHAR(255)
);

CREATE INDEX idx_audit_timestamp ON compliance_audit_log(timestamp DESC);
CREATE INDEX idx_audit_user ON compliance_audit_log(user_id);
CREATE INDEX idx_audit_action ON compliance_audit_log(action);
CREATE INDEX idx_audit_resource ON compliance_audit_log(resource_type, resource_id);

-- ==================== SELLER_WIZARD_SESSION ====================

CREATE TABLE seller_wizard_session (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token VARCHAR(255) NOT NULL UNIQUE,
  user_type user_type NOT NULL,
  current_step VARCHAR(100) NOT NULL,
  completed_steps TEXT[] DEFAULT '{}',
  form_data JSONB DEFAULT '{}',
  submission_status VARCHAR(50) DEFAULT 'in_progress',
  submission_timestamp TIMESTAMP,
  errors JSONB DEFAULT '[]',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_session_token ON seller_wizard_session(session_token);
CREATE INDEX idx_session_expires ON seller_wizard_session(expires_at);

-- ==================== INGESTION_PIPELINE_EVENT ====================

CREATE TABLE ingestion_pipeline_event (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type ingestion_event_type NOT NULL,
  user_id UUID NOT NULL,
  user_type user_type NOT NULL,
  resource_id UUID,
  data JSONB DEFAULT '{}',
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_type ON ingestion_pipeline_event(event_type);
CREATE INDEX idx_event_user ON ingestion_pipeline_event(user_id);
CREATE INDEX idx_event_processed ON ingestion_pipeline_event(processed, timestamp);
CREATE INDEX idx_event_timestamp ON ingestion_pipeline_event(timestamp DESC);

-- ==================== FUNCTIONS & TRIGGERS ====================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_seller_identity_timestamp BEFORE UPDATE ON seller_identity
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_identity_timestamp BEFORE UPDATE ON broker_identity
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_timestamp BEFORE UPDATE ON business
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_metrics_timestamp BEFORE UPDATE ON financial_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listing_timestamp BEFORE UPDATE ON listing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_timestamp BEFORE UPDATE ON kyc_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commission calculation function
CREATE OR REPLACE FUNCTION calculate_commission(deal_value DECIMAL, commission_rate DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(deal_value * commission_rate, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==================== GRANTS (FOR APPLICATION USER) ====================

-- Create application role
CREATE ROLE forward_os_app WITH PASSWORD 'set_strong_password';
GRANT CONNECT ON DATABASE forward_os TO forward_os_app;
GRANT USAGE ON SCHEMA public TO forward_os_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO forward_os_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO forward_os_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO forward_os_app;

-- ==================== VIEWS ====================

-- Broker Dashboard View
CREATE VIEW broker_dashboard AS
SELECT
  b.id as broker_id,
  b.company_name,
  b.license_number,
  COUNT(DISTINCT blr.listing_id) as active_listings,
  COUNT(DISTINCT CASE WHEN cr.deal_id IS NOT NULL THEN cr.id END) as closed_deals,
  COALESCE(SUM(cr.commission_amount), 0) as total_commission_earned,
  COALESCE(SUM(CASE WHEN cr.commission_status = 'paid' THEN cr.commission_amount ELSE 0 END), 0) as paid_commissions,
  COALESCE(SUM(CASE WHEN cr.commission_status IN ('earned', 'payment_processed') THEN cr.commission_amount ELSE 0 END), 0) as pending_commissions
FROM broker_identity b
LEFT JOIN broker_listing_relationship blr ON b.id = blr.broker_id
LEFT JOIN commission_record cr ON b.id = cr.broker_id
GROUP BY b.id, b.company_name, b.license_number;

-- Listing Analytics View
CREATE VIEW listing_analytics AS
SELECT
  l.id as listing_id,
  l.seller_id,
  l.broker_id,
  b.business_name,
  l.view_count,
  l.inquiry_count,
  l.favorite_count,
  CASE WHEN l.view_count > 0 THEN ROUND((l.inquiry_count::DECIMAL / l.view_count) * 100, 2) ELSE 0 END as inquiry_rate_percent,
  l.status,
  l.created_at,
  l.visibility_end_date
FROM listing l
LEFT JOIN business b ON l.business_id = b.id
WHERE l.is_visible = TRUE;

-- Commission Tracking View
CREATE VIEW commission_tracking AS
SELECT
  cr.id,
  cr.broker_id,
  b.company_name as broker_company,
  cr.seller_id,
  s.first_name || ' ' || s.last_name as seller_name,
  cr.listing_id,
  biz.business_name,
  cr.deal_value,
  cr.commission_rate,
  cr.commission_amount,
  cr.commission_status,
  cr.payment_date,
  cr.deal_closure_date,
  CASE
    WHEN cr.commission_status = 'paid' THEN 'Complete'
    WHEN cr.commission_status = 'payment_processed' THEN 'In Transit'
    WHEN cr.commission_status = 'earned' THEN 'Scheduled'
    ELSE 'Pending Deal'
  END as payment_status
FROM commission_record cr
LEFT JOIN broker_identity b ON cr.broker_id = b.id
LEFT JOIN seller_identity s ON cr.seller_id = s.id
LEFT JOIN business biz ON cr.listing_id = biz.id
ORDER BY cr.created_at DESC;

-- ==================== CLEANUP ====================

-- Commented out for safety - uncomment in separate migration if needed
-- DROP INDEX IF EXISTS idx_seller_email CASCADE;
-- etc...

-- ==================== END MIGRATION ====================
