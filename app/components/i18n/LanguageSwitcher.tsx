'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/contexts/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'compact' | 'full';
  className?: string;
  onLanguageChange?: (code: LanguageCode, persist?: boolean) => Promise<void> | void;
}

const RECENT_STORAGE_KEY = 'ar_recent_languages';

export default function LanguageSwitcher({ variant = 'dropdown', className = '', onLanguageChange }: LanguageSwitcherProps) {
  const { language, languageInfo, changeLanguage, isLoading, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLanguages, setRecentLanguages] = useState<LanguageCode[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = SUPPORTED_LANGUAGES.filter((l) =>
    l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LanguageCode[];
        setRecentLanguages(parsed.filter((code): code is LanguageCode => SUPPORTED_LANGUAGES.some((item) => item.code === code)));
      } catch {
        window.localStorage.removeItem(RECENT_STORAGE_KEY);
      }
    }
  }, []);

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
      await onLanguageChange(code, false);
    } else {
      await changeLanguage(code);
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

  const renderLanguageItem = (lang: (typeof SUPPORTED_LANGUAGES)[number]) => (
    <button
      key={lang.code}
      role="option"
      aria-selected={lang.code === language}
      onClick={() => handleSelect(lang.code)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-start group ${
        lang.code === language ? 'bg-[#00E5FF]/5' : ''
      }`}
    >
      <span className="text-lg">{lang.flag}</span>
      <div className="flex-1">
        <p className={`text-sm font-medium ${lang.code === language ? 'text-[#00E5FF]' : 'text-[#F5F7FA]'}`}>
          {lang.nativeName}
        </p>
        <p className="text-xs text-[#9AA5B1]">{lang.englishName}</p>
      </div>
      {lang.direction === 'rtl' && (
        <span className="text-xs text-[#9AA5B1] bg-white/5 px-1.5 py-0.5 rounded">RTL</span>
      )}
      {lang.code === language && (
        <svg className="w-4 h-4 text-[#00E5FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );

  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          id="language-switcher-compact"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={t('common.language')}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-[#9AA5B1] hover:text-[#F5F7FA] hover:bg-white/5 transition-all duration-200"
          disabled={isLoading}
        >
          <span className="text-base">{languageInfo.flag}</span>
          <span className="hidden sm:block">{languageInfo.code.toUpperCase()}</span>
          <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            role="listbox"
            aria-label={t('common.language')}
            className="absolute bottom-full mb-2 end-0 w-56 bg-[#0D1117] border border-[#1E293B] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="p-2 border-b border-[#1E293B]">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="w-full bg-white/5 text-[#F5F7FA] placeholder-[#9AA5B1] text-sm px-3 py-1.5 rounded-lg outline-none border border-transparent focus:border-[#00E5FF]/30"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {recentLanguages.length > 0 && (
                <div className="px-3 py-2 border-b border-[#1E293B]">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#9AA5B1]">{t('settings.language')}</p>
                  <div className="mt-2 space-y-1">
                    {recentLanguages.map((code) => {
                      const lang = SUPPORTED_LANGUAGES.find((item) => item.code === code);
                      return lang ? renderLanguageItem(lang) : null;
                    })}
                  </div>
                </div>
              )}
              {filtered.map((lang) => renderLanguageItem(lang))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        id="language-switcher-dropdown"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('common.language')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isLoading}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-[#1E293B] hover:border-[#00E5FF]/30 hover:bg-white/8 transition-all duration-200 group"
      >
        <span className="text-xl">{languageInfo.flag}</span>
        <div className="flex-1 text-start">
          <p className="text-sm font-semibold text-[#F5F7FA]">{languageInfo.nativeName}</p>
          <p className="text-xs text-[#9AA5B1]">{languageInfo.englishName}</p>
        </div>
        {isLoading ? (
          <svg className="w-4 h-4 text-[#00E5FF] animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className={`w-4 h-4 text-[#9AA5B1] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('common.language')}
          className="absolute top-full mt-2 start-0 end-0 bg-[#0D1117] border border-[#1E293B] rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:mt-0 max-md:rounded-t-2xl max-md:max-h-[72vh]"
        >
          <div className="p-2 border-b border-[#1E293B]">
            <div className="relative">
              <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9AA5B1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="w-full bg-white/5 text-[#F5F7FA] placeholder-[#9AA5B1] text-sm ps-9 pe-3 py-2 rounded-lg outline-none border border-transparent focus:border-[#00E5FF]/30"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto max-md:max-h-[50vh]">
            {recentLanguages.length > 0 && (
              <div className="px-3 py-2 border-b border-[#1E293B]">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#9AA5B1]">{t('settings.language')}</p>
                <div className="mt-2 space-y-1">
                  {recentLanguages.map((code) => {
                    const lang = SUPPORTED_LANGUAGES.find((item) => item.code === code);
                    return lang ? renderLanguageItem(lang) : null;
                  })}
                </div>
              </div>
            )}
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-[#9AA5B1] py-4">{t('common.noData')}</p>
            ) : (
              filtered.map((lang) => renderLanguageItem(lang))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
