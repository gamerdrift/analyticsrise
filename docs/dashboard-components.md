# ARCC Dashboard Components

This document outlines the visual components and interactive widgets developed for the **AnalyticsRise Command Center (ARCC)**.

---

## 1. Top Navigation Bar (Header)

* **Path:** `app/components/layout/DashboardLayout.tsx` (sticky header wrapper)
* **Sub-Components:**
  * **Global Search Modal:** Triggers on `Search` button click or shortcut. Features real-time matching query filtering.
  * **Language Selector Dropdown:** Supports active language updates. Persists selected locale to the Firestore profile document.
  * **Notification Center Popover:** Lists latest platform course recommendations and daily study streak updates.
  * **Theme Toggle:** Interfaces with `useTheme` context to switch CSS variables between `.dark` and `.light` modes.
  * **Profile Menu:** Drops down account details, membership level, and triggers the `signOut` authentication request.

---

## 2. Left Sidebar (Navigation List)

* **Path:** `app/components/layout/DashboardLayout.tsx`
* **Features:**
  * Collapsible layout using Framer Motion animations.
  * Active route indicators matching path prefixes.
  * Sidebar elements mapping icons and navigation links.

---

## 3. Command Center Content Widgets

* **Path:** `app/(pages)/dashboard/page.tsx`
* **Widgets Catalog:**
  * **Welcome Banner Widget:** Returns dynamic greet strings based on UTC/local hour. Displays user displayName, current study level, and active streak.
  * **Quick Stats Cards Grid:** Displays numeric values for XP, consecutive active days, completed syllabus courses, and total practice hours.
  * **Learning Roadmap Flowchart:** Uses inline nodes mapping Excel → SQL → Power BI → Tableau → Python → Capstone. Connects elements using glowing neon lines indicating completed tasks. Renders a selection panel if no goal is configured in profile telemetry.
  * **Today's Featured Mission:** Card outlining active lab tasks, XP rewards, difficulty metrics, progress bars, and sandbox launch buttons.
  * **Syllabus Progress Tracker:** Prompts continuation of active modules.
  * **Learning DNA Radar Chart:** Renders a custom SVG radar polygon representation of relative skills scores in databases and spreadsheets.
  * **Achievements Showcase:** Displays earned badges (in color) and locked badges (translucent gray).
  * **Coming Soon Preview Panel:** Lists disabled, locked premium features (Interview Simulator, ATS Scanner, ATS Recruiter Console).
