/**
 * i18n barrel exports
 *
 * Import everything you need from here:
 *   import { useLanguage, useTranslation, LanguageProvider, SUPPORTED_LANGUAGES } from '@/lib/i18n';
 */

export {
  LanguageProvider,
  useLanguage,
  useTranslation,
  SUPPORTED_LANGUAGES,
} from '@/lib/contexts/LanguageContext';

export type {
  LanguageCode,
  TextDirection,
  SupportedLanguage,
  LanguageContextType,
} from '@/lib/contexts/LanguageContext';
