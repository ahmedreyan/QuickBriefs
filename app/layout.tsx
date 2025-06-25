import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthErrorBoundary } from '@/components/auth/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'QuickBriefs.ai - AI-Powered Text Summarization',
  description: 'Transform any content into intelligent summaries with AI. Generate business insights, study notes, or Gen Z-style breakdowns in seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </AuthErrorBoundary>
      </body>
    </html>
  );
}