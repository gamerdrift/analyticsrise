# Future Language Expansion Guide

> AnalyticsRise i18n Framework | Sprint 3.4

This document serves as a step-by-step developer walkthrough for expanding the internationalization framework with additional languages.

---

## Step-by-Step Integration Checklist

To add a new language (e.g. Turkish `tr`):

### 1. Identify the ISO Target Codes
Determine the correct standard identifiers:
- **Language Code**: `tr` (ISO 639-1)
- **Locale Target**: `tr-TR` (for formatting coordinates)
- **Currency Code**: `TRY` (ISO 4217)
- **Native / English names**: Türkçe / Turkish
- **Emoji Flag**: 🇹🇷

### 2. Create the Translation Directory
Create a new directory under `/messages` named with the language code:
```bash
mkdir messages/tr
```

### 3. Initialize Modular Message JSONs
Copy the base English files as a localization template:
```bash
cp messages/en/*.json messages/tr/
```

Translate the strings in all files:
- `common.json`, `auth.json`, `dashboard.json`, `courses.json`, `missions.json`, `career.json`, `settings.json`, `notifications.json`, `footer.json`, `errors.json`, `practice.json`, `simulators.json`, `assessments.json`, `certificates.json`.

Ensure technical terms like `SQL`, `Python`, `Excel`, `Tableau` are **not** translated (remain LTR in English).

### 4. Register the Language in Context
Open [LanguageContext.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/contexts/LanguageContext.tsx) and add the configuration object to the `SUPPORTED_LANGUAGES` array:

```typescript
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  // ... existing languages
  { 
    code: 'tr', 
    nativeName: 'Türkçe', 
    englishName: 'Turkish', 
    flag: '🇹🇷', 
    direction: 'ltr', 
    currency: 'TRY', 
    locale: 'tr-TR' 
  },
];
```

If the language direction is Right-to-Left (like Hebrew `he` or Persian `fa`), set `direction: 'rtl'`. Also add the language code to the `RTL_LANGUAGES` array if applicable.

### 5. Run the Verification Audit
Run the automated JSON validation tests to make sure there are no missing keys, duplicate tags, or mismatched interpolation variables:
```bash
npm test
```

If you have a custom validation script, execute it to generate a delta report.

### 6. Verify User Experience
Deploy or run the development server locally and verify:
1. Open the Navbar Language Selector dropdown. Verify Turkish is listed.
2. Select Turkish. Verify the interface instantly switches.
3. Open **Settings → Language & Region**. Verify the preview formats dates (`4 Temmuz 2026`), percentages, and currencies correctly.
4. Perform sign-in/sign-out actions. Verify preferences persist inside Firestore under `profile.preferredLanguage`.
