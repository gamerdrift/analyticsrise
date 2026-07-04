'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/i18n';
import UserService from '@/lib/services/user';
import { logger } from '@/lib/utils/logger';
import {
  Globe,
  User,
  Clock,
  Save,
  RotateCcw,
  Sparkles,
  Check,
  Star,
  Search
} from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'ar_favorite_languages';

export default function SettingsView() {
  const { userProfile } = useAuth();
  const { language, languageInfo, changeLanguage, resetToBrowserDefault, t } = useLanguage();

  // Local state for profile settings
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [timezone, setTimezone] = useState(userProfile?.timezone || 'UTC');

  // i18n specific states
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<LanguageCode[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state with userProfile
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setTimezone(userProfile.timezone || 'UTC');
    }
  }, [userProfile]);

  // Load favorites
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        try {
          setFavorites(JSON.parse(stored) as LanguageCode[]);
        } catch {
          window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
        }
      }
    }
  }, []);

  // Filtered languages for grid
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: favorites first, then alphabetically by English name
  const sortedLanguages = [...filteredLanguages].sort((a, b) => {
    const aFav = favorites.includes(a.code);
    const bFav = favorites.includes(b.code);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.englishName.localeCompare(b.englishName);
  });

  const toggleFavorite = (code: LanguageCode, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = favorites.includes(code)
      ? favorites.filter((c) => c !== code)
      : [...favorites, code];
    setFavorites(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const handleSaveSettings = async () => {
    if (!userProfile?.uid) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // 1. Update general profile fields
      // 2. Persist active language preference
      await changeLanguage(selectedLanguage, true);
      await UserService.updateUserProfile(userProfile.uid, {
        displayName,
        timezone,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      logger.info('User settings updated successfully');
    } catch (err) {
      logger.error('Failed saving user settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    await resetToBrowserDefault();
    setSelectedLanguage(language);
  };

  // Live formatting preview calculations
  const previewDate = new Date();
  const previewXP = 12500;
  const previewPercent = 78.5;
  const previewCurrency = 250;

  // Selected language info object for formatting preview
  const selectedLangInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || languageInfo;

  // Helper formatting for live preview based on selectedLangInfo locale/currency
  const getPreviewFormattedDate = () => {
    return new Intl.DateTimeFormat(selectedLangInfo.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(previewDate);
  };

  const getPreviewFormattedTime = () => {
    return new Intl.DateTimeFormat(selectedLangInfo.locale, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(previewDate);
  };

  const getPreviewFormattedNumber = () => {
    return new Intl.NumberFormat(selectedLangInfo.locale).format(previewXP);
  };

  const getPreviewFormattedPercent = () => {
    return new Intl.NumberFormat(selectedLangInfo.locale, {
      style: 'percent',
      maximumFractionDigits: 1
    }).format(previewPercent / 100);
  };

  const getPreviewFormattedCurrency = () => {
    return new Intl.NumberFormat(selectedLangInfo.locale, {
      style: 'currency',
      currency: selectedLangInfo.currency,
      maximumFractionDigits: 0
    }).format(previewCurrency);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-xl glass-panel relative overflow-hidden neon-glow-card"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00E5FF]/10 via-[#4FC3F7]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />

        <div className="relative z-10">
          <span className="px-2 py-0.5 text-[9px] font-mono border border-[#00E5FF]/30 text-[#00E5FF] rounded bg-[#00E5FF]/5 uppercase tracking-widest">
            Configuration Panel
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-3 text-white tracking-wide font-display uppercase">
            {t('settings.title')}
          </h1>
          <p className="text-slate-400 max-w-2xl mt-1 text-xs md:text-sm leading-relaxed">
            {t('settings.subtitle')}
          </p>
        </div>
      </motion.div>

      {/* Main Settings Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Columns: Profile & Languages */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/50 space-y-6"
          >
            <h2 className="text-sm font-bold text-white font-display uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4 text-[#00E5FF]" />
              {t('settings.profile')}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  {t('settings.displayName')}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-[#00E5FF]/50 text-white rounded-lg px-4 py-2.5 text-xs font-mono outline-none transition-all"
                  placeholder="Enter name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-[#00E5FF]/50 text-white rounded-lg px-4 py-2.5 text-xs font-mono outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="UTC">UTC / Coordinated Universal Time</option>
                    <option value="America/New_York">EST / New York (UTC-5)</option>
                    <option value="Europe/London">GMT / London (UTC+0)</option>
                    <option value="Europe/Paris">CET / Paris (UTC+1)</option>
                    <option value="Asia/Kolkata">IST / India (UTC+5:30)</option>
                    <option value="Asia/Riyadh">AST / Riyadh (UTC+3)</option>
                    <option value="Asia/Tokyo">JST / Tokyo (UTC+9)</option>
                    <option value="Asia/Shanghai">CST / Shanghai (UTC+8)</option>
                  </select>
                  <Clock className="w-4 h-4 text-slate-500 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Language Selection Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/50 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-sm font-bold text-white font-display uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00E5FF]" />
                {t('settings.languageSection')}
              </h2>

              {/* Search languages */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-[#00E5FF]/30 text-white text-xs font-mono ps-9 pe-4 py-2 rounded-lg outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
              {sortedLanguages.map((lang) => {
                const isActive = selectedLanguage === lang.code;
                const isFav = favorites.includes(lang.code);

                return (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-start transition-all duration-200 group relative ${
                      isActive
                        ? 'border-[#00E5FF]/50 bg-[#00E5FF]/5 shadow-[0_0_12px_rgba(0,229,255,0.05)]'
                        : 'border-slate-850 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Active Border Glow overlay */}
                    {isActive && (
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />
                    )}

                    {/* Flag badge */}
                    <span className="text-2xl shrink-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                      {lang.flag}
                    </span>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          isActive ? 'text-[#00E5FF]' : 'text-white'
                        }`}
                      >
                        {lang.nativeName}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {lang.englishName}
                      </p>
                    </div>

                    {/* Indicators */}
                    <div className="flex items-center gap-2 shrink-0">
                      {lang.direction === 'rtl' && (
                        <span className="text-[8px] font-mono text-slate-500 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded uppercase">
                          RTL
                        </span>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(lang.code, e)}
                        className={`p-1 rounded hover:bg-white/5 transition-colors ${
                          isFav ? 'text-[#FFC400]' : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Bookmark as favorite'}
                      >
                        <Star className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} />
                      </button>

                      {/* Active Tick */}
                      {isActive && (
                        <div className="w-4 h-4 rounded-full bg-[#00E5FF]/20 flex items-center justify-center border border-[#00E5FF]/30">
                          <Check className="w-2.5 h-2.5 text-[#00E5FF]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Region Preview & Actions */}
        <div className="space-y-8">
          {/* Live Localization Telemetry Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border border-slate-800 bg-[#0D1117]/60 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent" />

            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              {t('settings.regionSection')}
            </h3>
            <span className="text-[8px] font-mono text-slate-500 uppercase block mb-6">
              Localization Telemetry Preview
            </span>

            {/* Simulated Live preview data */}
            <div className="space-y-4 font-mono text-[10px]">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-850">
                <span className="text-slate-500 uppercase tracking-wider block text-[8px]">
                  {t('settings.dateFormat')}
                </span>
                <span className="text-white font-bold block mt-1">
                  {getPreviewFormattedDate()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-850">
                <span className="text-slate-500 uppercase tracking-wider block text-[8px]">
                  Relative System Time
                </span>
                <span className="text-white font-bold block mt-1">
                  {getPreviewFormattedTime()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-850">
                <span className="text-slate-500 uppercase tracking-wider block text-[8px]">
                  {t('settings.numberFormat')} (XP Count)
                </span>
                <span className="text-white font-bold block mt-1">
                  {getPreviewFormattedNumber()} XP
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-850">
                <span className="text-slate-500 uppercase tracking-wider block text-[8px]">
                  Relative Progress Rate
                </span>
                <span className="text-white font-bold block mt-1">
                  {getPreviewFormattedPercent()}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-850">
                <span className="text-slate-500 uppercase tracking-wider block text-[8px]">
                  {t('settings.currency')} Preview (Tuition Fees)
                </span>
                <span className="text-white font-bold block mt-1">
                  {getPreviewFormattedCurrency()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#00E5FF] hover:bg-[#00E5FF]/90 disabled:opacity-50 text-[#05070B] text-xs font-bold font-mono uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all cursor-pointer"
            >
              {isSaving ? (
                <svg className="w-4 h-4 animate-spin text-[#05070B]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Processing...' : t('settings.saveChanges')}
            </button>

            <button
              onClick={handleResetToDefault}
              className="w-full flex items-center justify-center gap-2 py-3 border border-slate-800 hover:border-slate-700 bg-slate-900/20 text-slate-400 hover:text-white text-xs font-bold font-mono uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Default
            </button>

            {saveSuccess && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold mt-2"
              >
                {t('settings.changesSaved')}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
