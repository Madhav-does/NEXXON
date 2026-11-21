'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { X, Key, ShieldCheck, ExternalLink, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export const CredentialsModal: React.FC = () => {
  const {
    isCredentialsModalOpen,
    setIsCredentialsModalOpen,
    configStatus,
    saveCredentials,
    refreshConfig,
  } = useChat();

  const [appKeyInput, setAppKeyInput] = useState('');
  const [appSecretInput, setAppSecretInput] = useState('');
  const [baseUrlInput, setBaseUrlInput] = useState('api.sg-light-api.com');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle escape key to dismiss
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isCredentialsModalOpen) {
        setIsCredentialsModalOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCredentialsModalOpen, setIsCredentialsModalOpen]);

  if (!isCredentialsModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appKeyInput.trim() || !appSecretInput.trim()) {
      setErrorMessage('Please enter both App Key and App Secret.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    const ok = await saveCredentials(appKeyInput.trim(), appSecretInput.trim(), baseUrlInput);
    setIsSaving(false);

    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsCredentialsModalOpen(false);
      }, 1500);
    } else {
      setErrorMessage('Failed to save credentials to .env.local. Check server console.');
    }
  };

  return (
    <div
      onClick={() => setIsCredentialsModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#1a1d27] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#2d3148] overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Nexconn SDK Configuration</h3>
              <p className="text-xs text-gray-400">Manage App Key & App Secret</p>
            </div>
          </div>
          <button
            onClick={() => setIsCredentialsModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-[#12141f] border-b border-gray-200 dark:border-[#2d3148] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                configStatus.isConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {configStatus.isConfigured ? 'Credentials configured in .env.local' : 'Credentials pending in .env.local'}
            </span>
          </div>
          <button
            onClick={() => refreshConfig()}
            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reload</span>
          </button>
        </div>

        {/* Security Rule Callout */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <strong className="font-semibold">Strict Security Standard:</strong>
              <p className="mt-0.5 text-blue-800 dark:text-blue-300">
                <code className="bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded font-mono text-[11px]">NEXCONN_APP_SECRET</code> is
                exclusively kept server-side in your backend route (
                <code className="bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded font-mono text-[11px]">/api/nexconn/token</code>
                ). It is never sent to the browser or exposed in client bundles.
              </p>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#12141f] p-3.5 rounded-xl border border-gray-200 dark:border-[#2d3148]">
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-1.5">
              <span>Where to find your credentials:</span>
              <a
                href="https://console.nexconn.ai/agile/apps/km"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
              >
                Nexconn Console <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-gray-600 dark:text-gray-400">
              <li>Log in to the console and create or choose an application.</li>
              <li>Navigate to <strong>Key Management</strong>.</li>
              <li>Copy the <strong>App Key</strong> and <strong>App Secret</strong>.</li>
            </ol>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nexconn App Key (Public)
              </label>
              <input
                type="text"
                placeholder="e.g. uwd1c0sxdlx2"
                value={appKeyInput}
                onChange={(e) => setAppKeyInput(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 bg-gray-50 dark:bg-[#22263a] border border-gray-300 dark:border-[#3d4166] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:bg-white dark:focus:bg-[#22263a] focus:border-blue-500 outline-none transition"
              />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                Mapped to <code className="text-gray-600 dark:text-gray-400">NEXT_PUBLIC_NEXCONN_APP_KEY</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nexconn App Secret (Private / Server-Only)
              </label>
              <input
                type="password"
                placeholder="Enter App Secret"
                value={appSecretInput}
                onChange={(e) => setAppSecretInput(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-2.5 bg-gray-50 dark:bg-[#22263a] border border-gray-300 dark:border-[#3d4166] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:bg-white dark:focus:bg-[#22263a] focus:border-blue-500 outline-none transition"
              />
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                Mapped to <code className="text-gray-600 dark:text-gray-400">NEXCONN_APP_SECRET</code>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Server API Base URL / Region
              </label>
              <select
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-[#22263a] border border-gray-300 dark:border-[#3d4166] text-gray-900 dark:text-gray-100 rounded-xl focus:bg-white dark:focus:bg-[#22263a] focus:border-blue-500 outline-none transition cursor-pointer"
              >
                <option value="api.sg-light-api.com">Singapore (api.sg-light-api.com) - Default</option>
                <option value="api.us-light-api.com">North America (api.us-light-api.com)</option>
                <option value="api.sau-light-api.com">Saudi Arabia (api.sau-light-api.com)</option>
              </select>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Saved successfully! Connecting to Nexconn Chat...</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCredentialsModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22263a] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save & Connect'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
