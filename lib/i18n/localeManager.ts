'use client';

export interface LocaleConfig {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
}

export const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  en: { code: 'en', name: 'English (US)', currency: 'USD', currencySymbol: '$', dateFormat: 'MM/DD/YYYY' },
  uk: { code: 'uk', name: 'English (UK)', currency: 'GBP', currencySymbol: '£', dateFormat: 'DD/MM/YYYY' },
  eu: { code: 'eu', name: 'English (EU)', currency: 'EUR', currencySymbol: '€', dateFormat: 'DD.MM.YYYY' },
  in: { code: 'in', name: 'English (IN)', currency: 'INR', currencySymbol: '₹', dateFormat: 'DD/MM/YYYY' },
};

export class LocaleManager {
  static getLocale(code: string = 'en'): LocaleConfig {
    return SUPPORTED_LOCALES[code] || SUPPORTED_LOCALES.en;
  }

  static formatCurrency(amount: number, localeCode: string = 'en'): string {
    const loc = this.getLocale(localeCode);
    return `${loc.currencySymbol}${amount.toLocaleString()}`;
  }

  static getTimeZone(): string {
    if (typeof Intl !== 'undefined') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return 'UTC';
  }
}
