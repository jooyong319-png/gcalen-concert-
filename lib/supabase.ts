import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 환경변수 없으면 null 반환 (개발 중·미설정 시 우아하게 처리)
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

export function isSupabaseReady(): boolean {
  return supabase !== null;
}
