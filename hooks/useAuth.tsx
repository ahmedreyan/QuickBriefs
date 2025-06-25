'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthService, AuthState } from '@/lib/auth';

interface AuthContextType extends AuthState {
  signUp: (data: any) => Promise<any>;
  signIn: (data: any) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (data: any) => Promise<any>;
  updatePassword: (data: any) => Promise<any>;
  refreshSession: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await AuthService.getSession();
        if (error) throw error;
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get session');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle specific events
        if (event === 'SIGNED_IN' && session?.user) {
          // Ensure user profile exists
          const { data: profile } = await AuthService.getUserProfile(session.user.id);
          if (!profile) {
            await AuthService.createUserProfile(session.user.id, session.user.user_metadata);
          }
        }

        if (event === 'SIGNED_OUT') {
          setError(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auto-refresh session
  useEffect(() => {
    if (!session) return;

    const refreshInterval = setInterval(async () => {
      try {
        await AuthService.refreshSession();
      } catch (err) {
        console.error('Failed to refresh session:', err);
      }
    }, 50 * 60 * 1000); // Refresh every 50 minutes

    return () => clearInterval(refreshInterval);
  }, [session]);

  const signUp = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.signUp(data);
      if (result.error) {
        setError(result.error.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.signIn(data);
      if (result.error) {
        setError(result.error.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.signInWithGoogle();
      if (result.error) {
        setError(result.error.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.signOut();
      if (result.error) {
        setError(result.error.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.resetPassword(data);
      if (result.error) {
        setError(result.error.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.updatePassword(data);
      if (result.error) {
        setError(result.error.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const result = await AuthService.refreshSession();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh session');
      throw err;
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}