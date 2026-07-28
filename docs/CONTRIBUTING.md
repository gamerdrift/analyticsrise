# 🤝 Contributing to AnalyticsRise

Thank you for contributing to AnalyticsRise! This document outlines our engineering standards, branch naming conventions, pull request procedures, and code quality expectations.

---

## 🛠️ Development Workflow

1. **Clone & Install**:
   ```bash
   git clone https://github.com/gamerdrift/analyticsrise.git
   cd AnalyticsRise
   npm install
   ```

2. **Branch Naming**:
   - Features: `feat/feature-name` (e.g., `feat/excel-pivot-tables`)
   - Fixes: `fix/bug-description` (e.g., `fix/formula-vlookup-case`)
   - Documentation: `docs/doc-update`

3. **Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Code Validation**:
   Before creating a commit or opening a PR, always run:
   ```bash
   # Type check
   npx tsc --noEmit

   # Lint check
   npm run lint

   # Fast build verification
   npm run build:fast
   ```

---

## 📏 Coding Standards

- **TypeScript**: Strict mode enabled. Always define explicit prop types and interface contracts; avoid `any` unless required for third-party library boundaries.
- **Components**: Functional React components using Next.js App Router hooks (`useClient`, `useState`, `useEffect`, `useReducer`).
- **Styling**: Tailwind CSS with custom theme variables. Use glassmorphism tokens (`bg-[#0D1117]`, `border-[#00E5FF]/20`, `text-[#00E5FF]`).
- **Icons**: Import icons from `lucide-react`.

---

## 📝 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
```

Examples:
- `feat(excel-studio): add support for XLOOKUP function`
- `fix(grid): resolve virtualized scroll offset recalculation`
- `docs(release): update RELEASE_v1.0.md baseline checklist`
