/*
  # ConfirmIT Trust Directory - Database Schema

  ## Overview
  Core schema for Nigeria's trust infrastructure platform.
  Businesses register → Get verified → Users search → Find trusted sellers.

  ## Tables
  1. `businesses` - Verified business directory
  2. `reviews` - User reviews and ratings
  3. `categories` - Product/service categories
  4. `verification_requests` - Pending verification submissions

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public can READ verified businesses
  - Only business owners can UPDATE their own records
  - Only admins can APPROVE verifications
*/

-- Enable PostGIS for geo-queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategories TEXT[] DEFAULT '{}',
  
  -- Contact
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  
  -- Location
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  coordinates GEOGRAPHY(POINT, 4326), -- PostGIS for geo-queries
  
  -- Verification & Trust
  verified BOOLEAN DEFAULT FALSE,
  verification_tier INTEGER CHECK (verification_tier IN (1, 2, 3)),
  trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  nft_token_id TEXT,
  
  -- Media
  logo_url TEXT,
  cover_image_url TEXT,
  photos TEXT[] DEFAULT '{}',
  
  -- Business Hours (JSON object)
  business_hours JSONB DEFAULT '{}',
  
  -- Ownership
  owner_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  views INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  direction_clicks INTEGER DEFAULT 0,
  call_clicks INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  transaction_proof_url TEXT, -- Receipt screenshot
  
  -- Business Response
  business_response TEXT,
  responded_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- Lucide icon name (e.g., 'Smartphone', 'Laptop')
  parent_id UUID REFERENCES categories(id),
  order_index INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification Requests Table
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  
  -- Submitted Documents
  cac_document_url TEXT,
  bank_statement_url TEXT,
  address_proof_url TEXT,
  additional_docs TEXT[] DEFAULT '{}',
  
  -- Requested Tier
  requested_tier INTEGER NOT NULL CHECK (requested_tier IN (1, 2, 3)),
  
  -- Review Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'more_info_needed')),
  admin_notes TEXT,
  rejection_reason TEXT,
  
  -- Review Info
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified);
CREATE INDEX IF NOT EXISTS idx_businesses_trust_score ON businesses(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_search ON businesses USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_requests(status);
CREATE INDEX IF NOT EXISTS idx_verification_business ON verification_requests(business_id);

-- Row Level Security (RLS) Policies

-- Businesses: Public can read verified businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view verified businesses"
  ON businesses FOR SELECT
  TO PUBLIC
  USING (verified = TRUE AND status = 'active');

CREATE POLICY "Business owners can view their own businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Business owners can update their own businesses"
  ON businesses FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create businesses"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Reviews: Public can read, authenticated can create
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  TO PUBLIC
  USING (TRUE);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Categories: Public can read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO PUBLIC
  USING (TRUE);

-- Verification Requests: Only business owners and admins
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view their verification requests"
  ON verification_requests FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can create verification requests"
  ON verification_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- Functions for Trust Score Calculation
CREATE OR REPLACE FUNCTION calculate_trust_score(business_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  verification_score INTEGER := 0;
  review_score INTEGER := 0;
  volume_score INTEGER := 0;
  final_score INTEGER := 0;
  avg_rating NUMERIC;
  review_count INTEGER;
  tier INTEGER;
BEGIN
  -- Get business verification tier
  SELECT verification_tier INTO tier
  FROM businesses
  WHERE id = business_id_param;
  
  -- Base score from verification tier
  verification_score := CASE tier
    WHEN 1 THEN 30
    WHEN 2 THEN 50
    WHEN 3 THEN 70
    ELSE 20
  END;
  
  -- Calculate review metrics
  SELECT AVG(rating), COUNT(*) INTO avg_rating, review_count
  FROM reviews
  WHERE business_id = business_id_param;
  
  -- Review quality score (30% weight)
  IF avg_rating IS NOT NULL THEN
    review_score := ROUND((avg_rating / 5.0) * 30);
  END IF;
  
  -- Volume score (10% weight) - cap at 50 reviews
  IF review_count > 0 THEN
    volume_score := ROUND(LEAST(review_count / 50.0, 1.0) * 10);
  END IF;
  
  -- Final score
  final_score := verification_score + review_score + volume_score;
  
  RETURN LEAST(final_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update trust score when reviews change
CREATE OR REPLACE FUNCTION update_business_trust_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses
  SET 
    trust_score = calculate_trust_score(NEW.business_id),
    updated_at = NOW()
  WHERE id = NEW.business_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trust_score
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_business_trust_score();

-- Seed Categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Electronics', 'electronics', 'Smartphone'),
  ('Fashion', 'fashion', 'ShoppingBag'),
  ('Vehicles', 'vehicles', 'Car'),
  ('Real Estate', 'real-estate', 'Home'),
  ('Services', 'services', 'Briefcase'),
  ('Food & Beverages', 'food-beverages', 'UtensilsCrossed'),
  ('Health & Beauty', 'health-beauty', 'Heart'),
  ('Home & Garden', 'home-garden', 'Sofa')
ON CONFLICT (slug) DO NOTHING;
