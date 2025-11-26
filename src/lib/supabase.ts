import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ReceiptAnalysis {
  id: string;
  receipt_id: string;
  image_url: string | null;
  trust_score: number;
  verdict: 'authentic' | 'suspicious' | 'fraudulent';
  extracted_merchant: string;
  extracted_amount: string;
  extracted_date: string;
  extracted_reference: string;
  extracted_method: string;
  issues: string[];
  recommendation: string;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  created_at: string;
}
