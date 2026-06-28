# 06. Component Library Guide

## 1. Global Layout & Shell Components

### 1.1 DashboardLayout
The wrapper framework containing the main sidebar navigation and telemetry tracking bar.
* **Path:** `app/components/layout/DashboardLayout.tsx`
* **Props:**
  ```typescript
  interface DashboardLayoutProps {
    children: React.ReactNode;
  }
  ```
* **Key Features:**
  * Collapsible sidebar with SVG icons.
  * Ticking digital UTC clock and user XP tracker.
  * Adaptive layout padding.

---

## 2. Common Reusable UI Elements

### 2.1 CommandCard
Futuristic card component featuring glowing glassmorphism styles.
* **Props:**
  ```typescript
  interface CommandCardProps {
    title?: string;
    subtitle?: string;
    glowColor?: 'cyan' | 'blue' | 'green' | 'red';
    className?: string;
    children: React.ReactNode;
  }
  ```
* **Usage:**
  ```tsx
  import { CommandCard } from '@/app/components/ui/CommandCard';
  
  export default function MyWidget() {
    return (
      <CommandCard title="Active Session" glowColor="cyan">
        <p className="text-slate-300">Terminal feedback active.</p>
      </CommandCard>
    );
  }
  ```

### 2.2 NeonButton
Interactive button containing glowing border highlights and custom hover animations.
* **Props:**
  ```typescript
  interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    glow?: boolean;
  }
  ```

---

## 3. Simulator-Specific Workspaces

### 3.1 Excel Grid Components
Used to compile the Excel spreadsheet environment.
* **ExcelGrid:** Renders the grid coordinates.
* **FormulaBar:** Houses the text input and active cell coordinate indicator.
  ```tsx
  interface FormulaBarProps {
    activeCell: string;
    inputValue: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
  }
  ```

### 3.2 SQL Console Components
Interfaces designed for database table query operations.
* **SqlQueryEditor:** Input field with support for syntax highlighting.
* **SqlResultsTable:** Compiles the query output array into a structured grid.
  ```tsx
  interface SqlResultsTableProps {
    data: Array<Record<string, unknown>>;
  }
  ```
* **SchemaViewer:** Expandable tree displaying tables, columns, and data types.

### 3.3 Power BI & Tableau Shelf Containers
UI layouts representing drag-and-drop components.
* **DropZone:** Target area that fires callbacks when fields are dropped.
  ```typescript
  interface DropZoneProps {
    acceptType: 'dimension' | 'measure';
    onFieldDrop: (field: string) => void;
    activeFields: string[];
    placeholder: string;
  }
  ```
* **FieldList:** Sidebar checklist displaying source metrics and categories.
