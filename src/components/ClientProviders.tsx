'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ChatProvider } from '@/context/ChatContext';
import { Navbar } from '@/components/Navbar';
import { ChatDrawer } from '@/components/chat/ChatDrawer';
import { SupportWidget } from '@/components/chat/SupportWidget';
import { CredentialsModal } from '@/components/CredentialsModal';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="min-h-screen flex flex-col bg-gray-50/70 dark:bg-[#0f1117] text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Navbar />
          <div className="flex-1">{children}</div>
          <ChatDrawer />
          <SupportWidget />
          <CredentialsModal />
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
};
