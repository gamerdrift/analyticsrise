# 🏛️ AnalyticsRise — System Architecture & Engineering Specifications

## Overview
AnalyticsRise is an enterprise-grade, browser-based data analytics learning platform built on Next.js (App Router), React 18, TypeScript, Tailwind CSS, and Firebase Hosting.

The application provides interactive, in-browser simulator environments (Excel Studio Pro, SQL Lab, Python Lab) designed to simulate enterprise software interfaces while providing real-time AI guidance, automated validation, and interactive learning paths.

---

## 🏗️ High-Level System Architecture

```
                                  +---------------------------------------+
                                  |         Production Client Browser     |
                                  +---------------------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |   Firebase Hosting CDN (Global Edge)  |
                                  |  https://analyticsrise.com            |
                                  +---------------------------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |     Next.js 14 Static Export App      |
                                  +---------------------------------------+
                                      /               |               \
                                     /                |                \
                                    v                 v                 v
                   +-------------------+    +-------------------+    +-------------------+
                   | Excel Studio Pro  |    |  SQL Simulator    |    | Python Data Lab   |
                   | Engine & Grid     |    | Query Engine      |    | Notebook Engine   |
                   +-------------------+    +-------------------+    +-------------------+
                             |                        |                        |
                             v                        v                        v
                   +-------------------+    +-------------------+    +-------------------+
                   | ExcelStudio       |    | Local SQLite/     |    | Pyodide / Browser  |
                   | Context & Reducer |    | WebSQL Worker     |    | Runtime           |
                   +-------------------+    +-------------------+    +-------------------+
```

---

## 📁 Directory Structure & Component Mapping

```
AnalyticsRise/
├── app/                           # Next.js 14 App Router Directory
│   ├── (auth)/                    # Authentication Route Group (login, register)
│   ├── (pages)/                   # Core Page Routes (assessments, career-hub)
│   ├── components/                # Shared UI Components & Layouts
│   │   ├── layout/                # Navbar, Footer, DashboardLayout
│   │   ├── floating/              # FloatingActionManager (AI Mentor, Feedback)
│   │   └── ui/                    # Reusable UI primitives (Buttons, Modals)
│   ├── excel-studio/              # Excel Studio Pro Enterprise Engine
│   │   ├── components/            # Grid, Toolbar, FormulaBar, MissionSidebar, etc.
│   │   ├── contexts/              # ExcelStudioContext (State Reducer & Dispatch)
│   │   └── page.tsx               # Main Excel Studio Workspace Route
│   ├── simulators/                # Simulator Launcher Routes (excel, sql, python)
│   └── page.tsx                   # Homepage Landing View
├── lib/                           # Core Utilities & Business Logic
│   └── utils/                     # Utility Functions
│       ├── excel/                 # Formula Evaluator, Export Manager, Dataset Library
│       └── i18n/                  # Multi-language dictionary and translation hooks
├── docs/                          # Engineering Documentation & Architecture Specs
├── release/                       # Official Release Notes & Manifests
├── public/                        # Static Assets (Images, Icons, Fonts)
├── styles/                        # Global CSS & Tailwind Directives
├── firebase.json                  # Firebase Hosting Configuration
└── next.config.mjs                # Next.js Static Output Export Configuration
```

---

## ⚡ Core Engine Specifications

### 1. Excel Studio Pro Grid Engine (`react-window`)
- **Virtualization**: Employs `FixedSizeGrid` / `Grid` from `react-window` to render only visible grid cells within the viewport, supporting 100,000+ rows and 1,000+ columns at 60 FPS.
- **State Management**: Governed by `ExcelStudioContext` using `useReducer` for predictable, immutable state transitions.
- **Cell Addressing**: Fast `$row,$col` string key hashing mapped to cell objects containing raw values, formulas, and formatting flags.

### 2. Formula Evaluator Engine (`lib/utils/excel/formulaEvaluator.ts`)
- **Parser**: Tokenizes string expressions starting with `=`, parses cell range references (`A1:B10`), resolves dependency trees, and computes output values.
- **Function Catalog**: 25+ supported functions across Math (`SUM`, `AVERAGE`, `MIN`, `MAX`, `ROUND`, `ABS`, `POWER`), Logical (`IF`, `IFS`, `AND`, `OR`, `NOT`), Lookup (`XLOOKUP`, `VLOOKUP`, `HLOOKUP`, `INDEX`, `MATCH`), Text (`LEFT`, `RIGHT`, `MID`, `LEN`, `CONCAT`, `TEXTJOIN`), Date (`TODAY`, `NOW`, `YEAR`, `MONTH`, `DAY`, `NETWORKDAYS`), and Statistical (`COUNT`, `COUNTA`, `COUNTIF`, `COUNTIFS`).
- **Relative Shifting**: `shiftFormulaReferences()` automatically shifts cell references when formulas are copied, pasted, or auto-filled across row/column offsets.

### 3. AI Excel Mentor Engine (`app/excel-studio/components/ExcelAiMentorDrawer.tsx`)
- Contextual side-drawer providing:
  - **Natural Language to Formula**: Translates human prompts (e.g. *"Find total revenue for Q3 in column C"*) into working Excel formulas (`=SUMIFS(C:C, B:B, "Q3")`).
  - **Formula Explainer**: Deconstructs nested formulas into step-by-step plain text breakdowns.
  - **Error Diagnosis**: Identifies `#VALUE!`, `#REF!`, `#NAME?`, `#DIV/0!`, `#N/A` errors and suggests corrective fixes.

---

## 🎨 Design System & Aesthetics
- **Theme**: Cyber-modern dark mode baseline (`#05070B` background, `#0D1117` containers, `#00E5FF` cyan neon accents, `#F5F7FA` typography).
- **Typography**: Clean monospace fonts (`JetBrains Mono`, `Orbitron`) for grid headers, data cells, code editors, and telemetry indicators.
- **Glassmorphism**: Backdrop blur filters (`backdrop-blur-md`), subtle borders (`border-[#00E5FF]/20`), and glowing drop shadows.
