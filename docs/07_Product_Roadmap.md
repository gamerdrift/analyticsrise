# 07. Product Roadmap

## Roadmap Overview
The development of AnalyticsRise is structured into five distinct phases, moving from initial simulator layout definitions to production-grade integrations, WebAssembly capabilities, and collaborative enterprise tooling.

```
+--------------------------------------------------------------------------+
|                            ROADMAP TIMELINE                              |
+-------------------+-------------------+----------------------------------+
| Phase             | Objectives        | Status                           |
+-------------------+-------------------+----------------------------------+
| 1. Foundation     | Simulators, theme | Completed                        |
+-------------------+-------------------+----------------------------------+
| 2. Integrations   | DB, Auth, Profile | In Progress                      |
+-------------------+-------------------+----------------------------------+
| 3. WASM Engine    | SQLite / SQLite3  | Planned (Short Term)             |
+-------------------+-------------------+----------------------------------+
| 4. Enterprise     | SSO, Org Portal   | Planned (Mid/Long Term)          |
+-------------------+-------------------+----------------------------------+
| 5. AI Tutoring    | Automated tips    | Future Vision                    |
+-------------------+-------------------+----------------------------------+
```

---

## 1. Phase 1: Core Simulator Foundation
* **Goal:** Build in-browser simulator engines (Excel, SQL, Power BI, Tableau) and global layout controls.
* **Milestones:**
  * Define color tokens, typography (Orbitron/Inter/Mono), and grid styling.
  * Implement [DashboardLayout.tsx](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/components/layout/DashboardLayout.tsx) with a collapsible navigation sidebar and user telemetry bar.
  * Create the root telemetry panel and scrolling console logger.
  * Build the Excel parser (formula aggregators, dynamic SVG charts).
  * Build the SQL console (mock relational engine, schema viewer).
  * Build the Tableau sheet shelves and the Power BI drag-and-drop slots.
* **Status:** **Completed** ✅

---

## 2. Phase 2: User Persistence & Live Integrations
* **Goal:** Store student progress and manage authentication.
* **Milestones:**
  * Set up Firebase configuration templates.
  * Deploy Firebase Auth for email/password and social logins (Google, GitHub).
  * Connect telemetry variables (XP, Streaks, Levels) directly to Firestore documents.
  * Build the timed quiz validation engine to write submission logs.
  * Enable certificate validation routes to fetch SHA-256 validation records from Firestore.
* **Status:** **In Progress** 🔄

---

## 3. Phase 3: WebAssembly & Advanced Engine Features
* **Goal:** Expand simulator capabilities to support complex analytical operations.
* **Milestones:**
  * **SQL WebAssembly:** Integrate `SQL.js` (SQLite compiled to WebAssembly) to support actual database tables, `JOIN` queries, subqueries, and standard database manipulation logic.
  * **Excel Workbook Sheets:** Upgrade Excel state to support multiple workbook sheets and formula dependencies between sheets.
  * **Power BI Dashboards:** Support multi-visual dashboards and interactive cross-filtering (clicking a slice in a pie chart filters the bar chart).
* **Status:** **Planned (Short-Term)** 📅

---

## 4. Phase 4: Enterprise & Team Dashboards
* **Goal:** Enable schools and corporate organizations to manage analytical learning pathways.
* **Milestones:**
  * **SSO Integration:** Support SAML and Okta single sign-on authentication.
  * **Classroom Management:** Allow managers or teachers to assign specific tasks and view progress reports.
  * **Custom Lab Creator:** Build a visual interface for educators to import custom dataset tables and set verification targets.
* **Status:** **Planned (Mid/Long-Term)** 📅

---

## 5. Phase 5: Interactive AI Tutor
* **Goal:** Guide users through complex analytical tasks using interactive AI feedback.
* **Milestones:**
  * **SQL Error Debugger:** Provide helpful tips when queries contain syntax issues or logical mistakes.
  * **Dashboard Counselor:** Provide analysis tips regarding visual choice selections (e.g. suggesting a line chart instead of a pie chart for trend lines).
* **Status:** **Future Vision** 🚀
