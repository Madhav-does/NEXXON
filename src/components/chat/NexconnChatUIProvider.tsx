'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { getUserById } from '@/data/mockData';
import { Send, Sparkles, MessageSquare, Check, RefreshCw, AlertCircle } from 'lucide-react';

export const NexconnChatUIProvider: React.FC<{ targetUserId?: string }> = ({ targetUserId }) => {
  const { configStatus, currentUser, connectionStatus } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [chatApp, setChatApp] = useState<any>(null);
  const [sampleText, setSampleText] = useState('Hi! Inquiring about this item via Nexconn Web SDK.');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const targetUser = targetUserId ? getUserById(targetUserId) : null;

  useEffect(() => {
    let chatAppInstance: any = null;
    let isCancelled = false;

    async function setupChatUI() {
      if (typeof window !== 'undefined') {
        try {
          const { NCEngine, LogLevel, DirectChannelIdentifier, AreaCode } = await import('@nexconn/chat');
          const { NCChatUIApplication } = await import('@nexconn/chatui');

          // Initialize Nexconn ChatUI service hooks
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
          setChatApp(app);
          setIsReady(true);

          // Open target direct channel if provided
          if (targetUserId && app.ifReady()) {
            try {
              await app.openChannel(new DirectChannelIdentifier(targetUserId), true);
            } catch (err) {
              console.warn('[ChatUI OpenChannel]', err);
            }
          }
        } catch (err: any) {
          console.error('[ChatUI Init Error]', err);
          if (!isCancelled) {
            setInitError(err.message || 'Failed to initialize Nexconn ChatUI');
          }
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

  const handleSendViaSDK = async () => {
    if (!targetUserId || !sampleText.trim()) return;
    setIsSending(true);

    try {
      const { DirectChannel, SendTextMessageParams } = await import('@nexconn/chat');
      const channel = new DirectChannel(targetUserId);
      const res = await channel.sendMessage(new SendTextMessageParams({ text: sampleText.trim() }));
      console.log('[Nexconn DirectChannel send result]', res);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    } catch (err) {
      console.error('[Send via SDK Error]', err);
    } finally {
      setIsSending(false);
    }
  };

  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 dark:bg-[#12141f] text-gray-700 dark:text-gray-300">
        <div className="w-12 h-12 mb-3 text-amber-500 flex items-center justify-center bg-amber-100 dark:bg-amber-950/40 rounded-full">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Official ChatUI Initialization</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">{initError}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#12141f] overflow-hidden">
      {/* Informative Header for ChatUI Mode */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-blue-950 dark:text-blue-200">
            Official Nexconn Web Component (<code className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">&lt;nc-chat-ui-app-provider&gt;</code>)
          </span>
        </div>
        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
          Engine Active
        </span>
      </div>

      {/* Target User Info & Quick Dispatch */}
      {targetUser && (
        <div className="p-3 bg-gray-50 dark:bg-[#1a1d27] border-b border-gray-200 dark:border-[#2d3148] flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={targetUser.avatar} alt={targetUser.name} className="w-7 h-7 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{targetUser.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Target User ID: {targetUser.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendViaSDK}
              disabled={isSending}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
            >
              {sendSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Send className="w-3.5 h-3.5" />}
              <span>{sendSuccess ? 'Sent to Cloud!' : isSending ? 'Sending...' : 'Send Test Msg'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Official Nexconn Web Component Custom Element Container */}
      <div ref={containerRef} className="flex-1 w-full relative bg-white dark:bg-[#12141f] min-h-[400px]">
        {React.createElement('nc-chat-ui-app-provider', {
          style: {
            width: '100%',
            height: '100%',
            display: 'block',
            minHeight: '400px',
          },
        })}
      </div>
    </div>
  );
};
