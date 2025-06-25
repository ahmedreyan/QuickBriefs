'use client';

import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from 'lucide-react';
import { AuthService } from '@/lib/auth';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const validation = AuthService.validatePassword(password);
  
  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Password strength</span>
        <span className={`text-sm font-medium ${validation.score >= 4 ? 'text-green-600' : validation.score >= 3 ? 'text-blue-600' : validation.score >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
          {getStrengthText(validation.score)}
        </span>
      </div>
      
      <Progress 
        value={(validation.score / 5) * 100} 
        className="h-2 mb-3"
      />
      
      <div className="space-y-1">
        {[
          'At least 8 characters',
          'One uppercase letter',
          'One lowercase letter', 
          'One number',
          'One special character'
        ].map((requirement, index) => {
          const isMet = !validation.feedback.includes(requirement);
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              {isMet ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500" />
              )}
              <span className={isMet ? 'text-green-600' : 'text-muted-foreground'}>
                {requirement}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}