# ARCC Dashboard Routing

This document details the route structure, middleware checks, and route protection rules for the **AnalyticsRise Command Center (ARCC)**.

---

## 1. Route Map

The ARCC is served from the `/dashboard` path and wraps pages in layout shells:

* `/dashboard` -> `app/(pages)/dashboard/page.tsx` (Command Center)
* Layout -> `app/components/layout/DashboardLayout.tsx` (Provides responsive headers and sidebar wrappers)

---

## 2. Route Protection (Authentication Guard)

Route security is enforced client-side inside the `DashboardLayout` shell to ensure static compilation safety:

* **Session Validation**: On mount, the layout checks `isAuthenticated` and `loading` states from `useAuth()`.
* **Redirects**: Unauthenticated requests are immediately redirected back to `/login` via Next.js `useRouter`.
* **Cookie Synchronization**: The `AuthContext` writes temporary JWT cookies (`__session`) to allow server edge routing filters where needed.

---

## 3. Navigation Targets

The left sidebar maps items directly to specific route endpoints or dashboard tab parameters:

| Sidebar Navigation Name | Route Mappings |
|-------------------------|----------------|
| Dashboard               | `/dashboard` |
| Learning Missions       | `/dashboard?tab=missions` |
| Courses                 | `/courses` |
| Practice Labs           | `/practice` |
| Simulators              | `/dashboard?tab=simulators` |
| Datasets                | `/datasets` |
| Assessments             | `/assessments` |
| Certifications           | `/certifications` |
| Career Center           | `/dashboard?tab=career` |
| Community               | `/community` |
| Leaderboard             | `/leaderboard` |
| Achievements            | `/dashboard?tab=achievements` |
| Settings                | `/dashboard?tab=settings` |
| Support                 | `/help` |
| Logout                  | Triggers `signOut()` |
