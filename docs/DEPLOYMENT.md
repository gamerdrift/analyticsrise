# 🚀 AnalyticsRise — Deployment & Operations Guide

## Overview
AnalyticsRise is deployed as a static Next.js application exported to HTML/JS/CSS assets and served globally via Firebase Hosting CDN.

---

## 🛠️ Prerequisites
- **Node.js**: `v20.x` or `v26.x`
- **Package Manager**: `npm`
- **Firebase CLI**: `npx firebase-tools` / `npx firebase`
- **Git**: `v2.x`

---

## ⚙️ Environment Configuration

Ensure `.env.local` or environment variables contain necessary client-side variables:

```env
NEXT_PUBLIC_APP_NAME="AnalyticsRise"
NEXT_PUBLIC_APP_VERSION="1.0.0-beta"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="analyticsrise-56655"
```

---

## 🔨 Build Procedure

To compile the production bundle:

```bash
# 1. Install dependencies
npm install

# 2. Type check
npx tsc --noEmit

# 3. Linting
npm run lint

# 4. Production build export
npm run build:fast
```

The build command executes `npx next build` which produces static HTML, JavaScript, and CSS assets inside the `/out` directory.

---

## ☁️ Firebase Deployment Procedure

Deploying to Firebase Hosting:

```bash
# Deploy hosting target
npx firebase deploy --only hosting
```

### Deploy Verification Checklist:
1. Confirm Firebase project ID matches `analyticsrise-56655`.
2. Confirm target domains resolve:
   - [https://analyticsrise.com](https://analyticsrise.com)
   - [https://analyticsrise-56655.web.app](https://analyticsrise-56655.web.app)
3. Confirm 309 static assets are uploaded cleanly.

---

## 🔁 Rollback & Emergency Recovery

If a deployment contains an unforeseen issue:

### Method A: Firebase Console 1-Click Rollback
1. Open [Firebase Console](https://console.firebase.google.com/project/analyticsrise-56655/hosting/sites).
2. Under **Release History**, locate the previous healthy release (e.g. Release `v1.0.0-beta`).
3. Click the 3-dots menu and select **Rollback**.

### Method B: Git Baseline Re-Deploy
```bash
git checkout v1.0.0-beta
npm run build:fast
npx firebase deploy --only hosting
```
