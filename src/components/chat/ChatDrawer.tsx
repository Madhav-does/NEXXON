'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, getChannelKey } from '@/context/ChatContext';
import { getUserById } from '@/data/mockData';
import { X, Send, Image as ImageIcon, Sparkles, AlertCircle, ShoppingBag, ExternalLink, Check, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

const NexconnChatUIProvider = dynamic(
  () => import('./NexconnChatUIProvider').then((mod) => mod.NexconnChatUIProvider),
  { ssr: false }
);

export const ChatDrawer: React.FC = () => {
  const {
    currentUser,
    activeChatUser,
    activeProductContext,
    isChatDrawerOpen,
    closeDirectChat,
    messagesByChannel,
    sendMessage,
    connectionStatus,
    configStatus,
    setIsCredentialsModalOpen,
    viewMode,
    setViewMode,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute channel messages
  const channelKey = activeChatUser ? getChannelKey(currentUser.id, activeChatUser.id) : '';
  const currentMessages = channelKey ? messagesByChannel[channelKey] || [] : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isChatDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, isChatDrawerOpen]);

  // Handle image file selection
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
    if (!activeChatUser) return;
    if (!inputText.trim() && !selectedImage) return;

    setIsSending(true);
    const textToSend = inputText.trim();
    const imageToSend = selectedImage;

    // Reset input fields immediately
    setInputText('');
    removeSelectedImage();

    await sendMessage(
      activeChatUser.id,
      textToSend,
      imageToSend || undefined,
      activeProductContext || undefined
    );

    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isChatDrawerOpen || !activeChatUser) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      <div className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeChatUser.avatar}
                alt={activeChatUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-50"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-900 text-sm">{activeChatUser.name}</h3>
                {activeChatUser.badge && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                    {activeChatUser.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="capitalize">{activeChatUser.role}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">Online via Nexconn</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle custom view / official ChatUI */}
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setViewMode('custom')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'custom' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Custom UI
              </button>
              <button
                onClick={() => setViewMode('chatui')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'chatui' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Nexconn ChatUI
              </button>
            </div>

            <button
              onClick={closeDirectChat}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Credentials Warning Banner if not configured */}
        {!configStatus.isConfigured && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Nexconn Demo Mode:</strong> Add your App Key & Secret to enable live WebSocket messaging.
              </span>
            </div>
            <button
              onClick={() => setIsCredentialsModalOpen(true)}
              className="underline font-semibold hover:text-amber-950 ml-2 shrink-0"
            >
              Configure
            </button>
          </div>
        )}

        {/* Content Body: Either Custom UI or Official ChatUI */}
        {viewMode === 'chatui' ? (
          <div className="flex-1 relative">
            <NexconnChatUIProvider targetUserId={activeChatUser.id} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
            {/* Active Product Context Banner */}
            {activeProductContext && (
              <div className="mx-4 mt-3 p-3 bg-white border border-blue-100 rounded-xl shadow-xs flex items-center gap-3">
                <img
                  src={activeProductContext.image}
                  alt={activeProductContext.title}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
                    <ShoppingBag className="w-3 h-3" />
                    <span>Inquiring about this item</span>
                  </div>
                  <h4 className="text-xs font-semibold text-gray-900 truncate">
                    {activeProductContext.title}
                  </h4>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">
                    ${activeProductContext.price.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Message History List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">Start the conversation</h4>
                  <p className="text-xs text-gray-500 max-w-xs mt-1">
                    Send a message to {activeChatUser.name} to discuss product specs, shipping, or pricing.
                  </p>
                </div>
              ) : (
                currentMessages.map((msg) => {
                  const isMe = msg.isMe || msg.senderId === currentUser.id;
                  const sender = isMe ? currentUser : getUserById(msg.senderId) || activeChatUser;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <img
                          src={sender.avatar}
                          alt={sender.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                        />
                      )}

                      <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Attached product card if present */}
                        {msg.productContext && (
                          <div className="mb-1.5 p-2 bg-white rounded-lg border border-gray-200 shadow-xs flex items-center gap-2 max-w-xs">
                            <img
                              src={msg.productContext.image}
                              alt={msg.productContext.title}
                              className="w-9 h-9 object-cover rounded"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-gray-900 truncate">
                                {msg.productContext.title}
                              </p>
                              <p className="text-[11px] font-bold text-blue-600">
                                ${msg.productContext.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Image message attachment */}
                        {msg.imageUrl && (
                          <div
                            onClick={() => setPreviewModalImage(msg.imageUrl || null)}
                            className="mb-1 rounded-xl overflow-hidden cursor-pointer border border-gray-200 max-w-xs shadow-xs hover:opacity-95 transition"
                          >
                            <img
                              src={msg.imageUrl}
                              alt="Attachment"
                              className="max-h-52 w-auto object-cover rounded-xl"
                            />
                          </div>
                        )}

                        {/* Text message bubble */}
                        {msg.text && (
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                                : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs shadow-xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                        )}

                        {/* Message status and timestamp */}
                        <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-400">
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isMe && (
                            <span>
                              {msg.status === 'sending' ? (
                                <Clock className="w-2.5 h-2.5 inline text-gray-400" />
                              ) : (
                                <Check className="w-3 h-3 inline text-blue-500" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {isMe && (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-gray-200"
                        />
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Selected Image Preview before sending */}
            {imagePreviewUrl && (
              <div className="px-4 py-2 bg-gray-100/80 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-md border border-gray-300"
                  />
                  <div className="text-xs text-gray-600">
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">
                      {selectedImage?.name}
                    </p>
                    <p className="text-[10px]">
                      {selectedImage ? (selectedImage.size / 1024).toFixed(1) : 0} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-200 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              <button
                onClick={() => setInputText('Is this item still available?')}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-full text-gray-600 transition shrink-0"
              >
                👋 Still available?
              </button>
              <button
                onClick={() => setInputText('What is the estimated delivery time?')}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-full text-gray-600 transition shrink-0"
              >
                🚚 Delivery time?
              </button>
              <button
                onClick={() => setInputText('Can you do $') }
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-full text-gray-600 transition shrink-0"
              >
                💰 Best price offer?
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
            >
              {/* Hidden File Input */}
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
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                title="Attach image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${activeChatUser.name}...`}
                className="flex-1 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs text-gray-900 border border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 outline-none transition"
              />

              <button
                type="submit"
                disabled={(!inputText.trim() && !selectedImage) || isSending}
                className={`p-2.5 rounded-xl font-medium text-white transition flex items-center justify-center ${
                  (!inputText.trim() && !selectedImage) || isSending
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-xs'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Full-size Image Preview Modal */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <img
            src={previewModalImage}
            alt="Full Preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
