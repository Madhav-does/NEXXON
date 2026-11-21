'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, getChannelKey } from '@/context/ChatContext';
import { MOCK_USERS, getUserById } from '@/data/mockData';
import {
  MessageSquare,
  Search,
  Send,
  Image as ImageIcon,
  Check,
  Clock,
  ExternalLink,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const NexconnChatUIProvider = dynamic(
  () => import('@/components/chat/NexconnChatUIProvider').then((mod) => mod.NexconnChatUIProvider),
  { ssr: false }
);

export default function MessagesPage() {
  const {
    currentUser,
    messagesByChannel,
    sendMessage,
    configStatus,
    setIsCredentialsModalOpen,
    viewMode,
    setViewMode,
  } = useChat();

  // All other users
  const conversationPartners = MOCK_USERS.filter((u) => u.id !== currentUser.id);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(conversationPartners[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPartner = getUserById(selectedPartnerId);
  const channelKey = selectedPartnerId ? getChannelKey(currentUser.id, selectedPartnerId) : '';
  const currentMessages = channelKey ? messagesByChannel[channelKey] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, selectedPartnerId]);

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
    if (!selectedPartnerId) return;
    if (!inputText.trim() && !selectedImage) return;

    const textToSend = inputText.trim();
    const imageToSend = selectedImage;

    setInputText('');
    removeSelectedImage();

    await sendMessage(selectedPartnerId, textToSend, imageToSend || undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[750px]">
        {/* Left Side: Conversation List (4 cols) */}
        <div className="md:col-span-4 border-r border-gray-200 flex flex-col h-full bg-gray-50/50">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-bold text-gray-900 text-base">Direct Conversations</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Logged in as <span className="font-medium text-gray-800">{currentUser.name}</span>
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {conversationPartners.map((partner) => {
              const isSelected = partner.id === selectedPartnerId;
              const chKey = getChannelKey(currentUser.id, partner.id);
              const msgs = messagesByChannel[chKey] || [];
              const lastMsg = msgs[msgs.length - 1];

              return (
                <div
                  key={partner.id}
                  onClick={() => setSelectedPartnerId(partner.id)}
                  className={`p-4 cursor-pointer transition flex items-center gap-3 ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-gray-100/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-xs text-gray-900 truncate">
                        {partner.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {lastMsg
                          ? new Date(lastMsg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 truncate">
                      {lastMsg ? lastMsg.text || 'Image attachment' : 'No messages yet'}
                    </p>

                    <div className="mt-1">
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                          partner.role === 'buyer'
                            ? 'bg-emerald-100 text-emerald-800'
                            : partner.role === 'seller'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {partner.role}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Conversation Area (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {selectedPartner ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPartner.avatar}
                    alt={selectedPartner.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{selectedPartner.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{selectedPartner.role} • Active now</p>
                  </div>
                </div>

                {/* View switcher */}
                <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setViewMode('custom')}
                    className={`px-3 py-1 rounded-md transition ${
                      viewMode === 'custom' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Custom View
                  </button>
                  <button
                    onClick={() => setViewMode('chatui')}
                    className={`px-3 py-1 rounded-md transition ${
                      viewMode === 'chatui' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    Nexconn ChatUI
                  </button>
                </div>
              </div>

              {/* Body */}
              {viewMode === 'chatui' ? (
                <div className="flex-1 relative">
                  <NexconnChatUIProvider targetUserId={selectedPartner.id} />
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {currentMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                        <MessageSquare className="w-10 h-10 mb-2 text-gray-300" />
                        <p className="text-sm font-semibold text-gray-700">No messages yet</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Send a message to start chatting with {selectedPartner.name}.
                        </p>
                      </div>
                    ) : (
                      currentMessages.map((msg) => {
                        const isMe = msg.isMe || msg.senderId === currentUser.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isMe && (
                              <img
                                src={selectedPartner.avatar}
                                alt={selectedPartner.name}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                            )}

                            <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              {msg.imageUrl && (
                                <img
                                  src={msg.imageUrl}
                                  alt="Attachment"
                                  className="max-h-52 rounded-xl mb-1 object-cover border border-gray-200 shadow-xs"
                                />
                              )}

                              {msg.text && (
                                <div
                                  className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                                    isMe
                                      ? 'bg-blue-600 text-white rounded-br-xs'
                                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs shadow-xs'
                                  }`}
                                >
                                  {msg.text}
                                </div>
                              )}

                              <div className="flex items-center gap-1 mt-0.5 px-1 text-[10px] text-gray-400">
                                <span>
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {isMe && <Check className="w-3 h-3 text-blue-500 inline" />}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Selected image preview */}
                  {imagePreviewUrl && (
                    <div className="px-4 py-2 bg-gray-100 flex items-center justify-between border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <img src={imagePreviewUrl} alt="Preview" className="w-10 h-10 object-cover rounded" />
                        <span className="text-xs text-gray-700">{selectedImage?.name}</span>
                      </div>
                      <button onClick={removeSelectedImage} className="text-gray-400 hover:text-red-600">
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Input Bar */}
                  <form
                    onSubmit={handleSend}
                    className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
                  >
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
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition"
                      title="Attach image"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Message ${selectedPartner.name}...`}
                      className="flex-1 text-xs bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 outline-none transition"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim() && !selectedImage}
                      className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl transition shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
