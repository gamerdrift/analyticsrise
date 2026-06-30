'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { logger } from '@/lib/utils/logger';

// ─── Supported Languages ──────────────────────────────────────────────────────

export type LanguageCode =
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt'
  | 'hi' | 'ar' | 'zh' | 'ja' | 'ko' | 'ru';

export type TextDirection = 'ltr' | 'rtl';

export interface SupportedLanguage {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flag: string;
  direction: TextDirection;
  currency: string;
  locale: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', nativeName: 'English',    englishName: 'English',             flag: '🇺🇸', direction: 'ltr', currency: 'USD', locale: 'en-US' },
  { code: 'es', nativeName: 'Español',    englishName: 'Spanish',             flag: '🇪🇸', direction: 'ltr', currency: 'EUR', locale: 'es-ES' },
  { code: 'fr', nativeName: 'Français',   englishName: 'French',              flag: '🇫🇷', direction: 'ltr', currency: 'EUR', locale: 'fr-FR' },
  { code: 'de', nativeName: 'Deutsch',    englishName: 'German',              flag: '🇩🇪', direction: 'ltr', currency: 'EUR', locale: 'de-DE' },
  { code: 'it', nativeName: 'Italiano',   englishName: 'Italian',             flag: '🇮🇹', direction: 'ltr', currency: 'EUR', locale: 'it-IT' },
  { code: 'pt', nativeName: 'Português',  englishName: 'Portuguese',          flag: '🇧🇷', direction: 'ltr', currency: 'BRL', locale: 'pt-BR' },
  { code: 'hi', nativeName: 'हिन्दी',      englishName: 'Hindi',               flag: '🇮🇳', direction: 'ltr', currency: 'INR', locale: 'hi-IN' },
  { code: 'ar', nativeName: 'العربية',    englishName: 'Arabic',              flag: '🇸🇦', direction: 'rtl', currency: 'SAR', locale: 'ar-SA' },
  { code: 'zh', nativeName: '中文（简体）', englishName: 'Chinese (Simplified)', flag: '🇨🇳', direction: 'ltr', currency: 'CNY', locale: 'zh-CN' },
  { code: 'ja', nativeName: '日本語',      englishName: 'Japanese',            flag: '🇯🇵', direction: 'ltr', currency: 'JPY', locale: 'ja-JP' },
  { code: 'ko', nativeName: '한국어',      englishName: 'Korean',              flag: '🇰🇷', direction: 'ltr', currency: 'KRW', locale: 'ko-KR' },
  { code: 'ru', nativeName: 'Русский',    englishName: 'Russian',             flag: '🇷🇺', direction: 'ltr', currency: 'RUB', locale: 'ru-RU' },
];

const SUPPORTED_CODES = SUPPORTED_LANGUAGES.map(l => l.code);
const RTL_LANGUAGES: LanguageCode[] = ['ar'];
const STORAGE_KEY = 'ar_language';
const DEFAULT_LANGUAGE: LanguageCode = 'en';

// ─── Context Type ─────────────────────────────────────────────────────────────

export interface LanguageContextType {
  language: LanguageCode;
  direction: TextDirection;
  languageInfo: SupportedLanguage;
  translations: Record<string, any>;
  isLoading: boolean;
  browserLanguageSuggestion: LanguageCode | null;
  t: (key: string, params?: Record<string, string | number>) => string;
  changeLanguage: (code: LanguageCode, persist?: boolean) => Promise<void>;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatPercent: (value: number) => string;
  formatCurrency: (value: number, currencyOverride?: string) => string;
  getSupportedLanguages: () => SupportedLanguage[];
  dismissBrowserSuggestion: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ─── Translation Cache ────────────────────────────────────────────────────────

const translationCache: Record<string, Record<string, any>> = {};

async function loadTranslations(lang: LanguageCode): Promise<Record<string, any>> {
  if (translationCache[lang]) {
    return translationCache[lang];
  }

  try {
    const mod = await import(`@/lib/i18n/locales/${lang}.json`);
    const translations = mod.default || mod;
    translationCache[lang] = translations;
    return translations;
  } catch {
    logger.warn(`Failed to load translations for "${lang}", falling back to English.`);
    if (lang !== 'en') {
      return loadTranslations('en');
    }
    return {};
  }
}

// ─── Key Resolver (dot notation) ─────────────────────────────────────────────

function resolveKey(translations: Record<string, any>, key: string): string | undefined {
  const parts = key.split('.');
  let current: any = translations;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

// ─── Browser Language Detection ───────────────────────────────────────────────

function detectBrowserLanguage(): LanguageCode | null {
  if (typeof navigator === 'undefined') return null;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const lang of langs) {
    const code = lang.split('-')[0] as LanguageCode;
    if (SUPPORTED_CODES.includes(code)) return code;
  }
  return null;
}

function getStoredLanguage(): LanguageCode | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_CODES.includes(stored as LanguageCode)) {
    return stored as LanguageCode;
  }
  return null;
}

function applyDocumentAttributes(lang: LanguageCode, direction: TextDirection) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang;
  document.documentElement.dir = direction;
  // Add/remove RTL class for components that rely on it
  if (direction === 'rtl') {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [browserLanguageSuggestion, setBrowserLanguageSuggestion] = useState<LanguageCode | null>(null);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);

  const languageInfo = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const direction: TextDirection = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

  // ── Initial Load ────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // 1. Check localStorage for saved preference
        const stored = getStoredLanguage();
        const initialLang = stored || DEFAULT_LANGUAGE;

        // 2. Load translations
        const t = await loadTranslations(initialLang);
        setTranslations(t);
        setLanguage(initialLang);
        applyDocumentAttributes(initialLang, RTL_LANGUAGES.includes(initialLang) ? 'rtl' : 'ltr');

        // 3. Browser language detection (suggestion only)
        if (!stored && !suggestionDismissed) {
          const detected = detectBrowserLanguage();
          if (detected && detected !== DEFAULT_LANGUAGE && detected !== initialLang) {
            setBrowserLanguageSuggestion(detected);
          }
        }
      } catch (err) {
        logger.error('LanguageProvider init failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Change Language ─────────────────────────────────────────────────────────
  const changeLanguage = useCallback(async (code: LanguageCode, persist = true) => {
    if (code === language) return;
    setIsLoading(true);
    try {
      const t = await loadTranslations(code);
      const dir: TextDirection = RTL_LANGUAGES.includes(code) ? 'rtl' : 'ltr';
      setTranslations(t);
      setLanguage(code);
      applyDocumentAttributes(code, dir);
      if (persist && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, code);
      }
      // Clear browser suggestion once they switch
      if (browserLanguageSuggestion) setBrowserLanguageSuggestion(null);
      logger.debug(`Language changed to: ${code}`);
    } catch (err) {
      logger.error('Failed to change language:', err);
    } finally {
      setIsLoading(false);
    }
  }, [language, browserLanguageSuggestion]);

  // ── Translation Function ────────────────────────────────────────────────────
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const value = resolveKey(translations, key);
    if (value === undefined) {
      logger.warn(`Missing translation key: "${key}" for language "${language}"`);
      return key;
    }
    if (!params) return value;
    // Interpolate {placeholder} tokens
    return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
  }, [translations, language]);

  // ── Formatters ──────────────────────────────────────────────────────────────
  const formatDate = useCallback((
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(languageInfo.locale, {
      year: 'numeric', month: 'long', day: 'numeric',
      ...options,
    }).format(d);
  }, [languageInfo.locale]);

  const formatTime = useCallback((
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(languageInfo.locale, {
      hour: '2-digit', minute: '2-digit',
      ...options,
    }).format(d);
  }, [languageInfo.locale]);

  const formatNumber = useCallback((
    value: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    return new Intl.NumberFormat(languageInfo.locale, options).format(value);
  }, [languageInfo.locale]);

  const formatPercent = useCallback((value: number): string => {
    return new Intl.NumberFormat(languageInfo.locale, {
      style: 'percent', maximumFractionDigits: 1,
    }).format(value / 100);
  }, [languageInfo.locale]);

  const formatCurrency = useCallback((value: number, currencyOverride?: string): string => {
    return new Intl.NumberFormat(languageInfo.locale, {
      style: 'currency',
      currency: currencyOverride || languageInfo.currency,
      maximumFractionDigits: 0,
    }).format(value);
  }, [languageInfo.locale, languageInfo.currency]);

  const getSupportedLanguages = useCallback(() => SUPPORTED_LANGUAGES, []);

  const dismissBrowserSuggestion = useCallback(() => {
    setBrowserLanguageSuggestion(null);
    setSuggestionDismissed(true);
  }, []);

  const value: LanguageContextType = {
    language,
    direction,
    languageInfo,
    translations,
    isLoading,
    browserLanguageSuggestion,
    t,
    changeLanguage,
    formatDate,
    formatTime,
    formatNumber,
    formatPercent,
    formatCurrency,
    getSupportedLanguages,
    dismissBrowserSuggestion,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

// Convenience alias
export const useTranslation = useLanguage;

export default LanguageProvider;
