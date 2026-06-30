# RTL (Right-to-Left) Support Guide

> AnalyticsRise i18n Framework | Sprint 3.5

## Overview

Arabic (`ar`) is the only RTL language currently supported. The RTL implementation uses a **CSS `dir` attribute approach** — the `<html>` element's `dir` attribute is switched to `rtl` when the user selects Arabic, and CSS rules in `globals.css` under `[dir="rtl"]` handle all layout inversions automatically.

---

## How RTL Is Activated

When the user switches to Arabic, `LanguageContext` calls:

```typescript
document.documentElement.lang = 'ar';
document.documentElement.dir = 'rtl';
document.documentElement.classList.add('rtl');
```

And when switching back to any LTR language:

```typescript
document.documentElement.dir = 'ltr';
document.documentElement.classList.remove('rtl');
```

---

## CSS Logical Properties

Use **logical CSS properties** instead of physical ones where components need to support both LTR and RTL naturally:

| Physical (avoid in new code) | Logical (use instead) |
|------------------------------|-----------------------|
| `margin-left` | `margin-inline-start` / `ms-*` |
| `margin-right` | `margin-inline-end` / `me-*` |
| `padding-left` | `padding-inline-start` / `ps-*` |
| `padding-right` | `padding-inline-end` / `pe-*` |
| `border-left` | `border-inline-start` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |

Tailwind CSS v3 includes logical property utilities: `ps-4`, `pe-4`, `ms-auto`, `me-auto`, `start-0`, `end-0`, etc.

---

## Tailwind RTL Utilities

In new components, prefer logical Tailwind classes:

```tsx
// ✅ Works in both LTR and RTL
<div className="ps-4 pe-6 text-start">...</div>

// ❌ Only works in LTR
<div className="pl-4 pr-6 text-left">...</div>
```

---

## CSS Override Rules (`globals.css`)

The `[dir="rtl"]` block in `globals.css` handles global RTL overrides:

```css
[dir="rtl"] {
  /* Text alignment flip */
  .text-start { text-align: right; }
  .text-end   { text-align: left; }

  /* Directional icons (back arrows, chevrons) */
  .icon-directional { transform: scaleX(-1); }

  /* Sidebar flips to right side */
  .sidebar-start { left: auto; right: 0; }
}
```

---

## Code & Technical Terms Stay LTR

Even in RTL mode, technical content must remain LTR:

```css
[dir="rtl"] pre,
[dir="rtl"] code,
[dir="rtl"] .code-block,
[dir="rtl"] .tech-label {
  direction: ltr;
  text-align: left;
  unicode-bidi: embed;
}
```

Apply `.tech-label` to SQL keywords, tool names (Power BI, Tableau, Python), and analytics terminology that must always render left-to-right.

---

## Component Best Practices

### ✅ Do This

```tsx
// Use logical flex direction with RTL consideration
<div className="flex items-center gap-3">
  <span className="text-start flex-1">Label</span>
  <svg className="icon-directional" />  {/* Will flip in RTL */}
</div>
```

### ❌ Avoid This

```tsx
// Hardcoded physical direction
<div style={{ marginLeft: '16px', textAlign: 'left' }}>
  Label
</div>
```

---

## Testing RTL

1. Log into AnalyticsRise
2. Go to Settings → Language & Region
3. Select العربية (Arabic)
4. The page immediately switches to RTL layout
5. Verify:
   - Navigation flows from right to left
   - Text reads right to left
   - Code blocks remain left to right
   - SQL keywords and tool names remain LTR

---

## Adding RTL Support to New Components

When building new components:

1. **Use `text-start`/`text-end`** instead of `text-left`/`text-right`
2. **Use `ps-*`/`pe-*`** instead of `pl-*`/`pr-*`
3. **Use `ms-*`/`me-*`** instead of `ml-*`/`mr-*`
4. **Use `start-0`/`end-0`** instead of `left-0`/`right-0`
5. Add `.icon-directional` to arrows that indicate navigation direction
6. Wrap technical terms in `<span className="tech-label">SQL</span>`
