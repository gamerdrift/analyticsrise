'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles, ArrowRight, BookOpen, Database, Award, Briefcase, Building2 } from 'lucide-react';
import { GlobalSearchService, SearchResultItem } from '@/lib/services/globalSearchService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  if (!isOpen) return null;

  const results = GlobalSearchService.search(query, categoryFilter);

  return (
    <div className="fixed inset-0 z-[140] flex items-start justify-center pt-20 p-4 sm:p-6 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-[#05070B]/85 backdrop-blur-xl" />

      <div className="relative w-full max-w-2xl bg-[#0D1117]/95 border border-[#00E5FF]/40 rounded-3xl p-6 shadow-2xl shadow-[#00E5FF]/10 z-10 space-y-4">
        {/* Search Input Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#00E5FF]" />
            <input
              type="text"
              autoFocus
              placeholder="Search across courses, simulators, jobs, companies, AI Mentor..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500 font-sans"
            />
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[10px] font-black uppercase">
          {['all', 'simulator', 'course', 'certification', 'job', 'company', 'ai_mentor'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="space-y-2 max-h-96 overflow-y-auto pt-2">
          {results.length > 0 ? (
            results.map((res) => (
              <Link
                key={res.id}
                href={res.targetRoute}
                onClick={onClose}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between gap-4 block"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white">{res.title}</h4>
                    {res.badge && (
                      <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF]">
                        {res.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{res.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#00E5FF] shrink-0" />
              </Link>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching search results found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
