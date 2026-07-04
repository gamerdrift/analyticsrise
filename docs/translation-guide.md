# Translation Guide — AnalyticsRise

> For contributors and translators | Sprint 3.4

## File Structure

To enable bundle-size optimization and lazy loading, all translation assets are split into separate modules per language and reside in the `/messages` directory in the root of the workspace.

```
messages/
├── en/                   ← English (base source of truth)
│   ├── common.json       ← Shared UI buttons, actions, and tags
│   ├── auth.json         ← Login, registration, and password reset flows
│   ├── dashboard.json    ← CC telemetry labels and widgets
│   ├── courses.json      ← Course cards and syllabus navigation
│   ├── practice.json     ← Lab environment labels
│   ├── simulators.json   ← SQL sandboxes and Excel tool selectors
│   ├── assessments.json  ← Test questions and results status
│   ├── certificates.json ← Certification verification credentials
│   ├── career.json       ← Resume scanning and jobs telemetry
│   ├── settings.json     ← General profile configurations
│   ├── notifications.json← Logs and telemetry triggers
│   ├── footer.json       ← Copyright and legal pages
│   ├── errors.json       ← Validation failures and connection issues
│   └── missions.json     ← Empty placeholder (reserved for future tasks)
├── es/                   ← Spanish
│   └── ... (same json modules as en)
└── ... (repeat for all supported language codes)
```

---

## Translation File Format

Each module file contains key-value pairs representing localized UI strings. Keys can be nested JSON objects:

```json
// messages/en/common.json
{
  "save": "Save",
  "cancel": "Cancel",
  "status": {
    "completed": "Completed",
    "inProgress": "In Progress"
  }
}
```

---

## Using Translations in Components

### Basic Usage

Use the `t()` function from `useLanguage()` by specifying the dot-separated path to the translation key:

```tsx
import { useLanguage } from '@/lib/i18n';

export function SaveButton() {
  const { t } = useLanguage();

  return <button>{t('common.save')}</button>;
}
```

### With Parameters

Use `{parameterName}` placeholders inside the JSON strings:

```json
// messages/en/notifications.json
{
  "streakReminder": "Keep your streak going! Log in today to maintain your {days}-day streak."
}
```

```tsx
const { t } = useLanguage();

return <p>{t('notifications.streakReminder', { days: 5 })}</p>;
```

---

## Translation Guidelines & Technical Terms

To maintain clarity and accuracy, do NOT translate technical names or vocabulary. Keep the following terms in English across all language files:

- **Programming Languages**: `SQL`, `Python`, `R`
- **Analytics Tools**: `Excel`, `Power BI`, `Tableau`, `Alteryx`
- **Standard Abbreviations**: `CSV`, `JSON`, `API`, `ATS`, `XP`
- **Brand Names**: `AnalyticsRise`, `GitHub`, `Firebase`, `Next.js`, `React`, `TypeScript`

---

## Adding a New Translation Key

1. **Add the key to the English base module** (e.g. `messages/en/dashboard.json`). English is the source of truth.
2. Add the same key path to the corresponding files for all other 11 supported languages.
3. Reference the translation path using `t('module.key')`.
4. Ensure no raw text remains in your JSX.

---

## Verification & Key Audits

Use the translation validator utility script to check translation files for:
- Missing keys in target languages compared to English.
- Duplicate keys in JSON files.
- Placeholder variable mismatches.
- Unused keys.

Run the test suite or compile checking before checking in changes.
