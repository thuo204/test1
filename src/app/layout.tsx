import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/layout/auth-provider';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LearnHub — Master Modern Web Development',
    template: '%s | LearnHub',
  },
  description: 'Premium courses and tutorials for modern web development. Learn Next.js, TypeScript, React, and more from industry experts.',
  keywords: ['online courses', 'web development', 'nextjs', 'typescript', 'react', 'programming'],
  authors: [{ name: 'LearnHub' }],
  creator: 'LearnHub',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'LearnHub — Master Modern Web Development',
    description: 'Premium courses and tutorials for modern web development.',
    siteName: 'LearnHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearnHub — Master Modern Web Development',
    description: 'Premium courses and tutorials for modern web development.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
