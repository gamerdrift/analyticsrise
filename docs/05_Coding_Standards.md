# 05. Coding Standards & Guidelines

## 1. Code Style & Formatting
To ensure consistency across the development team, AnalyticsRise enforces strict formatting rules:
* **Prettier:** Code formatting is automatically verified. Configuration is specified in `.prettierrc.json`.
* **ESLint:** Code quality rules are configured in `.eslintrc.json`. All lint warnings must be resolved prior to merging changes.
* **Imports:** Keep import statements grouped:
  1. React core and Next.js dependencies.
  2. Third-party packages (Framer Motion, Firebase, Lucide icons).
  3. Shared hooks, utils, and types.
  4. Local layout assets and child components.

---

## 2. TypeScript Best Practices
* **Strict Type Checking:** `strict: true` must be enabled in `tsconfig.json`.
* **Avoid `any`:** Do not use `any` unless absolutely necessary (e.g. parsing external JSON feeds with unknown structure). Use `unknown` or define a strong interface instead.
* **Component Prop Interfaces:** Define props explicitly for all React components:
  ```typescript
  interface CardProps {
    title: string;
    description: string;
    isActive?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
  }
  ```
* **State Typing:** Type your state variables, especially when dealing with complex structures like cell records:
  ```typescript
  type CellData = Record<string, { raw: string; computed: string }>;
  ```

---

## 3. React Component Development
* **Functional Components:** All components must use functional declarations with hooks.
* **Separation of Logic:** Keep components clean. Extracted math, formula parsing, or database mock calculations must reside in custom hooks (e.g., `useSqlEngine.ts`, `useFormulaParser.ts`) or static utility functions.
* **Memoization:**
  * Wrap heavy computation logic (such as spreadsheet aggregations) in `useMemo`.
  * Pass memoized callbacks (`useCallback`) to child inputs to prevent unnecessary re-renders.
* **File Naming:**
  * Components must use PascalCase (e.g., `GameCard.tsx`, `TelemetryPanel.tsx`).
  * Hooks, utils, and assets must use camelCase (e.g., `useSqlParser.ts`, `formatDate.ts`).

---

## 4. Styling & Tailwind CSS
* **Utility-First Styling:** Use Tailwind utility classes for formatting. Do not write inline `style={{ ... }}` blocks unless applying dynamically computed coordinates (e.g., cursor tracking or drag offsets).
* **Color Tokens:** Always reference the predefined colors in `tailwind.config.ts` (e.g., `text-primary`, `bg-surface`, `border-border`) rather than hardcoded Hex colors.
* **Responsive Layouts:** Apply responsive breakpoints (`md:`, `lg:`) to ensure components scale gracefully down to tablet views. For simulators that require large desktop viewports, render an overlay message explaining the limitation instead of breaking the UI.

---

## 5. Commit & Git Workflow
We use semantic commit structures:

| Commit Prefix | Description | Example |
| :--- | :--- | :--- |
| `feat:` | Introducing a new feature or interactive element | `feat: add formula validation to Excel simulator` |
| `fix:` | Fixing an error, bug, or validation issue | `fix: resolve SQL syntax parser empty select crash` |
| `refactor:` | Reworking code structure without changing features | `refactor: optimize cell re-render logic in grid` |
| `docs:` | Creating or updating documentation files | `docs: add technical architecture guidelines` |
| `chore:` | Updating dependencies, configs, or tooling | `chore: upgrade framer-motion library dependencies` |

### Branch Naming Conventions:
* `feature/feature-name` (e.g., `feature/sql-aggregation-support`)
* `bugfix/issue-name` (e.g., `bugfix/excel-average-div-zero`)
* `docs/document-name` (e.g., `docs/component-library-guide`)

---

## 6. Testing Standards
* **Unit Tests:** Any simulator calculation updates must have corresponding Jest tests in `__tests__/`.
* **Testing Commands:**
  * Run verification tests: `npm run test`
  * Run TypeScript type-check: `npm run type-check`
  * Run linter suite: `npm run lint`
