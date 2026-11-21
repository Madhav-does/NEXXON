import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NEXXON Marketplace & Customer Support — Real-time Multi-Lingual Nexconn Chat',
  description:
    'Full-stack Marketplace and Customer Support web application built with Next.js App Router, Tailwind CSS, multi-language translation, and the Nexconn Chat Web SDK.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 transition-colors">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
