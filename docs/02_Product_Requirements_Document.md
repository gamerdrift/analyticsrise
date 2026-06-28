# 02. Product Requirements Document (PRD)

## 1. Overview & Objectives
The goal of AnalyticsRise is to build a modern, interactive web application that provides real-world data analytics training through hands-on simulations. The platform must provide learners with zero-configuration analytical workspaces for Excel, SQL, Power BI, and Tableau directly in their browsers.

---

## 2. Core Functional Requirements

### 2.1 User Management & Gamification Telemetry
* **Authentication:** Support standard authentication methods (Email/Password, Google, and GitHub Sign-In) using Firebase Auth.
* **Telemetry Tracking:**
  * **XP Points:** Accumulate XP for completing labs, lessons, assessments, and daily logins.
  * **Streaks:** Track consecutive days of study, updating the streak counter daily.
  * **Level Progression:** Dynamically calculate user level based on total XP.
* **Profile Management:** Users can view their level, achievements, streaks, and certificates from a centralized dashboard.

### 2.2 Dashboard (Command Center)
* **Status Panels:** Display telemetry summary (current XP, streak, next level target, certificates earned).
* **Console Feed:** Render a live scrolling terminal-like feed reflecting user activity, course completions, and platform updates.
* **Module Quick Launch:** Direct access to resume the current course or open specific sandbox tools.

### 2.3 Simulators (Interactive Sandboxes)
The platform must support four tool simulators with interactive feedback loops:

```
+-------------------------------------------------------------------------+
|                              SIMULATORS                                 |
+------------------------------------+------------------------------------+
|  1. Excel Simulator                |  2. SQL Console                    |
|  - Tabular cell grid & inputs      |  - SQL query editor                |
|  - Formula compiler (=SUM, =AVG)   |  - Client-side database execution  |
|  - Interactive charting/forecasts   |  - Schema details, JSON export     |
+------------------------------------+------------------------------------+
|  3. Power BI Planner               |  4. Tableau Sheet Builder          |
|  - Drag-and-drop shelves/slots     |  - Columns and Rows shelves        |
|  - Field list (dimensions/measures)|  - Dynamic distribution bar graphs |
|  - SVG dashboard visualizer        |  - Sheet aggregation engine        |
+------------------------------------+------------------------------------+
```

* **Excel Simulator:**
  * Render a spreadsheet grid.
  * Support cell selections and manual formula editing.
  * Parse formulas like `=SUM(Range)`, `=AVERAGE(Range)`, subtraction, and addition.
  * Render dynamic SVG charts based on table cell ranges.
* **SQL Simulator:**
  * Syntax-colored SQL code input.
  * Dynamic TS relational database schema execution.
  * Render query results in a clean tabular view.
  * Provide schema structure inspector showing table names, columns, and data types.
* **Power BI Simulator:**
  * Interface with drag-and-drop slots (e.g. Dimensions, Measures, Visual Type).
  * Render responsive SVG bar charts, line charts, or cards based on the selected configuration.
  * Goal-seek validation checking if dimensions and measures align with the lab requirements.
* **Tableau Simulator:**
  * Columns and Rows shelves layout.
  * Interactive field checklist.
  * Update bar distributions dynamically as fields are placed on shelves.

### 2.4 Courses & Curriculum
* **Catalog:** Browse courses by categories (e.g., Fundamentals, SQL Mastery, BI Dashboards).
* **Lesson Player:** View structured markdown lessons alongside code snippets and quick tests.
* **Interactive Labs:** Integrate simulators directly into lessons to guide students through specific tasks.

### 2.5 Assessments & Quizzes
* **Timer Engine:** Run a countdown timer for examination attempts.
* **Answer Compiler:** Collect multiple-choice, select-all, or interactive simulator outputs and check them.
* **Result Metrics:** Provide grading screens with XP rewards and detailed review of incorrect answers.

### 2.6 Cryptographic Certifications
* **Generation Engine:** Dynamically render digital credentials on completion of course milestones.
* **Ledger Validation:** Include unique SHA-256 verification hashes, timestamp metadata, and direct verification routes.

### 2.7 Datasets Library
* **Catalog:** List datasets with formats, rows counts, and industry descriptions.
* **Interactive Schema:** View column descriptions and data types in a grid.
* **Mock Downloads:** Simulate standard CSV/JSON download triggers.

---

## 3. Non-Functional Requirements

### 3.1 Performance & Responsiveness
* **Initial Page Load:** Under 2.0 seconds on standard broadband connections.
* **Simulator Latency:** In-browser formula parsing and SQL queries must compile and display results within 100ms.
* **Offline Resiliency:** UI must notify users if Firebase connectivity is lost and buffer progress variables in localStorage.

### 3.2 Security & Compliance
* **Access Control:** Enforce Firestore security rules protecting user data from unauthorized access.
* **Environment Configuration:** Secure API keys and public identifiers in environment variables.

### 3.3 Design & Aesthetics
* **Theme:** Consistent dark command-center aesthetic, neon cyan and light blue accents.
* **Typography:** Clear hierarchy with Orbitron (Headings), Inter (Body), and JetBrains Mono (Code/Tables).
* **Animations:** Interactive states, micro-transitions, and collapsible slide-outs using Framer Motion.

### 3.4 SEO Best Practices
* **Metadata:** Custom titles and meta descriptions on every route.
* **Semantics:** Structured HTML5 syntax (`<main>`, `<header>`, `<footer>`, `<aside>`, `<nav>`).
* **Attributes:** Distinct IDs and ARIA labels on all interactive items.
