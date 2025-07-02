import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create supabase client with proper fallback handling
let supabaseClient;

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_url' || 
    supabaseUrl === 'https://your-project-id.supabase.co' ||
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  
  console.warn('Supabase environment variables are not properly configured. Using placeholder client for development.');
  // Create a placeholder client that won't crash the app
  supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;

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