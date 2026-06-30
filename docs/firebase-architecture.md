# Firebase Architecture & Infrastructure Foundation

This document details the backend engineering architecture for **AnalyticsRise**, detailing authentication, data persistence, client-side tracking, and cloud routing structures.

---

## Architecture Topology

The application uses a serverless decoupled pattern. High-performance browser simulator sandboxes communicate directly with Firebase Services for real-time reads and writes, while routing guards run at the edge using Next.js Middleware.

```
                  +-------------------------------------------------+
                  |                PRESENTATION LAYER               |
                  |             Next.js 14 (App Router)             |
                  +------------------------+------------------------+
                                           |
                                           v
                  +-------------------------------------------------+
                  |                ROUTING & GUARDS                 |
                  |         Next.js Edge Middleware (.ts)           |
                  |       Reads: __session & user-role cookies      |
                  +------------------------+------------------------+
                                           |
                                           v
                  +-------------------------------------------------+
                  |                 SERVICES LAYER                  |
                  |      AuthService | UserService | StorageService |
                  +------------------------+------------------------+
                                           |
                                           v
    +-------------------------+------------+------------+-------------------------+
    |                         |                         |                         |
    v                         v                         v                         v
+-------+                 +-------+                 +-------+                 +-------+
| Auth  |                 | DB    |                 | Storage|                 | Event |
| SDK   |                 | SDK   |                 | SDK   |                 | SDK   |
+-------+                 +-------+                 +-------+                 +-------+
```

---

## 1. Auth & Session Management

- **Client Session Initialization:** Firebase Auth initializes once inside the client context provider [AuthProvider](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/contexts/AuthContext.tsx) to prevent duplicate subscriptions.
- **Session Bridging (Edge to Client):**
  - Standard Firebase authentication is managed asynchronously on the client via IndexedDB.
  - To enable Next.js Server Routing guards without round-trips to a custom server, the `AuthProvider` listens to auth state transitions and sets/clears two secure, SameSite cookies:
    - `__session`: Raw Firebase ID token (JWT).
    - `user-role`: Extracted user role (e.g. `student`, `admin`).
- **Security Check:** Edge Middleware intercepts routing based on these cookies, while Firestore/Storage Security Rules double-check user authentication and authorization using cryptographically verified signatures.

---

## 2. Service Architecture

All backend features are isolated within clean service files under [lib/services/](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/services/):

1. [AuthService](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/services/auth.ts): Handles credentials login, signup, Google/GitHub SSO, token retrieval, and logout.
2. [UserService](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/services/user.ts): Synchronizes user records, initializes default telemetry (XP, levels, streaks), and awards achievements.
3. [FirestoreService](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/services/firestore.ts): A generic wrapper over Firestore modular functions to provide type-safe CRUD utilities.
4. [StorageService](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/services/storage.ts): Manages file uploads (avatars, resumes) and download url resolver.
5. [AnalyticsService](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/services/analytics.ts): Tracks telemetry events in production while falling back to the console logger during local development.

---

## 3. Error Translation & Logging

- **Logging:** The custom [logger](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/utils/logger.ts) filters out verbose debug messages in production while keeping errors and warnings active for system health reporting.
- **Error Resolution:** The centralized [error handler](file:///c:/Users/Vidya/Desktop/AnalyticsRise/lib/utils/error.ts) intercepts exceptions and translates codes (e.g. `auth/wrong-password`, `permission-denied`) into plain, user-facing error logs.
