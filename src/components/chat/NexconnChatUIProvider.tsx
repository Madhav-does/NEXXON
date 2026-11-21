'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { getUserById } from '@/data/mockData';

export const NexconnChatUIProvider: React.FC<{ targetUserId?: string }> = ({ targetUserId }) => {
  const { configStatus, currentUser } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let chatAppInstance: any = null;
    let isCancelled = false;

    async function setupChatUI() {
      if (typeof window === 'undefined') return;

      if (!configStatus.isConfigured) {
        setInitError('Nexconn App Key and App Secret must be configured in .env.local to load the official ChatUI Web Components.');
        return;
      }

      try {
        // Dynamically import @nexconn/chat and @nexconn/chatui only in the browser
        const { NCEngine, LogLevel, DirectChannelIdentifier } = await import('@nexconn/chat');
        const { NCChatUIApplication } = await import('@nexconn/chatui');

        // ServiceHooks to supply user profile data to Nexconn ChatUI
        const hooks = {
          async reqUserProfiles(userIds: string[]) {
            return userIds.map((userId) => {
              const u = getUserById(userId);
              return {
                userId,
                name: u ? u.name : `User ${userId}`,
                portraitUrl: u?.avatar || `https://ui-avatars.com/api/?name=${userId}&background=random`,
              };
            });
          },
          async reqGroupProfiles(groupIds: string[]) {
            return groupIds.map((groupId) => ({
              groupId,
              name: `Group ${groupId}`,
              memberCount: 0,
            }));
          },
          async reqGroupMembers() {
            return [];
          },
          async reqSystemProfiles(systemIds: string[]) {
            return systemIds.map((systemId) => ({
              systemId,
              name: `System ${systemId}`,
            }));
          },
        };

        const app = NCChatUIApplication.initialize({
          hooks,
          language: 'en_US',
        });

        if (!app) {
          throw new Error('NCChatUIApplication.initialize returned null');
        }

        app.ready();
        chatAppInstance = app;

        if (isCancelled) return;
        setIsReady(true);

        // Open target direct channel if provided
        if (targetUserId && app.ifReady()) {
          await app.openChannel(new DirectChannelIdentifier(targetUserId), true);
        }
      } catch (err: any) {
        console.error('[ChatUI Init Error]', err);
        if (!isCancelled) {
          setInitError(err.message || 'Failed to initialize Nexconn ChatUI');
        }
      }
    }

    setupChatUI();

    return () => {
      isCancelled = true;
      if (chatAppInstance && typeof chatAppInstance.destroy === 'function') {
        try {
          chatAppInstance.destroy();
        } catch (e) {
          // ignore cleanup error
        }
      }
    };
  }, [configStatus.isConfigured, targetUserId]);

  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 text-gray-700">
        <div className="w-12 h-12 mb-3 text-amber-500 flex items-center justify-center bg-amber-100 rounded-full">
          ⚠️
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">Official ChatUI Requires Configured Keys</h4>
        <p className="text-sm text-gray-600 max-w-md">{initError}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative bg-white overflow-hidden">
      {/* Official Nexconn Web Component Custom Element */}
      {React.createElement('nc-chat-ui-app-provider', {
        style: {
          width: '100%',
          height: '100%',
          display: 'block',
        },
      })}
    </div>
  );
};
