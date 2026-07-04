# Language Management Guide

> AnalyticsRise i18n Framework | Sprint 3.4

## How Language Preferences Are Stored

### Guests (not logged in)
- Stored in `localStorage` under the key `ar_language`.
- Persists across sessions on the browser.
- Cleared when browser data or storage is cleared.

### Authenticated Users
- Synchronized dynamically inside the user's Firestore document.
- Location: `/users/{userId}` at path `profile.preferredLanguage`.
- Saved using `UserService.updateUserProfile(uid, { 'profile.preferredLanguage': code })`.
- Synchronized automatically across all devices after the user logs in.

---

## Language Switching Flow

```
User selects language in LanguageSwitcher or Settings Page
         │
         ▼
changeLanguage('es') called
         │
         ├─ loadTranslations('es')    ← async dynamic module import
         │
         ├─ setTranslations(data)     ← update React state
         │
         ├─ setLanguage('es')         ← update active language code
         │
         ├─ applyDocumentAttributes() ← sets html[lang]="es" and html[dir]="ltr"
         │
         ├─ localStorage.setItem('ar_language', 'es')
         │
         └─ UserService.updateUserProfile(uid, { 'profile.preferredLanguage': 'es' })
```

All updates occur atomically. During the loading state, the `isLoading` flag disables the switcher controls to prevent race conditions or double clicks.

---

## Browser Language Detection

When a user visits the platform for the first time without any stored preference in `localStorage` or Firestore:
1. The navigator languages array is evaluated:
   ```typescript
   const langs = navigator.languages || [navigator.language];
   ```
2. If a supported language matches that differs from the default (`en`), the `BrowserLanguageBanner` is primed.
3. A non-intrusive banner slides in from the bottom after 1.5 seconds, suggesting the switch.
4. Users can choose to switch or permanently dismiss the suggestion. The dismissal is saved in `localStorage` as `ar_language_banner_dismissed: true`.

---

## Language Switcher Component

Exposes two visual layout variants:

### 1. Compact Variant (`variant="compact"`)
- Rendered in headers, Navbars, and Sidebar footers.
- Shows a concise flag icon + language code dropdown button.

### 2. Default Dropdown Variant (`variant="dropdown"`)
- Rendered inside Settings layouts.
- Shows flags, native names, English names, search filters, and favorite toggles.
- Leverages mobile-responsive CSS: displays as a desktop dropdown and floats as an accessible slide-up bottom sheet on mobile devices.

---

## Technical Logging & Debugging

Telemetry logs can be reviewed in the console by enabling debug mode. The wrapper prints out language activity metrics:
- `[DEBUG] Language changed to: ar`
- `[WARN] Missing translation key: "dashboard.unresolvedKey" for language "ar"`
- `[WARN] Failed to load translations for "xx", falling back to English.`
- `[DEBUG] LanguageProvider initialized. Default locale set to: en-US`

---

## Cache Management

Translations are cached in memory:

```typescript
const translationCache: Record<string, Record<string, any>> = {
  'en': { ... },
  'es': { ... },
};
```

Accessing a previously selected language does not make any network requests. The cache is refreshed on page reload, ensuring users receive updated translation files.
