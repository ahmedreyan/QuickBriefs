import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthErrorBoundary } from '@/components/auth/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'QuickBriefs.ai - AI-Powered Text Summarization',
  description: 'Transform any content into intelligent summaries with AI. Generate business insights, study notes, or Gen Z-style breakdowns in seconds.',
  viewport: 'width=device-width, initial-scale=1.0',
  other: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';" />
      </head>
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