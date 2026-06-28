# 09. AnalyticsRise Design System (ARDS) Component Library

Welcome to the **AnalyticsRise Design System (ARDS)** documentation guide. This is the single source of truth for all reusable UI components. Every component conforms to Dark-Mode-First layouts, WCAG 2.2 AA accessibility guidelines, dynamic Framer Motion animations, and strict TypeScript types.

---

## 1. Button Components

* **Path:** [Button.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/ui/Button.tsx)
* **Purpose:** Standard interactive buttons with customized design states and sizes.
* **Accessibility:** Fully supports keyboard tab focus outlines (`focus-visible`), aria busy indicators (`aria-busy`), and disabled attributes.

### Props
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}
```

### Usage
```tsx
import { Button } from '@/app/components/ui/Button';
import { Play } from 'lucide-react';

export default function MyButton() {
  return (
    <Button variant="primary" size="md" icon={<Play size={12} />} iconPosition="left">
      Launch Console
    </Button>
  );
}
```

---

## 2. UI Indicators

* **Path:** [Indicators.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/ui/Indicators.tsx)
* **Purpose:** Text badges, dynamic pulsing status dots, popovers, and accessible tooltips.
* **Accessibility:** Tooltips expose `role="tooltip"` and associate contents using `aria-describedby` when hovered or focused via keyboard.

### Props (Badge)
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}
```

### Props (Tooltip)
```typescript
interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
```

### Usage (Status Chip)
```tsx
import { StatusChip } from '@/app/components/ui/Indicators';

export default function MyStatus() {
  return <StatusChip status="success" label="Relational Engine Online" pulse={true} />;
}
```

---

## 3. Cards Library

* **Path:** [Cards.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/cards/Cards.tsx)
* **Purpose:** Content wrappers representing Standard panels, Glass panels, Mission tasks, Simulator quick-launchers, cryptographically signed Certificates, and Stats telemetry.

### Props (SimulatorCard)
```typescript
interface SimulatorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  toolName: string;
  description: string;
  logoColor: string;
  link: string;
}
```

### Usage (CertificationCard)
```tsx
import { CertificationCard } from '@/app/components/cards/Cards';

export default function MyCert() {
  return (
    <CertificationCard
      courseTitle="Enterprise SQL Query Optimization"
      verifyHash="sha256-9b83a218f26a117b"
      issueDate="2026-06-28 18:24 UTC"
    />
  );
}
```

---

## 4. Form Controls

* **Path:** [FormControls.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/forms/FormControls.tsx)
* **Purpose:** Form control inputs supporting Text Inputs, Password visibility toggles, Textareas, Checkboxes, Radios, Switches, Select overlays, Multi-select checkboxes, Search bars, and Button Groups.
* **Accessibility:** Associates inputs with HTML labels using unique `id` hashes and binds error tags with `aria-invalid` and `aria-describedby`.

### Props (Input)
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

### Usage (Toggle Switch)
```tsx
import { Toggle } from '@/app/components/forms/FormControls';
import { useState } from 'react';

export default function ThemeToggle() {
  const [active, setActive] = useState(false);
  return <Toggle label="Active Telemetry Mode" checked={active} onCheckedChange={setActive} />;
}
```

---

## 5. Navigation Shells

* **Path:** [NavControls.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/navigation/NavControls.tsx)
* **Purpose:** Layout frames including Breadcrumb route paths, responsive tab panels, pagination, header Navbars, collapsible Sidebar side sheets, and footers.

### Props (Breadcrumb)
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}
```

### Usage (Tabs Picker)
```tsx
import { Tabs } from '@/app/components/navigation/NavControls';
import { useState } from 'react';

export default function TabsWorkspace() {
  const [tab, setTab] = useState('sql');
  return (
    <Tabs
      activeId={tab}
      onChange={setTab}
      items={[
        { id: 'sql', label: 'SQL Terminal', content: <div>Console View</div> },
        { id: 'excel', label: 'Excel Grid', content: <div>Spreadsheet View</div> }
      ]}
    />
  );
}
```

---

## 6. Data Tables

* **Path:** [TableControls.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/tables/TableControls.tsx)
* **Purpose:** Tabular grids supporting column sorting indicators and search text filters.

### Props
```typescript
interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  rowsPerPage?: number;
}
```

### Usage
```tsx
import { DataTable } from '@/app/components/tables/TableControls';

const cols = [
  { key: 'product', header: 'Product Name', sortable: true },
  { key: 'revenue', header: 'Total Revenue', sortable: true, render: (r: any) => `$${r.revenue}` }
];

export default function MyTable() {
  return <DataTable columns={cols} data={[{ product: 'Database API', revenue: 7500 }]} searchKey="product" />;
}
```

---

## 7. Dialogs & Overlays

* **Path:** [DialogControls.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/dialogs/DialogControls.tsx)
* **Purpose:** Overlay dialogs containing centered Modals, slide-out Drawers, and confirmation windows.
* **Accessibility:** Implements focus traps and document scroll locks. Binds Escape key triggers to automatically fire close actions.

### Props (Modal)
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
}
```

### Usage (ConfirmationDialog)
```tsx
import { ConfirmationDialog } from '@/app/components/dialogs/DialogControls';
import { useState } from 'react';

export default function MyDialog() {
  const [open, setOpen] = useState(false);
  return (
    <ConfirmationDialog
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={() => console.log('Confirm')}
      title="Delete Database Table?"
      message="This action cannot be undone."
    />
  );
}
```

---

## 8. Feedback Banners & Spinners

* **Path:** [FeedbackControls.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/feedback/FeedbackControls.tsx)
* **Purpose:** Alerts, toast alerts with timers, progress bars, loading spinners, skeleton placeholders, empty/success layout views, and mock analytics chart blocks.

---

## 9. Profile & Avatar

* **Path:** [ProfileControls.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/profile/ProfileControls.tsx)
* **Purpose:** Avatar icons with online status circles and profile dropdown menus.

---

## 10. Dashboard Analytics

* **Path:** [DashboardControls.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/dashboard/DashboardControls.tsx)
* **Purpose:** Metrics cards, radial progress indicators, timeline activity logs, level progression bars, and leaderboard cohort scores.

---

## 11. Career Alignments

* **Path:** [CareerControls.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/career/CareerControls.tsx)
* **Purpose:** File uploader widget supporting drag-and-drop actions for PDF documents with progress bars and upload success status.
