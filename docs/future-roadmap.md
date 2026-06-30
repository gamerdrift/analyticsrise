# Backend Integration & Infrastructure Roadmap

This document outlines the engineering timeline for expanding the backend systems from this foundation to full production capability.

---

## Phase 2 (Current): Auth Integration & Telemetry Sync

### 1. Client-Side Authentication UI (Epic 3.2)
- Build the React login/signup views.
- Integrate [AuthService](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/services/auth.ts) to execute email/password sign-in.
- Integrate Google and GitHub login triggers.
- Wrap route components in [AuthProvider](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/contexts/AuthContext.tsx) to ensure secure cookie synchronization.

### 2. Live Telemetry Update Sync
- Connect simulator achievements directly to Firestore updates.
- Set up real-time listener hooks that synchronize user streak variables and XP levels to the dashboard.

---

## Phase 3: Firebase Cloud Functions

To maintain platform safety, client-side actions should be verified using backend processes:

1. **Cryptographic Certificate Issuer:**
   - Instead of creating certificates client-side, the client invokes a HTTPS Cloud Function `issueCertificate`.
   - The function verifies that the user has passed the required assessments in Firestore.
   - If verified, it computes a SHA-256 hash, issues the certificate payload, and writes it to `/certificates`.
2. **Leaderboard Cohort Aggregations:**
   - Schedule a cron trigger that aggregates total student XP scores and writes them to a `/leaderboard/cohorts` document hourly.
   - This keeps query costs low by replacing millions of individual document reads with a single cached leaderboard read.

---

## Phase 4: WebAssembly relational SQL Console

- Replace mock database structures in [Sql Console](file:///c:/Users/Vidya/Desktop/AnalyticsRise/app/simulators/sql/) with a real SQL.js (SQLite WebAssembly) database client.
- Automatically seed database structures into memory from static dataset files stored in Firebase Storage.
