# Internationalization Architecture — AnalyticsRise

> Sprint 3.4 | Last Updated: 2026-07-04

## Overview

AnalyticsRise uses a **client-side, lazy-loaded** internationalization (i18n) framework built on native browser `Intl` APIs. Because the project uses Next.js 14 with `output: 'export'` (static site generation), there is no server-side locale routing. All localization logic runs in the browser after hydration.

---

## Supported Languages

| Code | Language | Script | Direction | Currency | Locale |
|------|----------|--------|-----------|----------|--------|
| `en` | English | Latin | LTR | USD | `en-US` |
| `es` | Spanish | Latin | LTR | EUR | `es-ES` |
| `fr` | French | Latin | LTR | EUR | `fr-FR` |
| `de` | German | Latin | LTR | EUR | `de-DE` |
| `it` | Italian | Latin | LTR | EUR | `it-IT` |
| `pt` | Portuguese | Latin | LTR | BRL | `pt-BR` |
| `hi` | Hindi | Devanagari | LTR | INR | `hi-IN` |
| `ar` | Arabic | Arabic | **RTL** | SAR | `ar-SA` |
| `zh` | Chinese (Simplified) | Han | LTR | CNY | `zh-CN` |
| `ja` | Japanese | Kanji/Kana | LTR | JPY | `ja-JP` |
| `ko` | Korean | Hangul | LTR | KRW | `ko-KR` |
| `ru` | Russian | Cyrillic | LTR | RUB | `ru-RU` |

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────┐
│                   app/layout.tsx                   │
│  LoadingProvider > AuthProvider > LanguageProvider │
│  > ThemeProvider > children + BrowserLanguageBanner│
└─────────────────────┬──────────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │   LanguageContext.tsx   │
         │  • State: language code │
         │  • Lazy loads JSON      │
         │  • In-memory cache      │
         │  • Intl formatters      │
         │  • RTL detection        │
         └────────────┬────────────┘
                      │
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
useLanguage()    LanguageSwitcher  BrowserLanguageBanner
t('key')         (UI component)    (suggestion banner)
formatDate()
formatCurrency()
```

---

## File Structure

The translation assets are split into granular modules per language and stored in the `/messages` directory in the root of the workspace. This layout enables Next.js to dynamically load only the required localization bundles for the active interface language:

```
messages/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── dashboard.json
│   ├── courses.json
│   ├── career.json
│   ├── settings.json
│   ├── notifications.json
│   ├── footer.json
│   ├── errors.json
│   ├── practice.json
│   ├── simulators.json
│   ├── assessments.json
│   └── certificates.json
├── es/
│   └── ... (same modules as en)
└── ... (repeat for all supported codes)
```

---

## Language Detection Priority

1. **LocalStorage** (`ar_language` key) — persisted guest or user preference.
2. **Authenticated User Profile** — on login, the preferred language stored in Firestore is synchronized to the client.
3. **Browser auto-detection** — if no stored preference exists, `navigator.language` is evaluated. If a supported language is matched that differs from the default (`en`), the `BrowserLanguageBanner` slides in to offer a change.

---

## Translation Loading

Translations are loaded via dynamic React Webpack imports (`import()`) and cached in memory:

```typescript
async function loadTranslationModule(lang: LanguageCode, moduleName: string): Promise<Record<string, any>> {
  try {
    const mod = await import(`@/messages/${lang}/${moduleName}.json`);
    return mod.default || mod;
  } catch {
    if (lang !== 'en') {
      return loadTranslationModule('en', moduleName); // Fallback to English
    }
    return {};
  }
}
```

- Dynamic modules size: ~1-3 KB per module per language.
- Loading is progressive: only active language modules are loaded.
- Fallback support: missing keys or loading failures fallback to English translations gracefully without throwing runtime errors.

---

## Key Hooks & APIs

### `useLanguage()` / `useTranslation()`

Import standard translating and formatting utilities from the barrel module:

```tsx
import { useLanguage } from '@/lib/i18n';

function CourseCard() {
  const { t, formatDate, formatNumber } = useLanguage();

  return (
    <div>
      <h3>{t('courses.title')}</h3>
      <p>{formatDate(new Date())}</p>
      <span>{formatNumber(15000)} Students Enrolled</span>
    </div>
  );
}
```

### `changeLanguage(code, persist?)`

Switch active language and trigger styling / formatting changes:

```tsx
const { changeLanguage } = useLanguage();

// Change language to Spanish and sync preference to Firestore & LocalStorage
await changeLanguage('es');
```

---

## Localized Formatters

All formatters leverage the standard browser `Intl` APIs:

- `formatDate(date, options?)` - Localized calendar representations.
- `formatTime(time, options?)` - Localized clock time representations.
- `formatNumber(value, options?)` - Localized decimal separators.
- `formatPercent(value)` - Localized completion rate calculations.
- `formatCurrency(value, currencyOverride?)` - Region-appropriate price formatting.

---

## Persistence & Authentication Synchronization

Guest language selections are persisted to `localStorage` under `ar_language`.
For authenticated users, preferences are synced across devices. The language choice is stored inside the user's Firestore document:
- Collection: `/users/{userId}`
- Path: `profile.preferredLanguage`

Upon logging in, the platform retrieves `preferredLanguage` from the profile and updates the client interface language automatically, syncing it with the local cache.
