# Translation Guide — AnalyticsRise

> For contributors and translators | Sprint 3.5

## File Structure

All translation files live in `lib/i18n/locales/`. Each language has its own JSON file named by its [IETF language code](https://en.wikipedia.org/wiki/IETF_language_tag):

```
lib/i18n/locales/
├── en.json  ← English (source of truth)
├── es.json  ← Spanish
├── fr.json  ← French
├── de.json  ← German
├── it.json  ← Italian
├── pt.json  ← Portuguese
├── hi.json  ← Hindi
├── ar.json  ← Arabic
├── zh.json  ← Chinese (Simplified)
├── ja.json  ← Japanese
├── ko.json  ← Korean
└── ru.json  ← Russian
```

---

## Translation File Format

Each file is a **nested JSON object** organized by module/section:

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "dashboard": {
    "title": "Command Center",
    "welcomeMorning": "Good Morning"
  },
  "auth": {
    "login": "Log In"
  }
}
```

---

## Using Translations in Components

### Basic Usage

```tsx
import { useLanguage } from '@/lib/i18n';

export function MyComponent() {
  const { t } = useLanguage();

  return <h1>{t('dashboard.title')}</h1>;
}
```

### With Parameters

Use `{paramName}` placeholders in translation strings:

```json
// In en.json:
"streakReminder": "Keep your streak! Log in today to maintain your {days}-day streak."
```

```tsx
const { t } = useLanguage();
const message = t('notifications.streakReminder', { days: 7 });
// Result: "Keep your streak! Log in today to maintain your 7-day streak."
```

---

## Sections & Keys

| Section | Description |
|---------|-------------|
| `common` | Shared UI labels (buttons, status words) |
| `auth` | Login, register, password reset flows |
| `dashboard` | ARCC Command Center widgets |
| `courses` | Course listings and player |
| `practice` | Lab challenge UI |
| `simulators` | Tool-specific simulator UI |
| `assessments` | Quiz and test flows |
| `certificates` | Certificate management |
| `career` | Career Center hub |
| `settings` | Account and preferences pages |
| `notifications` | Notification messages |
| `errors` | Error messages and validation |
| `footer` | Footer navigation and legal |

---

## Adding a New Translation Key

1. **Add to `en.json` first** — English is the source of truth.
2. Add the same key to **all other language files**.
3. Use the `t()` function in the component.
4. Never use the key in JSX without `t()` — no hardcoded strings.

### Example

```json
// en.json
{
  "dashboard": {
    "myNewFeature": "Explore your analytics journey"
  }
}

// es.json
{
  "dashboard": {
    "myNewFeature": "Explora tu recorrido de análisis"
  }
}
```

```tsx
// Component
<p>{t('dashboard.myNewFeature')}</p>
```

---

## What NOT to Translate

The following must **remain in English** in all locale files:

- Analytics tool names: `SQL`, `Power BI`, `Tableau`, `Excel`, `Python`, `R`, `Alteryx`
- Brand names: `AnalyticsRise`, `Google`, `GitHub`, `Firebase`
- Technical abbreviations: `ATS`, `XP`, `API`, `JSON`, `CSV`
- Language codes: `en`, `es`, `fr`, etc.
- Certification names used as proper nouns

---

## Adding a New Language

1. Create `lib/i18n/locales/<code>.json` (copy `en.json` as template)
2. Add to the `SUPPORTED_LANGUAGES` array in `LanguageContext.tsx`:
   ```typescript
   { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish', flag: '🇹🇷', direction: 'ltr', currency: 'TRY', locale: 'tr-TR' }
   ```
3. Translate all keys in the new file
4. Test the switcher and all pages

---

## Missing Keys

If a translation key is missing for the active language, the system:
1. Logs a warning to the console: `Missing translation key: "key" for language "xx"`
2. Returns the raw key string (e.g., `dashboard.title`) as a visible fallback
3. Does **not** crash

This makes it easy to spot untranslated content during QA.
