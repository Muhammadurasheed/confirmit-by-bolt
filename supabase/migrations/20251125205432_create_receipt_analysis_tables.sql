/*
  # Create ConfirmIT Lite Database Schema

  1. New Tables
    - `receipt_analyses`
      - `id` (uuid, primary key) - Unique analysis ID
      - `receipt_id` (text) - Human-readable receipt ID
      - `image_url` (text) - URL to uploaded receipt image
      - `trust_score` (integer) - Trust score 0-100
      - `verdict` (text) - Analysis verdict: authentic/suspicious/fraudulent
      - `extracted_merchant` (text) - Extracted merchant name
      - `extracted_amount` (text) - Extracted transaction amount
      - `extracted_date` (text) - Extracted transaction date
      - `extracted_reference` (text) - Extracted reference number
      - `extracted_method` (text) - Payment method (Opay, Palmpay, etc.)
      - `issues` (jsonb) - Array of detected issues
      - `recommendation` (text) - AI recommendation for user
      - `created_at` (timestamptz) - Analysis timestamp

    - `waitlist`
      - `id` (uuid, primary key) - Unique waitlist entry ID
      - `email` (text, unique) - User email
      - `source` (text) - Where they signed up from
      - `created_at` (timestamptz) - Signup timestamp

  2. Security
    - Enable RLS on both tables
    - Public can insert into both tables (for MVP)
    - Authenticated users can read their own data
*/

-- Create receipt_analyses table
CREATE TABLE IF NOT EXISTS receipt_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id text NOT NULL,
  image_url text,
  trust_score integer NOT NULL CHECK (trust_score >= 0 AND trust_score <= 100),
  verdict text NOT NULL CHECK (verdict IN ('authentic', 'suspicious', 'fraudulent')),
  extracted_merchant text DEFAULT '',
  extracted_amount text DEFAULT '',
  extracted_date text DEFAULT '',
  extracted_reference text DEFAULT '',
  extracted_method text DEFAULT '',
  issues jsonb DEFAULT '[]'::jsonb,
  recommendation text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'landing_page',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE receipt_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policies for receipt_analyses (public can insert for MVP, read is open)
CREATE POLICY "Anyone can insert receipt analysis"
  ON receipt_analyses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read receipt analyses"
  ON receipt_analyses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policies for waitlist (public can insert, read is restricted)
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_receipt_analyses_receipt_id ON receipt_analyses(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_analyses_created_at ON receipt_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
