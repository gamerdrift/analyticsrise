# Internationalization Architecture — AnalyticsRise

> Sprint 3.5 | Last Updated: 2026-06-30

## Overview

AnalyticsRise uses a **client-side, lazy-loaded** internationalization (i18n) framework built on native browser `Intl` APIs. Because the project uses Next.js 14 with `output: 'export'` (static site generation), there is no server-side locale routing. All localization logic runs in the browser after hydration.

---

## Supported Languages

| Code | Language | Script | Direction | Currency |
|------|----------|--------|-----------|----------|
| `en` | English | Latin | LTR | USD |
| `es` | Spanish | Latin | LTR | EUR |
| `fr` | French | Latin | LTR | EUR |
| `de` | German | Latin | LTR | EUR |
| `it` | Italian | Latin | LTR | EUR |
| `pt` | Portuguese | Latin | LTR | BRL |
| `hi` | Hindi | Devanagari | LTR | INR |
| `ar` | Arabic | Arabic | **RTL** | SAR |
| `zh` | Chinese (Simplified) | Han | LTR | CNY |
| `ja` | Japanese | Kanji/Kana | LTR | JPY |
| `ko` | Korean | Hangul | LTR | KRW |
| `ru` | Russian | Cyrillic | LTR | RUB |

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

```
lib/
├── i18n/
│   ├── index.ts              ← barrel export
│   └── locales/
│       ├── en.json           ← English (base)
│       ├── es.json           ← Spanish
│       ├── fr.json           ← French
│       ├── de.json           ← German
│       ├── it.json           ← Italian
│       ├── pt.json           ← Portuguese
│       ├── hi.json           ← Hindi
│       ├── ar.json           ← Arabic (RTL)
│       ├── zh.json           ← Chinese Simplified
│       ├── ja.json           ← Japanese
│       ├── ko.json           ← Korean
│       └── ru.json           ← Russian
└── contexts/
    └── LanguageContext.tsx   ← Core provider + hooks

app/components/i18n/
├── LanguageSwitcher.tsx      ← Dropdown UI (compact + full variants)
└── BrowserLanguageBanner.tsx ← Auto-suggestion banner
```

---

## Language Detection Priority

1. **LocalStorage** (`ar_language` key) — persisted user choice
2. **Default** — falls back to `en` if nothing stored
3. **Browser suggestion** — if `navigator.languages` matches a supported code that differs from the stored preference, a `BrowserLanguageBanner` appears after 1.5 s offering to switch

---

## Translation Loading

Translations are loaded via **dynamic `import()`** with an in-memory cache:

```typescript
const translationCache: Record<string, Record<string, any>> = {};

async function loadTranslations(lang: LanguageCode) {
  if (translationCache[lang]) return translationCache[lang]; // cache hit
  const mod = await import(`@/lib/i18n/locales/${lang}.json`);
  translationCache[lang] = mod.default;
  return translationCache[lang];
}
```

- First load: ~1-3 KB JSON per language
- Subsequent accesses: instant from memory cache
- English fallback: if any translation file fails to load

---

## Key APIs

### `useLanguage()` / `useTranslation()`

```tsx
import { useLanguage } from '@/lib/i18n';

function MyComponent() {
  const { t, formatDate, formatCurrency, language, direction } = useLanguage();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('notifications.streakReminder', { days: 7 })}</p>
      <p>{formatDate(new Date())}</p>
      <p>{formatCurrency(29.99)}</p>
    </div>
  );
}
```

### `changeLanguage(code, persist?)`

```tsx
const { changeLanguage } = useLanguage();

// Switch to French and save to localStorage
await changeLanguage('fr');

// Switch without saving (temporary)
await changeLanguage('de', false);
```

---

## Intl Formatters

All formatters use the `Intl` Web API with the active locale:

| Function | Description | Example (en) | Example (ar) |
|----------|-------------|--------------|--------------|
| `formatDate(date)` | Long date | June 30, 2026 | ٣٠ يونيو ٢٠٢٦ |
| `formatTime(date)` | Short time | 10:45 AM | ١٠:٤٥ ص |
| `formatNumber(n)` | Locale number | 1,234,567 | ١٬٢٣٤٬٥٦٧ |
| `formatPercent(n)` | Percentage | 87.5% | ٨٧٫٥٪ |
| `formatCurrency(n)` | Currency | $29.99 | ﷼٢٩٫٩٩ |

---

## Persistence

| User Type | Storage |
|-----------|---------|
| Guest | `localStorage['ar_language']` |
| Authenticated | `localStorage['ar_language']` (Firestore sync planned for v2) |

---

## Technical Notes

- **No `next-intl`** — avoids incompatibility with `output: 'export'`
- **No hardcoded strings** — all UI text must use `t('key')`
- **Technical keywords** (SQL, Python, Power BI, etc.) stay English in all locales
- **Code blocks** always render LTR regardless of locale
- **SSR-safe** — context reads localStorage only in `useEffect` to avoid hydration mismatch
