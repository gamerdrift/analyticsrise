# Language Management Guide

> AnalyticsRise i18n Framework | Sprint 3.5

## How Language Preferences Are Stored

### Guests (not logged in)
- Stored in `localStorage` under key `ar_language`
- Persists across sessions on the same browser
- Cleared when the browser's storage is cleared

### Authenticated Users
- **Current (v1):** Same as guests — `localStorage['ar_language']`
- **Planned (v2):** Sync to Firestore at `users/{uid}/profile.preferredLanguage` via `UserService.updateUserProfile()`

---

## Language Switching Flow

```
User clicks language in LanguageSwitcher
         │
         ▼
changeLanguage('fr') called
         │
         ├─ loadTranslations('fr')    ← async JSON import (or cache hit)
         │
         ├─ setTranslations(data)     ← update React state
         │
         ├─ setLanguage('fr')         ← update language code
         │
         ├─ applyDocumentAttributes() ← sets html[lang] and html[dir]
         │
         └─ localStorage.setItem('ar_language', 'fr')
```

All updates happen atomically within the `changeLanguage` function. An `isLoading` flag is set during the switch to visually disable the switcher button.

---

## Browser Auto-Detection

When no stored preference exists, the browser's preferred languages are checked:

```typescript
const langs = navigator.languages || [navigator.language];
for (const lang of langs) {
  const code = lang.split('-')[0]; // 'fr-FR' → 'fr'
  if (SUPPORTED_CODES.includes(code)) return code;
}
```

If a match is found that differs from the default (`en`), a `BrowserLanguageBanner` appears after a 1.5-second delay.

---

## The LanguageSwitcher Component

Two visual variants are available:

### Compact (for headers/navbars)
```tsx
import LanguageSwitcher from '@/app/components/i18n/LanguageSwitcher';

<LanguageSwitcher variant="compact" />
// Shows: 🇺🇸 EN ▾
```

### Full (for settings pages)
```tsx
<LanguageSwitcher variant="full" />
// Shows: full card with native name, English name, and search
```

Both include:
- Search/filter
- RTL badge for Arabic
- Checkmark on selected language
- Accessible `aria-haspopup`, `aria-expanded`, `role="listbox"` attributes

---

## Adding Language to Settings Page

The `LanguageSwitcher` full variant is intended to be embedded directly in the Settings page under the Language & Region section:

```tsx
import { useLanguage } from '@/lib/i18n';
import LanguageSwitcher from '@/app/components/i18n/LanguageSwitcher';

export function LanguageSettings() {
  const { t, languageInfo, formatDate } = useLanguage();

  return (
    <section>
      <h2>{t('settings.languageSection')}</h2>
      <p className="text-sm text-[#9AA5B1]">{t('settings.languageDescription')}</p>
      <LanguageSwitcher variant="full" className="mt-4 max-w-xs" />
      <p className="text-xs text-[#9AA5B1] mt-2">
        {t('settings.languageSaved')}
      </p>
      <p className="mt-4 text-sm">
        Preview: {formatDate(new Date())}
      </p>
    </section>
  );
}
```

---

## Future: Firestore Language Sync

To sync language to Firestore when the user is authenticated:

```typescript
// In AuthContext or a dedicated settings action:
import { useLanguage } from '@/lib/i18n';
import { UserService } from '@/lib/services/user';

const { language } = useLanguage();

await UserService.updateUserProfile(uid, {
  'profile.preferredLanguage': language,
});
```

And on login, restore the saved language:

```typescript
// After loading user profile:
const savedLang = profileDoc.profile.preferredLanguage;
if (savedLang && SUPPORTED_CODES.includes(savedLang)) {
  await changeLanguage(savedLang as LanguageCode, false); // don't overwrite localStorage
}
```

---

## Diagnostics & Debugging

Enable debug logging by setting `LOG_LEVEL=debug` in `.env.local`.

The logger will print:
- `[DEBUG] Language changed to: fr`
- `[WARN] Missing translation key: "dashboard.newKey" for language "fr"`
- `[WARN] Failed to load translations for "xx", falling back to English.`

---

## Cache Management

Translations are cached in memory for the lifetime of the tab session. The cache is an object keyed by language code:

```typescript
const translationCache: Record<string, Record<string, any>> = {
  'en': { ... },
  'fr': { ... },
};
```

Switching back to a previously selected language is instant (no network round-trip). The cache is cleared automatically when the page is refreshed.
