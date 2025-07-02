import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_url' || 
    supabaseUrl === 'https://your-project-id.supabase.co' ||
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  throw new Error(
    'Missing or invalid Supabase environment variables. Please check your .env file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set with valid values.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      briefs: {
        Row: {
          id: string;
          user_id: string;
          input_url: string | null;
          input_type: 'url' | 'youtube' | 'upload';
          summary_mode: 'business' | 'student' | 'genZ';
          summary_text: string;
          word_count: number;
          processing_time: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          input_url?: string | null;
          input_type: 'url' | 'youtube' | 'upload';
          summary_mode: 'business' | 'student' | 'genZ';
          summary_text: string;
          word_count?: number;
          processing_time?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          input_url?: string | null;
          input_type?: 'url' | 'youtube' | 'upload';
          summary_mode?: 'business' | 'student' | 'genZ';
          summary_text?: string;
          word_count?: number;
          processing_time?: number;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          credits_used: number;
          credits_total: number;
          subscription_status: 'free' | 'pro' | 'team' | 'enterprise';
          subscription_id: string | null;
          last_reset: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          credits_used?: number;
          credits_total?: number;
          subscription_status?: 'free' | 'pro' | 'team' | 'enterprise';
          subscription_id?: string | null;
          last_reset?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          credits_used?: number;
          credits_total?: number;
          subscription_status?: 'free' | 'pro' | 'team' | 'enterprise';
          subscription_id?: string | null;
          last_reset?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};