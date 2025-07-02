import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables - temporarily disabled for development
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please configure your .env file.');
  // For development, we'll create a mock client to prevent crashes
  export const supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else if (supabaseUrl === 'your_supabase_url' || 
           supabaseUrl === 'https://your-project-id.supabase.co' ||
           supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.warn('Please update your Supabase environment variables with actual values from your Supabase project.');
  // For development, we'll create a mock client to prevent crashes
  export const supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}

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