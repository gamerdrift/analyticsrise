# 08. AI Development Guidelines

## 1. Introduction & Scope
This document serves as the official handbook for AI agents (including Antigravity, GitHub Copilot, and other agentic coding systems) when reading, modifying, or creating components in the AnalyticsRise codebase. These guidelines ensure that any AI-generated code conforms to our premium design aesthetics, strict TypeScript types, and architectural principles.

---

## 2. Core Coding Rules

### 2.1 Strictly Typed Implementations
* **No `any` or loose casting:** Define explicit interfaces for components and states.
* **Optional properties:** Clearly demarcate optional variables using `?` and specify fallback values inside components.
* **Strict compiler compliance:** All edits must compile without errors under `npm run type-check`.

### 2.2 Aesthetic & Design Cohesion
* **Command Center Styling:** Maintain the glowing dark telemetry aesthetic. Avoid white backgrounds or standard solid colors.
* **Component Glows:** Apply border transitions and drop-shadows matching primary cyan HSL tokens on hovered elements.
* **Typography Mappings:** Always use Orbitron for numbers and badges, Inter for regular reading text, and JetBrains Mono for calculations and console messages.

### 2.3 Component & File Isolation
* **Zero Placeholders:** When writing mock datasets or rendering charts, use working math generators or local data files. Do not insert "TODO: connect to database" labels.
* **Modular Logic:** Extract heavy string parsers, formula evaluations, or chart generators into isolated files under `lib/` and reference them using custom hooks or utility calls.

---

## 3. Simulator Development & Safety Checks

### 3.1 Excel Simulator Guidelines
* Ensure cell aggregations (`SUM`, `AVERAGE`) handle empty values and strings without throwing runtime errors.
* Prevent infinite dependency loops (e.g. cell `A1` referencing `=B1` while `B1` references `=A1`) by enforcing a maximum evaluation depth limit.
* Catch and resolve mathematical division-by-zero cases (e.g., returning `#DIV/0!` or `0`).

### 3.2 SQL Simulator Guidelines
* Always validate that query inputs are properly sanitized before running evaluations.
* Ensure database table results are scrollable horizontally and vertically so that large tables do not break layout containers.

### 3.3 Drag-and-Drop Operations
* Validate field drop actions and verify dimensions versus measures before triggering SVG visual redraws.
* Provide clear visual outlines around target shelves when elements are dragged over them.

---

## 4. Verification Checklists for AI
Before submitting code changes or opening pull requests:

```
[ ] Step 1: Run TypeScript Type-Check
    Command: npm run type-check

[ ] Step 2: Run ESLint
    Command: npm run lint

[ ] Step 3: Run Unit Test Suite
    Command: npm run test

[ ] Step 4: Run Production Build Test
    Command: npm run build
```

* **No-regression check:** Verify that navigation links in [DashboardLayout.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/layout/DashboardLayout.tsx) open their respective routes cleanly and that the live telemetry clock ticks correctly.
