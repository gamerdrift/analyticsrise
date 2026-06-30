'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/contexts/LanguageContext';

/**
 * BrowserLanguageBanner
 *
 * Appears when the user's browser language differs from the current interface
 * language and a supported translation is available. Lets the user switch or
 * dismiss permanently for the session.
 */
export default function BrowserLanguageBanner() {
  const { browserLanguageSuggestion, changeLanguage, dismissBrowserSuggestion, t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (browserLanguageSuggestion) {
      // Short delay so it slides in after page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [browserLanguageSuggestion]);

  if (!browserLanguageSuggestion || !visible) return null;

  const suggestedLang = SUPPORTED_LANGUAGES.find(l => l.code === browserLanguageSuggestion);
  if (!suggestedLang) return null;

  const handleSwitch = async () => {
    animateOut();
    await changeLanguage(browserLanguageSuggestion as LanguageCode);
  };

  const handleDismiss = () => {
    animateOut();
    setTimeout(dismissBrowserSuggestion, 300);
  };

  const animateOut = (): void => {
    setLeaving(true);
    setTimeout(() => setVisible(false), 300);
  };

  const suggestion = t('dashboard.languageSwitchSuggestion', {
    language: suggestedLang.nativeName,
  });

  return (
    <div
      role="banner"
      aria-live="polite"
      aria-label="Language suggestion"
      className={`fixed bottom-6 start-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        leaving
          ? 'opacity-0 translate-y-4 pointer-events-none'
          : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex items-center gap-3 bg-[#0D1117]/95 backdrop-blur-xl border border-[#00E5FF]/20 rounded-2xl px-5 py-3.5 shadow-2xl shadow-black/60 max-w-sm">
        {/* Flag */}
        <span className="text-2xl flex-shrink-0">{suggestedLang.flag}</span>

        {/* Message */}
        <p className="text-sm text-[#9AA5B1] flex-1 leading-snug">
          {suggestion}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            id="language-banner-switch"
            onClick={handleSwitch}
            className="px-3 py-1.5 bg-[#00E5FF] text-[#05070B] text-xs font-bold rounded-lg hover:bg-[#00E5FF]/90 transition-all duration-200 hover:shadow-[0_0_12px_rgba(0,229,255,0.4)]"
          >
            {t('dashboard.switchLanguage')}
          </button>
          <button
            id="language-banner-dismiss"
            onClick={handleDismiss}
            aria-label="Dismiss language suggestion"
            className="p-1.5 text-[#9AA5B1] hover:text-[#F5F7FA] hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
