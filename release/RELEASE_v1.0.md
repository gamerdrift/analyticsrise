# 🚀 AnalyticsRise — Release v1.0.0-beta (Baseline Release)

## Mission Codename: FOUNDATION

### Executive Overview
AnalyticsRise **Release v1.0.0-beta** serves as the official production baseline freeze. This milestone encapsulates all engineering deliverables, interactive simulators, authentication systems, design systems, and AI guidance features developed from Sprint 1.0 through Sprint 7.0.

---

## 📌 Release Metadata

- **Release Version**: `v1.0.0-beta`
- **Release Date**: `2026-07-28`
- **Baseline Git Commit**: `3654a97`
- **Firebase Project**: `analyticsrise-56655`
- **Production URL (Primary)**: [https://analyticsrise.com](https://analyticsrise.com)
- **Production URL (Firebase Subdomain)**: [https://analyticsrise-56655.web.app](https://analyticsrise-56655.web.app)

---

## 📅 Sprint Development History

- **Sprint 1.0 - 3.0**: Foundation landing pages, responsive navigation, glassmorphism design system (`#05070B`, `#00E5FF`), and core authentication layout.
- **Sprint 4.0**: Interactive SQL Simulator Lab with in-browser query engine, schema inspector, execution history, and sample datasets.
- **Sprint 5.0**: Interactive Python Data Lab with Jupyter-style cell execution, Pyodide/browser execution, and data visualization.
- **Sprint 6.0**: Unified Workspace & Career Hub with certification path tracks, course modules, and skill assessment engine.
- **Sprint 6.1.1**: FloatingActionManager UX patch — clean separation of context-aware AI Mentor (`bottom-4 right-4`) and Beta Feedback (`bottom-20 right-4`).
- **Sprint 7.0 (PROJECT SPREADSHEET)**: **Excel Studio Pro Enterprise Edition** — 2D virtualized spreadsheet grid (`react-window`), formula evaluator engine (25+ functions across Math, Logical, Lookup, Text, Date, Statistical), workbook tabs, formatting ribbon, dynamic SVG charts, KPI summary cards, 10 sample business datasets, 5-tier learning missions, 30s autosave, and natural-language AI Excel Mentor.

---

## 🚀 Features Included in Baseline v1.0.0-beta

### 1. Excel Studio Pro Enterprise Edition (`/excel-studio` & `/simulators/excel`)
- **Spreadsheet Grid Engine**: 2D virtualization (`react-window`), smooth scrolling for 100,000+ rows, multi-cell range selection, native Copy/Cut/Paste, AutoFill relative formula shifting, row/column operations, freeze panes, hide/unhide, and Search & Replace modal (`Ctrl+F` / `Ctrl+H`).
- **Formula Evaluator Engine**: Evaluates 25+ Excel functions (`SUM`, `AVERAGE`, `MIN`, `MAX`, `ROUND`, `ABS`, `POWER`, `IF`, `IFS`, `AND`, `OR`, `NOT`, `XLOOKUP`, `VLOOKUP`, `HLOOKUP`, `INDEX`, `MATCH`, `LEFT`, `RIGHT`, `MID`, `LEN`, `CONCAT`, `TEXTJOIN`, `TODAY`, `NOW`, `YEAR`, `MONTH`, `DAY`, `NETWORKDAYS`, `COUNT`, `COUNTA`, `COUNTIF`, `COUNTIFS`), with formula autocomplete catalog and error diagnosis.
- **Workbook Management**: Multi-worksheet tab bar, sheet add/rename/duplicate/reorder/delete, and workbook metadata drawer.
- **Formatting System**: Font family, size, bold, italic, underline, font color, fill color, text alignment, merge & center, number formats (Currency, Percent, Decimal, Date), and Conditional Formatting rule builder.
- **Export & Import**: CSV/TSV download and styled printable PDF report generator.
- **Visualizations**: Dynamic SVG Bar, Line, Pie, and Area charts + real-time recalculating KPI summary cards.
- **AI Excel Mentor**: Context-aware side-drawer with Natural Language to Formula generation, formula breakdown, error diagnosis, and analytics suggestions.
- **Learning Mission Engine**: 5 mission tiers (Beginner to Interview Challenge) with formula auto-validation, XP rewards (+150 to +750 XP), badges, and AI hints.
- **Dataset Library**: 10 real-world business datasets across Sales, Finance, HR, Retail, Healthcare, Banking, Supply Chain, Marketing, Manufacturing, and E-Commerce.

### 2. SQL Simulator Lab (`/simulators/sql`)
- Browser-based SQL query execution environment.
- Interactive schema explorer and table preview.
- Query history logging and result table formatting.

### 3. Python Data Lab (`/simulators/python` & `/python-lab`)
- Jupyter-style notebook cell interface.
- Code execution, console output stream, and data visualization display.

### 4. User Authentication & Dashboard (`/login`, `/register`, `/dashboard`)
- End-to-end user registration and login workflows.
- Password reset and account profile management.
- Dashboard with learning progress tracks and simulator access cards.

### 5. Internationalization & Navigation
- Multi-language switcher dropdown (`US English`, `ES Español`, `FR Français`, `DE Deutsch`, `HI हिन्दी`).
- Responsive navbar and footer with active route highlighting.

---

## ⚠️ Known Limitations

1. **Circular Cell References**: Formula evaluation currently flags circular dependencies as `#RECURSION!`; iterative calculation is reserved for Sprint 7.2.
2. **Offline Data Persistence**: AutoSave relies on `localStorage`; server-side cloud sync via Firebase Firestore is scheduled for Sprint 8.0.
3. **Large File CSV Uploads**: CSV uploads > 5MB are recommended to be truncated; web worker parsing optimization is scheduled for Sprint 7.1.

---

## 🔄 Rollback Instructions

If a critical production regression is detected in future releases:

1. **Git Rollback**:
   ```bash
   git checkout v1.0.0-beta
   ```
2. **Rebuild Static Output**:
   ```bash
   npm run build:fast
   ```
3. **Firebase Hosting Rollback**:
   ```bash
   npx firebase deploy --only hosting
   ```
   *Alternatively, perform a 1-click version rollback via the Firebase Console under Hosting -> Release History -> Rollback to version `v1.0.0-beta`.*
