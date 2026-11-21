'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChat } from '@/context/ChatContext';
import { MOCK_USERS, MockUser } from '@/data/mockData';
import {
  ShoppingBag,
  MessageCircle,
  Headphones,
  Users,
  Key,
  ChevronDown,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    currentUser,
    setCurrentUser,
    connectionStatus,
    statusMessage,
    configStatus,
    setIsCredentialsModalOpen,
  } = useChat();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                NEXXON
              </span>
              <span className="text-[10px] text-blue-600 font-bold block -mt-1 tracking-wider uppercase">
                Market & Chat
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/messages"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/messages'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Messages
            </Link>
            <Link
              href="/support-dashboard"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/support-dashboard'
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Headphones className="w-4 h-4 text-indigo-500" />
              <span>Support Dashboard</span>
              {currentUser.role === 'support' && (
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </Link>
          </nav>
        </div>

        {/* Right Tools: Connection Status, Credentials Button, Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Connection status pill */}
          <div
            onClick={() => setIsCredentialsModalOpen(true)}
            title={statusMessage}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border cursor-pointer transition-colors ${
              connectionStatus === 'CONNECTED'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : connectionStatus === 'CONNECTING'
                ? 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'CONNECTED'
                  ? 'bg-emerald-500'
                  : connectionStatus === 'CONNECTING'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
            />
            <span className="font-medium text-[11px]">
              {connectionStatus === 'CONNECTED'
                ? 'Nexconn Online'
                : connectionStatus === 'CONNECTING'
                ? 'Connecting...'
                : 'Setup Required'}
            </span>
          </div>

          {/* Credentials modal trigger button */}
          <button
            onClick={() => setIsCredentialsModalOpen(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition border border-gray-200 hover:border-blue-200"
            title="Configure Nexconn Credentials"
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Mock User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-300"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-gray-900 leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-gray-500 capitalize">Role: {currentUser.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Switch Test User Role
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Test live chat from different perspectives
                  </p>
                </div>

                <div className="py-1">
                  {MOCK_USERS.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => setCurrentUser(user)}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition ${
                          isSelected ? 'bg-blue-50/70 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate">{user.name}</span>
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                                user.role === 'buyer'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : user.role === 'seller'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400 block truncate">
                            {user.email}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-[11px] text-gray-500">
                    Switching roles reconnects the Nexconn Chat engine with that user's access token.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
