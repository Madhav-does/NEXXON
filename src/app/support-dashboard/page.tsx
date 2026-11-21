'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, getChannelKey } from '@/context/ChatContext';
import { MOCK_USERS, MockUser, getUserById, MOCK_PRODUCTS } from '@/data/mockData';
import {
  Headphones,
  Search,
  Send,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Shield,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';

const CANNED_RESPONSES = [
  'Hello! Thank you for reaching out to Nexxon Support. How can I assist you today?',
  'I have reviewed your inquiry and checked with our logistics team. Your shipment is on schedule.',
  'Your return request has been authorized. A prepaid return shipping label has been emailed to you.',
  'We have issued a full refund to your original payment method. Please allow 2-3 business days.',
  'Is there anything else I can help clarify for you today?',
];

export default function SupportDashboardPage() {
  const {
    currentUser,
    setCurrentUser,
    messagesByChannel,
    sendMessage,
    configStatus,
    setIsCredentialsModalOpen,
  } = useChat();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('user_buyer_1');
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [searchTicket, setSearchTicket] = useState('');
  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [ticketStatus, setTicketStatus] = useState<Record<string, 'open' | 'resolved'>>({
    user_buyer_1: 'open',
    user_seller_1: 'open',
    user_seller_2: 'resolved',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSupportAgent = currentUser.role === 'support';
  const selectedCustomer = getUserById(selectedCustomerId);

  // Channel messages with selected customer
  const channelKey = selectedCustomerId ? getChannelKey(currentUser.id, selectedCustomerId) : '';
  const currentMessages = channelKey ? messagesByChannel[channelKey] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, selectedCustomerId]);

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

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCustomerId) return;
    if (!inputText.trim() && !selectedImage) return;

    const textToSend = inputText.trim();
    const imageToSend = selectedImage;

    setInputText('');
    removeSelectedImage();

    await sendMessage(selectedCustomerId, textToSend, imageToSend || undefined);
  };

  const handleCannedResponse = (text: string) => {
    setInputText(text);
  };

  // Customers with active conversations
  const customerList = MOCK_USERS.filter((u) => u.id !== 'user_support_agent');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 flex flex-col">
      {/* Role Check Warning if not Support Agent */}
      {!isSupportAgent && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong>Support Agent Authorization:</strong> You are currently signed in as{' '}
              <span className="font-bold underline">{currentUser.name}</span> ({currentUser.role}).
              Switch to Support Agent Emma to view the agent dispatch interface.
            </div>
          </div>
          <button
            onClick={() => {
              const agent = getUserById('user_support_agent');
              if (agent) setCurrentUser(agent);
            }}
            className="bg-white text-amber-900 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs hover:bg-amber-50 transition shrink-0 ml-4"
          >
            Switch to Support Agent Emma
          </button>
        </div>
      )}

      {/* Agent Metrics & Status Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Support Agent Dispatch Center</h1>
              <p className="text-xs text-gray-500">
                Real-time ticketing & live customer inquiry resolution via Nexconn Chat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="text-center sm:text-right">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Avg Response Time
              </span>
              <span className="font-bold text-emerald-600">&lt; 1.5 mins</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Satisfaction Rate
              </span>
              <span className="font-bold text-indigo-600">99.2%</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Active Queue
              </span>
              <span className="font-bold text-gray-900">
                {customerList.length} Customer Threads
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Support Hub */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Column: Customer Queue / Thread List (3 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col overflow-hidden h-[750px]">
          {/* Thread list search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inquiries or user..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-xs">
              {(['all', 'open', 'resolved'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTicketFilter(tab)}
                  className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                    ticketFilter === tab
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Threads list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {customerList.map((customer) => {
              const isSelected = customer.id === selectedCustomerId;
              const chKey = getChannelKey(currentUser.id, customer.id);
              const msgs = messagesByChannel[chKey] || [];
              const lastMsg = msgs[msgs.length - 1];
              const status = ticketStatus[customer.id] || 'open';

              if (ticketFilter !== 'all' && status !== ticketFilter) {
                return null;
              }

              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className={`p-4 cursor-pointer transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-xs text-gray-900 truncate">
                        {customer.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {lastMsg
                          ? new Date(lastMsg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 truncate">
                      {lastMsg ? lastMsg.text || 'Photo attachment' : 'No recent messages'}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          customer.role === 'buyer'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {customer.role}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                          status === 'open'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {status === 'open' ? 'Needs Reply' : 'Resolved'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Live Conversation Viewer & Reply Bar (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col overflow-hidden h-[750px]">
          {selectedCustomer ? (
            <>
              {/* Conversation Top Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-gray-900">{selectedCustomer.name}</h3>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.5 rounded">
                        Ticket #NX-{selectedCustomer.id.slice(-4)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{selectedCustomer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setTicketStatus((prev) => ({
                        ...prev,
                        [selectedCustomer.id]:
                          prev[selectedCustomer.id] === 'open' ? 'resolved' : 'open',
                      }))
                    }
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1 ${
                      ticketStatus[selectedCustomer.id] === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {ticketStatus[selectedCustomer.id] === 'resolved'
                        ? 'Resolved'
                        : 'Mark Resolved'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8">
                    <MessageSquare className="w-10 h-10 mb-2 text-gray-300" />
                    <p className="text-xs font-semibold text-gray-700">No messages in this thread yet</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Select a canned reply or type a message below to begin assisting.
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg) => {
                    const isAgentMsg = msg.senderId === 'user_support_agent' || msg.isMe;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${
                          isAgentMsg ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {!isAgentMsg && (
                          <img
                            src={selectedCustomer.avatar}
                            alt={selectedCustomer.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        )}

                        <div className={`max-w-[80%] flex flex-col ${isAgentMsg ? 'items-end' : 'items-start'}`}>
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="Customer Attachment"
                              className="max-h-48 rounded-xl object-cover mb-1 border border-gray-200 shadow-xs"
                            />
                          )}

                          {msg.text && (
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                                isAgentMsg
                                  ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
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
                            {isAgentMsg && <Check className="w-3 h-3 text-indigo-400 inline" />}
                          </div>
                        </div>

                        {isAgentMsg && (
                          <img
                            src={
                              getUserById('user_support_agent')?.avatar ||
                              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
                            }
                            alt="Agent Emma"
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Canned Response Chips */}
              <div className="p-3 bg-white border-t border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Agent Quick Canned Replies
                </span>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                  {CANNED_RESPONSES.map((resp, i) => (
                    <button
                      key={i}
                      onClick={() => handleCannedResponse(resp)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 rounded-lg shrink-0 transition"
                    >
                      {resp.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Image attachment preview */}
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

              {/* Agent Reply Bar */}
              <form
                onSubmit={handleSendReply}
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
                  className="p-2 text-gray-400 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition"
                  title="Attach screenshot or receipt"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Reply to ${selectedCustomer.name} in real time...`}
                  className="flex-1 text-xs bg-gray-50 focus:bg-white border border-gray-200 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 outline-none transition"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !selectedImage}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl transition shadow-xs flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a customer thread to view details
            </div>
          )}
        </div>

        {/* Right Column: Customer Profile & Order Context (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between h-[750px] overflow-y-auto">
          {selectedCustomer ? (
            <div className="space-y-6">
              {/* Customer Avatar & Bio */}
              <div className="text-center pb-5 border-b border-gray-100">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-indigo-50 mb-3"
                />
                <h3 className="font-bold text-sm text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
                <div className="mt-2.5 flex items-center justify-center gap-1.5">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    {selectedCustomer.role}
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full">
                    Verified Customer
                  </span>
                </div>
              </div>

              {/* Order Context Details */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Recent Marketplace Activity
                </h4>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono font-medium text-gray-900">#NX-88219</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Item:</span>
                    <span className="font-medium text-gray-900">Keychron Q1 Pro</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-bold text-gray-900">$199.00 USD</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status:</span>
                    <span className="text-emerald-700 font-medium">Shipped (In Transit)</span>
                  </div>
                </div>
              </div>

              {/* Technical Session Details */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Nexconn Chat Session
                </h4>
                <div className="text-[11px] space-y-1.5 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                  <p>
                    <strong>Target User ID:</strong>{' '}
                    <code className="text-indigo-600 font-mono">{selectedCustomer.id}</code>
                  </p>
                  <p>
                    <strong>Channel Type:</strong> Direct Channel (1:1)
                  </p>
                  <p>
                    <strong>Transport:</strong> WebSocket Engine
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">No customer selected</div>
          )}

          {/* Bottom Security Note */}
          <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>End-to-end encrypted through Nexconn SDK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
