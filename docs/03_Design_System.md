# 03. Design System & Brand Guidelines

## 1. Design Philosophy
The AnalyticsRise UI is designed as a **Data Intelligence Command Center**. It moves away from generic, plain software layouts toward a high-tech, immersive workstation aesthetic. It combines dark, space-like backgrounds with sharp, glowing neon highlights to create a premium, engaging learning workspace.

---

## 2. Color Palette

We utilize HSL and hex definitions to create a balanced, high-contrast dark theme:

| Color Name | Hex Code | Utility Class (Tailwind) | Application |
| :--- | :--- | :--- | :--- |
| **Deep Background** | `#05070B` | `bg-background` | Platform main backdrop |
| **Surface Dark** | `#0D1117` | `bg-surface` | Cards, sidebars, panel containers |
| **Primary Cyber Cyan** | `#00E5FF` | `text-primary` / `border-primary` | Neon headers, primary buttons, glows |
| **Secondary Tech Blue**| `#4FC3F7` | `text-secondary` | Telemetry text, secondary buttons |
| **Muted Slate** | `#1E293B` | `border-border` / `bg-slate` | Layout dividers, default borders |
| **Alert Success** | `#00E676` | `text-success` | Positive validations, completed logs |
| **Alert Warning** | `#FFD600` | `text-warning` | Pending status, hints, Streaks |
| **Alert Danger** | `#FF1744` | `text-danger` | Verification failures, error logs |

---

## 3. Typography

```
+--------------------------------------------------------------------------+
|                              TYPOGRAPHY                                  |
+---------------------------------+----------------------------------------+
| Font Family                     | Application Scope                      |
+---------------------------------+----------------------------------------+
| 1. Orbitron                     | Dashboard stats, main headers, timers, |
|                                 | level badges, cryptographic metrics    |
+---------------------------------+----------------------------------------+
| 2. Inter                        | Copy text, paragraphs, options lists,  |
|                                 | input forms, documentation sections    |
+---------------------------------+----------------------------------------+
| 3. JetBrains Mono               | SQL queries, Excel formula inputs,     |
|                                 | table headers, telemetry console feeds |
+---------------------------------+----------------------------------------+
```

### Font Scale:
* **H1:** `text-3xl` (30px / 1.875rem), Font: Orbitron, Weight: Bold
* **H2:** `text-xl` (20px / 1.25rem), Font: Orbitron, Weight: Semi-Bold
* **H3:** `text-lg` (18px / 1.125rem), Font: Inter, Weight: Medium
* **Body:** `text-sm` (14px / 0.875rem), Font: Inter, Weight: Regular
* **Code/Metrics:** `text-xs` (12px / 0.75rem), Font: JetBrains Mono

---

## 4. Layout Grid & Structural Elements

### 4.1 The Cyber-Grid Background
To reinforce the command center feel, the main layout features a retro grid pattern generated with CSS linear-gradients:
```css
background-image: 
  linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
background-size: 24px 24px;
```

### 4.2 Dashboard Layout
* **Sidebar:** Fixed left navigation panel, width `240px` (or `68px` when collapsed). Implements glassmorphism (`backdrop-filter: blur(12px)`) with a subtle right-hand border (`border-r border-border`).
* **Header / Telemetry Bar:** Sticky top panel, height `64px`. Displays live metrics (Streak, XP, points) in Orbitron alongside a ticking digital clock.
* **Content Container:** CSS Grid or Flex layout with standard page padding (`p-6`).

---

## 5. UI Elements & Components

### 5.1 Command Cards (Glassmorphism)
All cards follow a unified futuristic aesthetic:
* **Background:** Semi-transparent dark surface (`background: rgba(13, 17, 23, 0.7)`).
* **Blur:** `backdrop-filter: blur(8px)`.
* **Border:** Thin boundary (`border border-slate-800`).
* **Glow/Highlight:** Hover state transitions to light up borders with a Cyan accent (`border-primary/50`) and soft shadow (`box-shadow: 0 0 15px rgba(0, 229, 255, 0.15)`).

### 5.2 Buttons & Controls
* **Primary (Neon Glow):**
  * Border: `border border-primary`
  * Text: `text-primary`
  * Hover Background: `bg-primary/10` with a subtle box-shadow.
* **Secondary (Slate):**
  * Border: `border border-slate-700`
  * Text: `text-slate-300`
  * Hover Background: `bg-slate-800`.

### 5.3 Custom Scrollbars
Standard scrollbars are replaced with custom styled versions to avoid breaking the design consistency:
```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #05070B;
}
::-webkit-scrollbar-thumb {
  background: #1E293B;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #00E5FF;
}
```
