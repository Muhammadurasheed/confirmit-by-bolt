import { supabase } from './supabase';

export async function saveReceiptAnalysis(analysis: {
  receiptId: string;
  imageUrl?: string;
  trustScore: number;
  verdict: 'authentic' | 'suspicious' | 'fraudulent';
  extracted: {
    merchant: string;
    amount: string;
    date: string;
    reference: string;
    method: string;
  };
  issues: string[];
  recommendation: string;
}) {
  const { data, error } = await supabase
    .from('receipt_analyses')
    .insert({
      receipt_id: analysis.receiptId,
      image_url: analysis.imageUrl,
      trust_score: analysis.trustScore,
      verdict: analysis.verdict,
      extracted_merchant: analysis.extracted.merchant,
      extracted_amount: analysis.extracted.amount,
      extracted_date: analysis.extracted.date,
      extracted_reference: analysis.extracted.reference,
      extracted_method: analysis.extracted.method,
      issues: analysis.issues,
      recommendation: analysis.recommendation,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving receipt analysis:', error);
    throw error;
  }

  return data;
}

export async function joinWaitlist(email: string, source: string = 'landing_page') {
  const { data, error } = await supabase
    .from('waitlist')
    .insert({
      email,
      source,
    })
    .select()
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Email already registered');
    }
    console.error('Error joining waitlist:', error);
    throw error;
  }

  return data;
}

export async function getRecentAnalyses(limit: number = 10) {
  const { data, error } = await supabase
    .from('receipt_analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching analyses:', error);
    throw error;
  }

  return data;
}

export async function getAnalysisById(receiptId: string) {
  const { data, error } = await supabase
    .from('receipt_analyses')
    .select('*')
    .eq('receipt_id', receiptId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }

  return data;
}

export async function getWaitlistCount() {
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching waitlist count:', error);
    return 0;
  }

  return count || 0;
}
