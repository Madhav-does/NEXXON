'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, getChannelKey } from '@/context/ChatContext';
import { getUserById } from '@/data/mockData';
import {
  X,
  Send,
  Image as ImageIcon,
  Headphones,
  Check,
  Clock,
  Languages,
} from 'lucide-react';
import Link from 'next/link';

export const SupportWidget: React.FC = () => {
  const {
    currentUser,
    isSupportWidgetOpen,
    openSupportChat,
    closeSupportChat,
    supportUnreadCount,
    messagesByChannel,
    sendMessage,
    configStatus,
    setIsCredentialsModalOpen,
    toggleMessageOriginal,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const supportAgentId = 'user_support_agent';
  const supportAgent = getUserById(supportAgentId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const channelKey = getChannelKey(currentUser.id, supportAgentId);
  const currentMessages = channelKey ? messagesByChannel[channelKey] || [] : [];

  useEffect(() => {
    if (isSupportWidgetOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, isSupportWidgetOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    setIsSending(true);
    const textToSend = inputText.trim();
    const imageToSend = selectedImage;

    setInputText('');
    removeSelectedImage();

    await sendMessage(supportAgentId, textToSend, imageToSend || undefined);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(supportAgentId, question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Chat Window */}
      {isSupportWidgetOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-[#1a1d27] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2d3148] flex flex-col overflow-hidden mb-3 animate-in zoom-in-95 duration-150 transition-colors">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={supportAgent?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
                  alt="Support"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">Customer Support Hub</h4>
                <p className="text-[11px] text-blue-100 flex items-center gap-1 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  Nexconn Multi-Lingual Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/support-dashboard"
                onClick={closeSupportChat}
                className="text-[11px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-md transition"
              >
                Agent View
              </Link>
              <button
                onClick={closeSupportChat}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Config banner */}
          {!configStatus.isConfigured && (
            <div className="bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 text-[11px] text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <span>Demo Mode: Connect keys for live support.</span>
              <button
                onClick={() => setIsCredentialsModalOpen(true)}
                className="underline font-semibold cursor-pointer"
              >
                Keys
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/60 dark:bg-[#12141f]/40">
            {currentMessages.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <Headphones className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">How can we help you today?</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                  Our official customer service team is ready to assist with orders, returns, and multi-language inquiries.
                </p>
              </div>
            ) : (
              currentMessages.map((msg) => {
                const isMe = msg.isMe || msg.senderId === currentUser.id;
                const sender = isMe ? currentUser : supportAgent;
                const displayText = msg.isShowingOriginal ? msg.originalText || msg.text : msg.text;
                const hasTranslation = !!msg.originalText && !!msg.translatedText;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={sender?.avatar}
                        alt={sender?.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
                      />
                    )}

                    <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="Attachment"
                          className="max-h-40 rounded-xl mb-1 object-cover border border-gray-200 dark:border-[#2d3148] shadow-xs"
                        />
                      )}

                      {displayText && (
                        <div
                          className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-white dark:bg-[#22263a] text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-[#2d3148] rounded-bl-xs shadow-xs'
                          }`}
                        >
                          {displayText}

                          {hasTranslation && (
                            <div className="mt-1 pt-1 border-t border-blue-400/30 dark:border-gray-600/40 flex items-center justify-between gap-1 text-[9px] opacity-90">
                              <span className="flex items-center gap-1 font-mono">
                                <Languages className="w-2.5 h-2.5" />
                                {msg.isShowingOriginal ? 'Original' : 'Translated'}
                              </span>
                              <button
                                onClick={() => toggleMessageOriginal(channelKey, msg.id)}
                                className="underline hover:opacity-100 font-semibold cursor-pointer"
                              >
                                {msg.isShowingOriginal ? 'Translate' : 'Original'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-1 mt-0.5 px-1 text-[9px] text-gray-400 dark:text-gray-500">
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && (
                          <span>
                            {msg.status === 'sending' ? (
                              <Clock className="w-2 h-2 inline" />
                            ) : (
                              <Check className="w-2.5 h-2.5 inline text-blue-500" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Pills */}
          <div className="px-3 py-2 bg-white dark:bg-[#1a1d27] border-t border-gray-100 dark:border-[#2d3148] flex gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
            <button
              onClick={() => handleQuickQuestion('Where is my package? Track order #NX-8821')}
              className="px-2.5 py-1 bg-gray-100 dark:bg-[#22263a] hover:bg-gray-200 dark:hover:bg-[#2c314a] text-gray-700 dark:text-gray-300 rounded-full shrink-0 transition cursor-pointer"
            >
              📦 Track order
            </button>
            <button
              onClick={() => handleQuickQuestion('How do I initiate a return or exchange?')}
              className="px-2.5 py-1 bg-gray-100 dark:bg-[#22263a] hover:bg-gray-200 dark:hover:bg-[#2c314a] text-gray-700 dark:text-gray-300 rounded-full shrink-0 transition cursor-pointer"
            >
              🔄 Return policy
            </button>
            <button
              onClick={() => handleQuickQuestion('I want to report an issue with a seller listing.')}
              className="px-2.5 py-1 bg-gray-100 dark:bg-[#22263a] hover:bg-gray-200 dark:hover:bg-[#2c314a] text-gray-700 dark:text-gray-300 rounded-full shrink-0 transition cursor-pointer"
            >
              ⚠️ Report seller
            </button>
          </div>

          {/* Image preview before send */}
          {imagePreviewUrl && (
            <div className="px-3 py-1.5 bg-gray-100 dark:bg-[#22263a] flex items-center justify-between border-t border-gray-200 dark:border-[#2d3148]">
              <div className="flex items-center gap-2">
                <img src={imagePreviewUrl} alt="Preview" className="w-8 h-8 object-cover rounded" />
                <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
                  {selectedImage?.name}
                </span>
              </div>
              <button onClick={removeSelectedImage} className="text-gray-400 hover:text-red-600 p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-2.5 bg-white dark:bg-[#1a1d27] border-t border-gray-200 dark:border-[#2d3148] flex items-center gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-gray-400 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-[#22263a] transition cursor-pointer"
              title="Attach screenshot or photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask customer support..."
              className="flex-1 bg-gray-50 dark:bg-[#22263a] focus:bg-white dark:focus:bg-[#22263a] text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-[#2d3148] focus:border-blue-500 rounded-xl px-3 py-2 outline-none transition"
            />

            <button
              type="submit"
              disabled={(!inputText.trim() && !selectedImage) || isSending}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 dark:disabled:text-gray-600 rounded-xl transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => (isSupportWidgetOpen ? closeSupportChat() : openSupportChat())}
        className="group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        aria-label="Open customer support chat"
      >
        <div className="relative">
          <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {supportUnreadCount > 0 && !isSupportWidgetOpen && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              {supportUnreadCount}
            </span>
          )}
        </div>
        <span className="font-medium text-sm hidden sm:inline">Help & Support</span>
      </button>
    </div>
  );
};
