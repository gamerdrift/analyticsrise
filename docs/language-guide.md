# Language and Region Formatting Guide

> AnalyticsRise i18n Framework | Sprint 3.4

This guide details the localization standards for numbers, percentages, dates, and times across the 12 supported languages.

---

## Supported Languages (Phase 1)

| Code | Native Name | Script | Direction | Locale Target | Currency |
|------|-------------|--------|-----------|---------------|----------|
| `en` | English | Latin | LTR | `en-US` | USD ($) |
| `es` | Español | Latin | LTR | `es-ES` | EUR (€) |
| `fr` | Français | Latin | LTR | `fr-FR` | EUR (€) |
| `de` | Deutsch | Latin | LTR | `de-DE` | EUR (€) |
| `it` | Italiano | Latin | LTR | `it-IT` | EUR (€) |
| `pt` | Português | Latin | LTR | `pt-BR` | BRL (R$) |
| `hi` | हिन्दी | Devanagari | LTR | `hi-IN` | INR (₹) |
| `ar` | العربية | Arabic | **RTL** | `ar-SA` | SAR (ر.س) |
| `zh` | 中文 (简体) | Han (Simplified) | LTR | `zh-CN` | CNY (¥) |
| `ja` | 日本語 | Japanese | LTR | `ja-JP` | JPY (¥) |
| `ko` | 한국어 | Hangul | LTR | `ko-KR` | KRW (₩) |
| `ru` | Русский | Cyrillic | LTR | `ru-RU` | RUB (₽) |

---

## Formatting Standards

All locale formatting is handled client-side using browser-native `Intl` APIs under `LanguageContext.tsx`.

### 1. Dates (`formatDate`)
Formatted to display the long calendar representations (e.g. Day Month Year):
- **English (`en-US`)**: July 4, 2026
- **Spanish (`es-ES`)**: 4 de julio de 2026
- **German (`de-DE`)**: 4. Juli 2026
- **Arabic (`ar-SA`)**: ٤ يوليو ٢٠٢٦
- **Japanese (`ja-JP`)**: 2026年7月4일 (or 2026年7月4日 depending on calendar settings)

### 2. Time (`formatTime`)
Displays 24-hour clock or 12-hour AM/PM representations matching the locale default:
- **English (`en-US`)**: 12:30 PM
- **French (`fr-FR`)**: 12:30
- **Arabic (`ar-SA`)**: ١٢:٣٠ م

### 3. Numbers (`formatNumber`)
Converts long digits into locale-specific numbering decimal separators (e.g. for XP points):
- **English (`en-US`)**: 12,500 XP
- **German (`de-DE`)**: 12.500 XP
- **French (`fr-FR`)**: 12 500 XP
- **Arabic (`ar-SA`)**: ١٢٬٥٠٠ XP

### 4. Percentages (`formatPercent`)
Displays progress completed metrics (e.g. course progress):
- **English (`en-US`)**: 78.5%
- **French (`fr-FR`)**: 78,5 %
- **Arabic (`ar-SA`)**: ٧٨٫٥٪
- **Turkish (`tr-TR` - future)**: %78,5

### 5. Currency (`formatCurrency`)
Formats tuition fees and plan options:
- **English (`en-US`)**: $250
- **Spanish (`es-ES`)**: 250,00 €
- **Hindi (`hi-IN`)**: ₹250
- **Japanese (`ja-JP`)**: ￥250

---

## Guidelines for Developers

- **Never Hardcode Separators**: Never write `,` or `.` manually in strings for digits. Always wrap values in `formatNumber(value)`.
- **Dynamic Relative Dates**: For durations (e.g., "3 hours ago"), use browser relative formatting wrappers where supported, or format timestamps using `formatDate`.
- **Currency Overrides**: By default, `formatCurrency` uses the active language's currency symbol. To display plan options in USD regardless of the user's interface language, pass a currency override:
  ```typescript
  formatCurrency(250, 'USD')
  ```
