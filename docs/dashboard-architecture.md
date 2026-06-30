# ARCC Dashboard Architecture

This document describes the high-level architecture, module design, and layout grid paradigms used in the **AnalyticsRise Command Center (ARCC)**.

---

## 1. Grid & Layout System

The dashboard layout is managed at the route-group level by `app/components/layout/DashboardLayout.tsx`. It implements a dynamic grid structure that is highly responsive across multiple screen dimensions:

* **Desktop Layout (>= 1024px)**:
  * Expandable left sidebar (toggles width between `w-64` and `w-20`).
  * Sticky header (`h-16`) at the top containing brand logos, search overlays, language dropdowns, and profile controls.
  * Three-column main layout container with nested flex boxes.
* **Tablet Layout (>= 768px and < 1024px)**:
  * Compact sidebar (`w-20` fixed) to preserve horizontal space.
  * Sticky header at the top.
  * Adaptive single-column grid wrapper.
* **Mobile Layout (< 768px)**:
  * Hidden sidebar replaced by a Mobile Bottom Navigation bar pointing to major feature nodes.
  * Sticky top header with a Menu icon that slides out a comprehensive Navigation Drawer.

---

## 2. Component Hierarchies

```
+-----------------------------------------------------------+
|                      DashboardLayout                      |
|  +-----------------+-----------------------------------+  |
|  |     Sidebar     |              TopNav               |  |
|  |  (Collapsible)  |  (Search / Lang / Notify / Theme) |  |
|  +-----------------+-----------------------------------+  |
|  |                 |                                   |  |
|  |                 |       RootDashboardPage           |  |
|  |                 |       +-----------------------+   |  |
|  |                 |       | WelcomeBanner         |   |  |
|  |                 |       +-----------------------+   |  |
|  |                 |       | QuickStatsGrid        |   |  |
|  |                 |       +-----------+-----------+   |  |
|  |                 |       | Roadmap   | SkillsDNA |   |  |
|  |                 |       +-----------+-----------+   |  |
|  |                 |       | Missions  | LogFeed   |   |  |
|  |                 |       +-----------+-----------+   |  |
|  +-----------------+-----------------------------------+  |
+-----------------------------------------------------------+
```

---

## 3. High Performance Optimization

The dashboard utilizes lazy loading for secondary widgets to decrease initial page payload size:

* Dynamic Next.js imports (`next/dynamic`) are leveraged for widgets loaded based on user interactions.
* Skeleton screens (`SkeletonLoader`) represent loading states during Firestore query compilation, eliminating layout shifts.
* SVG elements are used directly for radar graphics rather than large external canvas charts, saving bundle overhead.
