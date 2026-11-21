'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS, getUserById } from '@/data/mockData';
import { useChat } from '@/context/ChatContext';
import {
  MessageSquare,
  Search,
  Star,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Audio', 'Furniture', 'Displays', 'Photography', 'Workspace'];

export default function MarketplacePage() {
  const { openDirectChat, currentUser, preferredLanguage } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50/70 dark:bg-[#0f1117] pb-20 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/80 via-white to-gray-50/70 dark:from-[#161a29] dark:via-[#12141f] dark:to-[#0f1117] pt-10 pb-12 border-b border-gray-200 dark:border-[#2d3148] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 border border-blue-200/50 dark:border-blue-800/50">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by Nexconn Chat SDK for Web</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                Curated Marketplace with{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Real-Time Translated Chat
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Browse premium workspace gear, electronics, and studio gear. Connect directly with verified sellers
                through instant 1:1 messaging with automatic multi-language translation or contact customer support anytime.
              </p>

              {/* Status Banner */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Buyer Protection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Sub-second Nexconn Messaging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Multi-Language Live Translation</span>
                </div>
              </div>
            </div>

            {/* Test Role Quick Info Box */}
            <div className="w-full md:w-80 bg-white dark:bg-[#1a1d27] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2d3148] shadow-md dark:shadow-black/40 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2d3148]">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Session
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    currentUser.role === 'buyer'
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : currentUser.role === 'seller'
                      ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300'
                      : 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>

              <div className="flex items-center gap-3 my-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                />
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#12141f] p-2.5 rounded-xl border border-gray-100 dark:border-[#2d3148]">
                Switch users via top-right menu to simulate conversations between Buyer & Seller in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Browse Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls: Search, Categories, Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#1a1d27] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22263a] border border-gray-200 dark:border-[#2d3148]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2 bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3148] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 outline-none shadow-xs transition"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-low' | 'price-high' | 'rating')}
              className="text-xs bg-white dark:bg-[#1a1d27] border border-gray-200 dark:border-[#2d3148] rounded-xl px-3 py-2 outline-none shadow-xs text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const seller = getUserById(product.sellerId);
            const isMyProduct = currentUser.id === product.sellerId;

            return (
              <div
                key={product.id}
                className="group bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-200/90 dark:border-[#2d3148] hover:border-blue-300 dark:hover:border-blue-500 shadow-xs hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative aspect-4/3 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-gray-900/90 backdrop-blur px-2 py-0.5 rounded-full text-gray-800 dark:text-gray-200 shadow-xs">
                      {product.condition}
                    </span>
                    <span className="text-[10px] font-medium bg-blue-600/90 backdrop-blur text-white px-2 py-0.5 rounded-full shadow-xs">
                      {product.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-300">({product.reviewCount})</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Price & Title */}
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.inStock && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">In Stock</span>
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {product.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Seller & CTA Action */}
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#2d3148]">
                    {/* Seller Bar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={seller?.avatar}
                          alt={seller?.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {seller?.name}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                            {seller?.badge || 'Merchant'}
                          </p>
                        </div>
                      </div>

                      {isMyProduct && (
                        <span className="text-[10px] bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-medium">
                          Your Listing
                        </span>
                      )}
                    </div>

                    {/* Chat with Seller CTA Button */}
                    <button
                      onClick={() => openDirectChat(product.sellerId, product)}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-200 group-hover/btn:scale-110 transition-transform" />
                      <span>Chat with Seller</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#1a1d27] rounded-2xl border border-gray-200 dark:border-[#2d3148] p-8">
            <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No products found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search query or selecting a different category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
