'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/contexts/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'compact' | 'full';
  className?: string;
  onLanguageChange?: (code: LanguageCode, persist?: boolean) => Promise<void> | void;
}

const RECENT_STORAGE_KEY = 'ar_recent_languages';

export default function LanguageSwitcher({
  variant = 'compact',
  className = '',
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { language, languageInfo, changeLanguage, isLoading, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLanguages, setRecentLanguages] = useState<LanguageCode[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Click outside to close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load recently selected languages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LanguageCode[];
        setRecentLanguages(
          parsed.filter((code): code is LanguageCode =>
            SUPPORTED_LANGUAGES.some((item) => item.code === code)
          )
        );
      } catch {
        window.localStorage.removeItem(RECENT_STORAGE_KEY);
      }
    }
  }, []);

  // Auto-focus search field on open
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const persistRecentLanguages = (code: LanguageCode) => {
    const next = [code, ...recentLanguages.filter((item) => item !== code)].slice(0, 4);
    setRecentLanguages(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const handleSelect = async (code: LanguageCode) => {
    persistRecentLanguages(code);
    if (onLanguageChange) {
      await onLanguageChange(code, true);
    } else {
      await changeLanguage(code, true);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const renderLanguageItem = (lang: (typeof SUPPORTED_LANGUAGES)[number]) => {
    const isSelected = lang.code === language;
    return (
      <button
        key={lang.code}
        role="option"
        aria-selected={isSelected}
        onClick={() => handleSelect(lang.code)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-start group cursor-pointer ${
          isSelected
            ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-semibold border-s-2 border-[#00E5FF]'
            : 'text-[#F5F7FA] hover:bg-white/5 hover:text-[#00E5FF]'
        }`}
      >
        <span className="text-lg">{lang.flag}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate ${isSelected ? 'text-[#00E5FF] font-bold' : 'text-[#F5F7FA] group-hover:text-[#00E5FF]'}`}>
            {lang.nativeName}
          </p>
          <p className="text-xs text-slate-400 truncate">{lang.englishName}</p>
        </div>
        {lang.direction === 'rtl' && (
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
            RTL
          </span>
        )}
        {isSelected && (
          <svg className="w-4 h-4 text-[#00E5FF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`} onKeyDown={handleKeyDown}>
      {/* Selector Toggle Button */}
      <button
        id="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('common.language')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0D1117]/90 border border-[#1E293B] hover:border-[#00E5FF]/50 hover:bg-[#161B22] text-[#F5F7FA] shadow-lg shadow-black/40 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 cursor-pointer"
      >
        <span className="text-base flex-shrink-0">{languageInfo.flag}</span>
        <span className="text-xs font-semibold tracking-wide text-[#F5F7FA] group-hover:text-[#00E5FF] transition-colors max-w-[110px] truncate">
          {languageInfo.nativeName}
        </span>
        {isLoading ? (
          <svg className="w-3.5 h-3.5 text-[#00E5FF] animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg
            className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#00E5FF] transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180 text-[#00E5FF]' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Animated Dropdown Menu Below Button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label={t('common.language')}
            className="absolute top-full mt-2 end-0 w-64 bg-[#0D1117] border border-[#1E293B] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-[100] max-md:fixed max-md:inset-x-4 max-md:top-auto max-md:bottom-4 max-md:w-auto max-md:max-h-[75vh]"
          >
            {/* Search Input Header */}
            <div className="p-3 border-b border-[#1E293B] bg-[#161B22]/50">
              <div className="relative">
                <svg
                  className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.search') || 'Search language...'}
                  className="w-full bg-[#05070B] text-[#F5F7FA] placeholder-slate-500 text-xs ps-9 pe-3 py-2 rounded-xl outline-none border border-[#1E293B] focus:border-[#00E5FF]/60 transition-colors"
                />
              </div>
            </div>

            {/* Language Options List */}
            <div className="max-h-64 overflow-y-auto py-1 custom-scrollbar">
              {recentLanguages.length > 0 && searchQuery === '' && (
                <div className="px-3 py-1.5 border-b border-[#1E293B]/60">
                  <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 px-1 mb-1">
                    Recently Used
                  </p>
                  <div className="space-y-0.5">
                    {recentLanguages.map((code) => {
                      const lang = SUPPORTED_LANGUAGES.find((item) => item.code === code);
                      return lang ? renderLanguageItem(lang) : null;
                    })}
                  </div>
                </div>
              )}

              {filtered.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-4">No languages found</p>
              ) : (
                filtered.map((lang) => renderLanguageItem(lang))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
