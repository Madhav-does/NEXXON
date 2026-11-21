'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MOCK_USERS, MockUser, Product, getUserById } from '@/data/mockData';
import { detectLanguage, translateText } from '@/utils/translator';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  targetId: string;
  text?: string;
  imageUrl?: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'failed';
  isMe: boolean;
  productContext?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  // Multi-language translation support
  language?: string;
  originalText?: string;
  translatedText?: string;
  isShowingOriginal?: boolean;
}

export type ConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'UNCONFIGURED';

interface ConfigStatus {
  isConfigured: boolean;
  hasAppKey: boolean;
  hasAppSecret: boolean;
  appKeyPrefix: string | null;
  baseUrl: string;
}

interface ChatContextType {
  currentUser: MockUser;
  setCurrentUser: (user: MockUser) => void;
  connectionStatus: ConnectionStatus;
  statusMessage: string;
  configStatus: ConfigStatus;
  refreshConfig: () => Promise<void>;
  saveCredentials: (appKey: string, appSecret: string, baseUrl?: string) => Promise<boolean>;

  // 1:1 Direct Chat state
  activeChatUser: MockUser | null;
  activeProductContext: Product | null;
  isChatDrawerOpen: boolean;
  openDirectChat: (targetUserId: string, product?: Product) => void;
  closeDirectChat: () => void;

  // Support Chat state
  isSupportWidgetOpen: boolean;
  openSupportChat: (initialMessage?: string) => void;
  closeSupportChat: () => void;
  supportUnreadCount: number;

  // Messages
  messagesByChannel: Record<string, ChatMessage[]>;
  sendMessage: (targetUserId: string, text?: string, imageFile?: File, productContext?: Product) => Promise<boolean>;

  // Translation features
  preferredLanguage: string;
  setPreferredLanguage: (lang: string) => void;
  autoTranslate: boolean;
  setAutoTranslate: (enabled: boolean) => void;
  toggleMessageOriginal: (channelKey: string, messageId: string) => void;
  translateMessageManually: (channelKey: string, messageId: string, targetLang: string) => void;
  
  // Credentials modal
  isCredentialsModalOpen: boolean;
  setIsCredentialsModalOpen: (open: boolean) => void;

  // View mode (Custom vs official ChatUI Web Component)
  viewMode: 'custom' | 'chatui';
  setViewMode: (mode: 'custom' | 'chatui') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper to generate consistent channel key for 1:1 direct conversations
export function getChannelKey(userA: string, userB: string): string {
  return [userA, userB].sort().join('__');
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserInternal] = useState<MockUser>(MOCK_USERS[0]); // Alex Buyer
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('UNCONFIGURED');
  const [statusMessage, setStatusMessage] = useState<string>('Checking Nexconn credentials...');
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({
    isConfigured: false,
    hasAppKey: false,
    hasAppSecret: false,
    appKeyPrefix: null,
    baseUrl: 'api.sg-light-api.com',
  });

  const [activeChatUser, setActiveChatUser] = useState<MockUser | null>(null);
  const [activeProductContext, setActiveProductContext] = useState<Product | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  const [isSupportWidgetOpen, setIsSupportWidgetOpen] = useState(false);
  const [supportUnreadCount, setSupportUnreadCount] = useState(1);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'custom' | 'chatui'>('custom');

  // Translation state
  const [preferredLanguage, setPreferredLanguage] = useState<string>('en');
  const [autoTranslate, setAutoTranslate] = useState<boolean>(true);

  // Messages keyed by channel: getChannelKey(userA, userB)
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, ChatMessage[]>>({});

  // SDK refs
  const engineInitializedRef = useRef(false);
  const activeTokenRef = useRef<string | null>(null);

  // Check config status on mount
  const refreshConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/nexconn/config-status');
      if (res.ok) {
        const data = await res.json();
        setConfigStatus(data);
        if (!data.isConfigured) {
          setConnectionStatus('UNCONFIGURED');
          setStatusMessage('Nexconn App Key or App Secret is not configured in .env.local');
        }
      }
    } catch (err) {
      console.error('Failed to check config status:', err);
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  // Seed default demonstration messages including multi-language conversations
  useEffect(() => {
    const buyerId = 'user_buyer_1';
    const seller1Id = 'user_seller_1';
    const seller2Id = 'user_seller_2';
    const supportId = 'user_support_agent';

    const now = Date.now();

    const channelBuyerSeller1 = getChannelKey(buyerId, seller1Id);
    const channelBuyerSeller2 = getChannelKey(buyerId, seller2Id);
    const channelBuyerSupport = getChannelKey(buyerId, supportId);

    setMessagesByChannel((prev) => {
      // Don't overwrite if already seeded
      if (Object.keys(prev).length > 0) return prev;

      return {
        [channelBuyerSeller1]: [
          {
            id: 'demo-msg-1',
            senderId: seller1Id,
            senderName: 'Sara Studio',
            senderAvatar: getUserById(seller1Id)?.avatar,
            targetId: buyerId,
            text: 'Hello Alex! Thanks for checking out our Keychron Q1 Pro. All units are currently in stock with red linear switches.',
            timestamp: now - 3600000 * 2,
            status: 'sent',
            isMe: false,
            language: 'en',
            productContext: {
              id: 'prod_1',
              title: 'Keychron Q1 Pro Custom Wireless Mechanical Keyboard',
              price: 199.0,
              image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
            },
          },
          {
            id: 'demo-msg-2',
            senderId: buyerId,
            senderName: 'Alex Rivera',
            senderAvatar: getUserById(buyerId)?.avatar,
            targetId: seller1Id,
            text: 'Awesome! Does it come with Mac and Windows keycaps in the box?',
            originalText: '¡Genial! ¿Viene con teclas para Mac y Windows en la caja?',
            translatedText: 'Awesome! Does it come with Mac and Windows keycaps in the box?',
            language: 'es',
            isShowingOriginal: false,
            timestamp: now - 3600000 * 1.5,
            status: 'sent',
            isMe: true,
          },
          {
            id: 'demo-msg-3',
            senderId: seller1Id,
            senderName: 'Sara Studio',
            senderAvatar: getUserById(seller1Id)?.avatar,
            targetId: buyerId,
            text: 'Yes! It includes both macOS and Windows keycaps, plus a switch puller and braided Type-C cable.',
            imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80',
            timestamp: now - 3600000 * 1,
            status: 'sent',
            isMe: false,
            language: 'en',
          },
        ],
        [channelBuyerSeller2]: [
          {
            id: 'demo-msg-4',
            senderId: seller2Id,
            senderName: 'TechCraft Workspace',
            senderAvatar: getUserById(seller2Id)?.avatar,
            targetId: buyerId,
            text: 'Hi there! We offer free white-glove delivery on the Herman Miller Embody chair.',
            originalText: 'Bonjour ! Nous offrons la livraison spéciale gratuite pour la chaise Herman Miller Embody.',
            translatedText: 'Hi there! We offer free white-glove delivery on the Herman Miller Embody chair.',
            language: 'fr',
            isShowingOriginal: false,
            timestamp: now - 86400000,
            status: 'sent',
            isMe: false,
          },
        ],
        [channelBuyerSupport]: [
          {
            id: 'demo-msg-5',
            senderId: supportId,
            senderName: 'Emma (Nexxon Support)',
            senderAvatar: getUserById(supportId)?.avatar,
            targetId: buyerId,
            text: 'Welcome to Nexxon Support! How can we assist you with your marketplace order today?',
            timestamp: now - 1800000,
            status: 'sent',
            isMe: false,
            language: 'en',
          },
          {
            id: 'demo-msg-6',
            senderId: buyerId,
            senderName: 'Alex Rivera',
            senderAvatar: getUserById(buyerId)?.avatar,
            targetId: supportId,
            text: 'I ordered the Keychron Q1 Pro keyboard yesterday. Can you verify shipping status?',
            originalText: '¿Cuál es el tiempo estimado de entrega para el teclado Keychron Q1 Pro?',
            translatedText: 'What is the estimated delivery time for the Keychron Q1 Pro keyboard?',
            language: 'es',
            isShowingOriginal: false,
            timestamp: now - 900000,
            status: 'sent',
            isMe: true,
          },
        ],
      };
    });
  }, []);

  // Toggle message original/translated view
  const toggleMessageOriginal = useCallback((channelKey: string, messageId: string) => {
    setMessagesByChannel((prev) => {
      const channelMsgs = prev[channelKey];
      if (!channelMsgs) return prev;
      return {
        ...prev,
        [channelKey]: channelMsgs.map((m) =>
          m.id === messageId ? { ...m, isShowingOriginal: !m.isShowingOriginal } : m
        ),
      };
    });
  }, []);

  // Translate message manually to target language
  const translateMessageManually = useCallback(
    (channelKey: string, messageId: string, targetLang: string) => {
      setMessagesByChannel((prev) => {
        const channelMsgs = prev[channelKey];
        if (!channelMsgs) return prev;
        return {
          ...prev,
          [channelKey]: channelMsgs.map((m) => {
            if (m.id !== messageId) return m;
            const source = m.originalText || m.text || '';
            const translated = translateText(source, targetLang);
            return {
              ...m,
              originalText: m.originalText || m.text,
              translatedText: translated,
              text: translated,
              isShowingOriginal: false,
            };
          }),
        };
      });
    },
    []
  );

  // Connect user to Nexconn Chat SDK when credentials are valid
  const connectUserToNexconn = useCallback(
    async (user: MockUser) => {
      if (!configStatus.isConfigured) {
        setConnectionStatus('UNCONFIGURED');
        setStatusMessage('Nexconn App Key or App Secret is not configured in .env.local');
        return;
      }

      setConnectionStatus('CONNECTING');
      setStatusMessage(`Requesting secure token for ${user.name}...`);

      try {
        const tokenRes = await fetch('/api/nexconn/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name,
            avatarUrl: user.avatar,
          }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || tokenData.code !== 0 || !tokenData.token) {
          console.warn('[Nexconn Token Issue Failed]', tokenData);
          setConnectionStatus('ERROR');
          setStatusMessage(tokenData.message || 'Failed to acquire access token from Nexconn');
          return;
        }

        const accessToken = tokenData.token;
        activeTokenRef.current = accessToken;

        if (typeof window !== 'undefined') {
          const { NCEngine, LogLevel, ConnectionStatusHandler, MessageHandler, ConnectionStatus } = await import('@nexconn/chat');

          const appKey = process.env.NEXT_PUBLIC_NEXCONN_APP_KEY || configStatus.appKeyPrefix || undefined;
          if (!engineInitializedRef.current && appKey) {
            NCEngine.initialize({
              appKey: appKey,
              logLevel: LogLevel.DEBUG,
            });
            engineInitializedRef.current = true;

            NCEngine.addConnectionStatusHandler(
              'global-status-handler',
              new ConnectionStatusHandler({
                onConnectionStatusChanged({ status, code }) {
                  console.log('[Nexconn Status Change]', status, code);
                  if (status === ConnectionStatus.CONNECTED || (status as any) === 0) {
                    setConnectionStatus('CONNECTED');
                    setStatusMessage(`Connected as ${user.name}`);
                  } else if (status === ConnectionStatus.DISCONNECTED || (status as any) === 2) {
                    setConnectionStatus('DISCONNECTED');
                    setStatusMessage('Disconnected from Nexconn');
                  } else if (status === ConnectionStatus.CONNECTING || (status as any) === 1) {
                    setConnectionStatus('CONNECTING');
                    setStatusMessage('Reconnecting...');
                  }
                },
              })
            );

            NCEngine.addMessageHandler(
              'global-message-handler',
              new MessageHandler({
                onMessageReceived({ messages }) {
                  console.log('[Nexconn Messages Received]', messages);
                  if (!messages || messages.length === 0) return;

                  setMessagesByChannel((prev) => {
                    const next = { ...prev };
                    for (const msg of messages) {
                      const senderId = msg.senderUserId;
                      const currentUserId = user.id;
                      const channelKey = getChannelKey(senderId, currentUserId);

                      const sender = getUserById(senderId);
                      const isMe = senderId === currentUserId;

                      let text = '';
                      let imageUrl: string | undefined;

                      if (msg.content) {
                        text = (msg.content as any).text || (msg.content as any).content || '';
                        imageUrl = (msg.content as any).remoteUrl || (msg.content as any).thumbnailBase64;
                      }

                      const detected = detectLanguage(text);
                      const shouldTranslate = autoTranslate && detected !== preferredLanguage && text;
                      const translated = shouldTranslate ? translateText(text, preferredLanguage) : undefined;

                      const newMsg: ChatMessage = {
                        id: msg.messageId || `remote-${Date.now()}-${Math.random()}`,
                        senderId,
                        senderName: sender?.name || `User ${senderId}`,
                        senderAvatar: sender?.avatar,
                        targetId: currentUserId,
                        text: shouldTranslate ? translated : text,
                        originalText: shouldTranslate ? text : undefined,
                        translatedText: translated,
                        language: detected,
                        isShowingOriginal: false,
                        imageUrl,
                        timestamp: msg.sentTime || Date.now(),
                        status: 'sent',
                        isMe,
                      };

                      const existing = next[channelKey] || [];
                      if (!existing.some((m) => m.id === newMsg.id)) {
                        next[channelKey] = [...existing, newMsg];
                      }
                    }
                    return next;
                  });
                },
              })
            );
          }

          try {
            await NCEngine.disconnect();
          } catch (e) {
            // ignore
          }

          const connResult = await NCEngine.connect({ token: accessToken });
          if (connResult.isOk || connResult.code === 0) {
            setConnectionStatus('CONNECTED');
            setStatusMessage(`Connected as ${user.name} (${connResult.data?.userId || user.id})`);
            console.log('[Nexconn Connected Successfully]', connResult.data);
          } else {
            setConnectionStatus('ERROR');
            setStatusMessage(`Nexconn connection failed (code: ${connResult.code})`);
          }
        }
      } catch (err: any) {
        console.error('[Nexconn Connect Exception]', err);
        setConnectionStatus('ERROR');
        setStatusMessage(err.message || 'Connection exception');
      }
    },
    [configStatus, autoTranslate, preferredLanguage]
  );

  const setCurrentUser = useCallback(
    (user: MockUser) => {
      setCurrentUserInternal(user);
      connectUserToNexconn(user);
    },
    [connectUserToNexconn]
  );

  useEffect(() => {
    if (configStatus.isConfigured) {
      connectUserToNexconn(currentUser);
    }
  }, [configStatus.isConfigured, connectUserToNexconn, currentUser]);

  const saveCredentials = async (appKey: string, appSecret: string, baseUrl?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/nexconn/save-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appKey, appSecret, apiBaseUrl: baseUrl }),
      });
      if (res.ok) {
        await refreshConfig();
        setIsCredentialsModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save credentials:', err);
      return false;
    }
  };

  const openDirectChat = useCallback(
    (targetUserId: string, product?: Product) => {
      const targetUser = getUserById(targetUserId);
      if (targetUser) {
        setActiveChatUser(targetUser);
        setActiveProductContext(product || null);
        setIsChatDrawerOpen(true);
      }
    },
    []
  );

  const closeDirectChat = useCallback(() => {
    setIsChatDrawerOpen(false);
  }, []);

  const openSupportChat = useCallback((initialMessage?: string) => {
    const supportAgent = getUserById('user_support_agent');
    if (supportAgent) {
      setActiveChatUser(supportAgent);
      setIsSupportWidgetOpen(true);
      setSupportUnreadCount(0);
    }
  }, []);

  const closeSupportChat = useCallback(() => {
    setIsSupportWidgetOpen(false);
  }, []);

  // Send message with automatic language detection and translation support
  const sendMessage = async (
    targetUserId: string,
    text?: string,
    imageFile?: File,
    productContext?: Product
  ): Promise<boolean> => {
    if (!text && !imageFile) return false;

    const channelKey = getChannelKey(currentUser.id, targetUserId);
    const tempId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    let previewUrl: string | undefined;
    if (imageFile) {
      previewUrl = URL.createObjectURL(imageFile);
    }

    const detected = text ? detectLanguage(text) : undefined;

    const optimisticMsg: ChatMessage = {
      id: tempId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      targetId: targetUserId,
      text: text || '',
      imageUrl: previewUrl,
      timestamp: Date.now(),
      status: 'sending',
      isMe: true,
      language: detected,
      productContext: productContext
        ? {
            id: productContext.id,
            title: productContext.title,
            price: productContext.price,
            image: productContext.image,
          }
        : undefined,
    };

    setMessagesByChannel((prev) => ({
      ...prev,
      [channelKey]: [...(prev[channelKey] || []), optimisticMsg],
    }));

    if (connectionStatus === 'CONNECTED' && typeof window !== 'undefined') {
      try {
        const { DirectChannel, SendTextMessageParams, Helper } = await import('@nexconn/chat');
        const channel = new DirectChannel(targetUserId);

        if (imageFile) {
          const imgParamResult = await Helper.createSendImageMessageParams(imageFile);
          if (imgParamResult.isOk && imgParamResult.data) {
            const sendResult = await channel.sendMediaMessage(imgParamResult.data);
            if ((sendResult.isOk || sendResult.code === 0) && sendResult.data) {
              setMessagesByChannel((prev) => ({
                ...prev,
                [channelKey]: (prev[channelKey] || []).map((m) =>
                  m.id === tempId ? { ...m, status: 'sent', id: sendResult.data?.messageId || tempId } : m
                ),
              }));
              return true;
            }
          }
        } else if (text) {
          const params = new SendTextMessageParams({ text });
          const sendResult = await channel.sendMessage(params);
          if ((sendResult.isOk || sendResult.code === 0) && sendResult.data) {
            setMessagesByChannel((prev) => ({
              ...prev,
              [channelKey]: (prev[channelKey] || []).map((m) =>
                m.id === tempId ? { ...m, status: 'sent', id: sendResult.data?.messageId || tempId } : m
              ),
            }));
            return true;
          }
        }
      } catch (sdkError) {
        console.warn('[Nexconn Send Error, using local fallback]', sdkError);
      }
    }

    // In demo/mock or offline mode, mark sent after short delay
    setTimeout(() => {
      setMessagesByChannel((prev) => ({
        ...prev,
        [channelKey]: (prev[channelKey] || []).map((m) => (m.id === tempId ? { ...m, status: 'sent' } : m)),
      }));

      // Auto-reply in demo mode with intelligent translation
      if (!configStatus.isConfigured) {
        setTimeout(() => {
          const target = getUserById(targetUserId);
          if (target && target.role === 'support') {
            const replyId = `reply-${Date.now()}`;
            const englishReply = `Thanks for messaging support! Agent Emma has received: "${text || 'your attachment'}". In demo mode, Nexconn credentials enable live multi-language WebSocket delivery.`;
            const replyText =
              preferredLanguage !== 'en' && autoTranslate
                ? translateText(englishReply, preferredLanguage)
                : englishReply;

            const supportReply: ChatMessage = {
              id: replyId,
              senderId: targetUserId,
              senderName: target.name,
              senderAvatar: target.avatar,
              targetId: currentUser.id,
              text: replyText,
              originalText: preferredLanguage !== 'en' ? englishReply : undefined,
              translatedText: preferredLanguage !== 'en' ? replyText : undefined,
              language: 'en',
              isShowingOriginal: false,
              timestamp: Date.now(),
              status: 'sent',
              isMe: false,
            };
            setMessagesByChannel((prev) => ({
              ...prev,
              [channelKey]: [...(prev[channelKey] || []), supportReply],
            }));
          } else if (target && target.role === 'seller') {
            const replyId = `reply-${Date.now()}`;
            const rawSellerReply = `Thanks for your interest in our products! We ship within 24 hours of payment. Feel free to ask any other questions!`;
            const sellerReplyText =
              preferredLanguage !== 'en' && autoTranslate
                ? translateText(rawSellerReply, preferredLanguage)
                : rawSellerReply;

            const sellerReply: ChatMessage = {
              id: replyId,
              senderId: targetUserId,
              senderName: target.name,
              senderAvatar: target.avatar,
              targetId: currentUser.id,
              text: sellerReplyText,
              originalText: preferredLanguage !== 'en' ? rawSellerReply : undefined,
              translatedText: preferredLanguage !== 'en' ? sellerReplyText : undefined,
              language: 'en',
              isShowingOriginal: false,
              timestamp: Date.now(),
              status: 'sent',
              isMe: false,
            };
            setMessagesByChannel((prev) => ({
              ...prev,
              [channelKey]: [...(prev[channelKey] || []), sellerReply],
            }));
          }
        }, 1200);
      }
    }, 350);

    return true;
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        connectionStatus,
        statusMessage,
        configStatus,
        refreshConfig,
        saveCredentials,
        activeChatUser,
        activeProductContext,
        isChatDrawerOpen,
        openDirectChat,
        closeDirectChat,
        isSupportWidgetOpen,
        openSupportChat,
        closeSupportChat,
        supportUnreadCount,
        messagesByChannel,
        sendMessage,
        preferredLanguage,
        setPreferredLanguage,
        autoTranslate,
        setAutoTranslate,
        toggleMessageOriginal,
        translateMessageManually,
        isCredentialsModalOpen,
        setIsCredentialsModalOpen,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
