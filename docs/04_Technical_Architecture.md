# 04. Technical Architecture

## 1. System Overview
AnalyticsRise utilizes a modern, serverless web architecture optimized for fast load times and interactive performance. The frontend is built on **Next.js 14** using the React App Router, and the backend relies on **Firebase Services** for authentication, database persistence, and cloud computations.

```
+-----------------------------------------------------------------------+
|                           PRESENTATION LAYER                          |
|         Next.js 14 App Router - React Components - Tailwind CSS       |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                         APPLICATION LOGIC LAYER                       |
|           Zustand State Store - Custom Hook Evaluators                |
|       In-Memory Relational SQL Engine - Excel Formula Compiler        |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                          INTEGRATION API LAYER                        |
|       Firebase SDK Web Client - Firestore Security Rules Checks       |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                           PERSISTENCE LAYER                           |
|          Cloud Firestore NoSQL - Firebase Authentication              |
+-----------------------------------------------------------------------+
```

---

## 2. Component Directory Architecture
The repository is structured to separate layout grids, pages, shared components, and simulator engines:
```
c:\Users\Vidya\Desktop\AnalyticsRise/
├── app/
│   ├── layout.tsx                # App root wrapper & typography imports
│   ├── page.tsx                  # Landing / dashboard command center
│   ├── components/               # Layout components
│   │   └── layout/
│   │       └── DashboardLayout.tsx # Sidebar, header, & telemetry clock
│   ├── (pages)/                  # Feature routes (Auth required)
│   │   ├── courses/              # Lesson registry
│   │   ├── datasets/             # Data catalog and schemas
│   │   ├── assessments/          # Timed exam layouts
│   │   ├── certifications/       # Verifiable certificate rendering
│   │   └── leaderboard/          # Gamified ranking listings
│   └── simulators/               # Workspace simulators
│       ├── excel/                # Grid, formula compiler, SVG charts
│       ├── sql/                  # Console, schema explorer, mock DB
│       ├── powerbi/              # Canvas, field list, visual dropzone
│       └── tableau/              # Rows/Columns shelf, chart cards
├── lib/
│   ├── firebase/                 # Client configurations
│   ├── hooks/                    # Reusable React hooks
│   └── utils/                    # Shared helper methods
└── styles/
    └── globals.css               # Core styling tokens and scrollbars
```

---

## 3. Simulator Architecture & Core Engines

### 3.1 Excel Simulator Engine
* **Cell Grid State:** Represented as a key-value record mapping coordinates (e.g. `B2`) to a cell object containing raw input and parsed outcomes.
* **Formula Compiler:** Parses formulas beginning with `=` using a regex token analyzer:
  * Range parsing (e.g., `B2:B5`) expands into individual cell coordinates.
  * Direct functions (`SUM`, `AVERAGE`) aggregate floating-point conversions of referenced cells.
* **Chart Generator:** Subscribes to cell coordinate changes and renders SVG elements (columns, line paths, legends) in real-time.

### 3.2 SQL Simulator Engine
* **Client-Side Relational Database:** Utilizes a custom client-side TypeScript execution parser that stores mocked relational tables (e.g. `users`, `orders`, `transactions`) in state memory.
* **Query Parser:** Evaluates standard query patterns:
  * Select columns: `SELECT column1, column2...`
  * Filters: `WHERE column = 'value'`
  * Aggregations: `SUM`, `COUNT`, `AVG`
  * Sorting: `ORDER BY column DESC/ASC`
* **Output Generator:** Returns standard JSON array objects mapped directly to columns in the output table.

### 3.3 Power BI & Tableau Engines
* **Drag-and-Drop / Interactive Shelves:** Registers drops of dimensions or measures into visual slots.
* **Aggregator Node:** Automatically groups and aggregates measure metrics based on the mapped dimension groups (e.g. summing total profits by continent).
* **Goal Verification:** Checks if the user's slot mappings match the target layout signature before completing lab tasks.

---

## 4. Firestore Database Schema

### 4.1 `/users/{userId}` (User Document)
* **profile:** `{ displayName: string, email: string, avatarUrl: string }`
* **telemetry:** `{ xp: number, points: number, level: number, streak: number, lastActiveDate: string }`
* **achievements:** `Array<{ id: string, name: string, earnedAt: string }>`

### 4.2 `/courses/{courseId}` (Course Catalog)
* **metadata:** `{ title: string, description: string, duration: string, difficulty: string }`
* **modules:** `Array<{ title: string, lessons: Array<{ id: string, title: string, type: 'reading' | 'lab' }> }>`

### 4.3 `/submissions/{submissionId}` (Assessment Records)
* **userRef:** `/users/{userId}`
* **assessmentId:** `string`
* **score:** `number`
* **answers:** `Record<string, string>`
* **passed:** `boolean`
* **timestamp:** `string`

### 4.4 `/certificates/{certificateId}` (Verifiable Credentials)
* **recipient:** `{ userId: string, name: string }`
* **courseId:** `string`
* **courseTitle:** `string`
* **issueDate:** `string`
* **sha256Hash:** `string` (Cryptographic verification code computed from recipient, course, and timestamp)

---

## 5. Security & Verification Strategy
1. **Firebase Security Rules:** Firestore access checks ensure users can only modify their own profiles and progress logs.
2. **Read-Only Schemas:** Course catalogs and dataset libraries are configured as read-only for public/student access, allowing updates only via admin authorization.
3. **Client-Side Validation:** Assessment submissions are graded client-side, but certificate issue requests invoke a serverless Firebase Cloud Function to verify database test logs.
