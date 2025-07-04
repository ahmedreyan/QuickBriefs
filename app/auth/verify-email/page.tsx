'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Mail, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { user, signOut } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    setResendLoading(true);
    try {
      // In a real implementation, you would call a resend verification email function
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Verification email sent!');
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      toast.error('Failed to resend email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <span className="text-2xl font-bold">QuickBriefs</span>
            </Link>
          </motion.div>

          {/* Verify Email Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Mail className="w-12 h-12 text-blue-500" />
                </div>
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <p className="text-muted-foreground">
                  We've sent a verification link to {user?.email || 'your email address'}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email to verify your account. If you don't see it, 
                    check your spam folder.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Once verified, you'll be able to access all features
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleResendEmail}
                    disabled={resendLoading || resendCooldown > 0}
                    variant="outline" 
                    className="w-full"
                  >
                    {resendLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : resendCooldown > 0 ? (
                      `Resend in ${resendCooldown}s`
                    ) : (
                      'Resend Verification Email'
                    )}
                  </Button>
                  
                  <Button onClick={handleSignOut} variant="ghost" className="w-full">
                    Sign Out
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Having trouble? <a href="mailto:support@quickbriefs.ai" className="text-blue-600 hover:underline">Contact support</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}