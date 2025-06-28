import { supabase } from './supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { EmailValidationService, RateLimiter } from './email-validation';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  username?: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordUpdateData {
  password: string;
  confirmPassword: string;
}

export class AuthService {
  // Enhanced sign up with email validation
  static async signUp({ email, password, username, fullName }: SignUpData) {
    try {
      // Validate email
      const emailValidation = EmailValidationService.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.errors[0]);
      }

      // Check rate limiting
      if (!RateLimiter.canAttempt(email)) {
        const remainingTime = Math.ceil(RateLimiter.getRemainingTime(email) / 1000);
        throw new Error(`Too many attempts. Please wait ${remainingTime} seconds.`);
      }

      // Validate password strength
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error('Password does not meet security requirements');
      }

      const { data, error } = await supabase.auth.signUp({
        email: EmailValidationService.normalizeEmail(email),
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Create user profile
      if (data.user) {
        await this.createUserProfile(data.user.id, {
          username,
          full_name: fullName,
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  // Enhanced sign in with rate limiting
  static async signIn({ email, password }: SignInData) {
    try {
      const normalizedEmail = EmailValidationService.normalizeEmail(email);

      // Check rate limiting
      if (!RateLimiter.canAttempt(normalizedEmail)) {
        const remainingTime = Math.ceil(RateLimiter.getRemainingTime(normalizedEmail) / 1000);
        throw new Error(`Too many login attempts. Please wait ${remainingTime} seconds.`);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  // Enhanced Google OAuth with security checks
  static async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  // Sign out with cleanup
  static async signOut() {
    try {
      // Clear any stored session data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  }

  // Enhanced password reset with validation
  static async resetPassword({ email }: PasswordResetData) {
    try {
      const emailValidation = EmailValidationService.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.errors[0]);
      }

      const normalizedEmail = EmailValidationService.normalizeEmail(email);

      const { data, error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : undefined,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  // Enhanced password update with validation
  static async updatePassword({ password }: { password: string }) {
    try {
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error('Password does not meet security requirements');
      }

      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  // Get current session
  static async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: { session: null }, error: error as AuthError };
    }
  }

  // Get current user
  static async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  // Refresh session
  static async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  }

  // Create user profile with enhanced data
  static async createUserProfile(userId: string, metadata: any) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userId,
            username: metadata.username,
            full_name: metadata.full_name,
            credits_used: 0,
            credits_total: 3,
            subscription_status: 'free',
            last_reset: new Date().toDateString(),
          },
        ]);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user profile
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Enhanced password validation
  static validatePassword(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('One special character');

    // Additional security checks
    if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
    else feedback.push('Avoid repeated characters');

    // Common password patterns
    const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
    if (!commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      score += 1;
    } else {
      feedback.push('Avoid common password patterns');
    }

    return {
      isValid: score >= 6,
      score,
      feedback,
    };
  }

  // Validate email
  static validateEmail(email: string): boolean {
    return EmailValidationService.validateEmail(email).isValid;
  }

  // Validate username
  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  // Check for suspicious login activity
  static detectSuspiciousActivity(email: string): boolean {
    const attempts = RateLimiter.getAttemptCount(email);
    return attempts >= 2; // Flag after 2 attempts
  }
}

// Enhanced Rate limiting utility with more sophisticated tracking
export { RateLimiter } from './email-validation';