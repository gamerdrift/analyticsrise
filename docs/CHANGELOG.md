# 📜 AnalyticsRise — Official Changelog

All notable changes to the AnalyticsRise platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0-beta] - 2026-07-28 — Baseline Production Release

### Added
- **Excel Studio Pro Enterprise Edition (`/excel-studio`)**:
  - 2D virtualized spreadsheet grid engine powered by `react-window` supporting 100,000+ rows and 1,000+ columns.
  - Formula evaluator engine supporting 25+ Excel functions (`SUM`, `AVERAGE`, `MIN`, `MAX`, `ROUND`, `ABS`, `POWER`, `IF`, `IFS`, `AND`, `OR`, `NOT`, `XLOOKUP`, `VLOOKUP`, `HLOOKUP`, `INDEX`, `MATCH`, `LEFT`, `RIGHT`, `MID`, `LEN`, `CONCAT`, `TEXTJOIN`, `TODAY`, `NOW`, `YEAR`, `MONTH`, `DAY`, `NETWORKDAYS`, `COUNT`, `COUNTA`, `COUNTIF`, `COUNTIFS`).
  - AutoFill drag handle with relative reference shifting.
  - Native Copy (`Ctrl+C`), Cut (`Ctrl+X`), and Paste (`Ctrl+V`) selection handlers.
  - Row & Column insertion, deletion, hiding, unhiding, and freeze panes.
  - Workbook tabs management with sheet add/rename/duplicate/reorder/delete.
  - Text formatting ribbon: font family, font size, bold, italic, underline, fill color, text color, alignment, merge & center, and number formats (Currency, Percent, Decimal, Date).
  - Conditional formatting rule builder modal.
  - Interactive Search & Replace modal dialog (`Ctrl+F` / `Ctrl+H`).
  - Dynamic SVG chart generator (Bar, Line, Pie, Area) + real-time KPI summary cards.
  - CSV / TSV export and styled printable PDF report generator.
  - 10 sample business datasets across Sales, Finance, HR, Retail, Healthcare, Banking, Supply Chain, Marketing, Manufacturing, and E-Commerce.
  - Context-aware AI Excel Mentor side-drawer supporting Natural Language to Formula, formula explainer, and error diagnosis.
  - 5-tier Learning Mission engine (Beginner to Interview Challenge) with formula auto-validation, XP rewards (+150 to +750 XP), badges, and AI hints.
  - Background 30-second interval AutoSave with `localStorage` persistence.
  - Cyber-modern dark mode design system (`#05070B`, `#00E5FF`).
- **Release Documentation Suite**:
  - `VERSION`, `RELEASE_v1.0.md`, `PRODUCTION_MANIFEST.md`, `ARCHITECTURE.md`, `DEPLOYMENT.md`, `CHANGELOG.md`, `ROADMAP.md`, `CONTRIBUTING.md`.

### Changed
- Refactored `FloatingActionManager` for clean UI separation between AI Mentor (`bottom-4 right-4`) and Feedback button (`bottom-20 right-4`).
- Updated route parity between `/excel-studio` and `/simulators/excel`.

---

## [v0.6.0] - 2026-07-15
- Integrated Unified Workspace & Career Hub with certification path tracks.
- Implemented multi-language switcher dropdown (`US English`, `ES Español`, `FR Français`, `DE Deutsch`, `HI हिन्दी`).

## [v0.5.0] - 2026-07-01
- Launched Interactive Python Data Lab with cell execution interface.

## [v0.4.0] - 2026-06-15
- Launched Interactive SQL Simulator Lab with schema inspector and query runner.

## [v0.1.0] - 2026-05-01
- Initial repository setup, Next.js App Router initialization, and core UI design system.
