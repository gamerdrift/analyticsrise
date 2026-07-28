# 📦 AnalyticsRise — Production Manifest

## Release Baseline: v1.0.0-beta

This manifest documents the exact environment, build tools, framework versions, configuration parameters, and deployment targets representing **Release v1.0.0-beta (Mission FOUNDATION)**.

---

## ⚙️ Environment & Runtime Specifications

| Parameter | Value |
| :--- | :--- |
| **Release Version** | `v1.0.0-beta` |
| **Release Date** | `2026-07-28` |
| **Git Baseline Commit** | `3654a97` |
| **Git Baseline Tag** | `v1.0.0-beta` |
| **Node.js Runtime** | `v26.2.0` (compatible with `v20.x` LTS) |
| **Package Manager** | `npm v10.x` |
| **Framework** | Next.js `14.2.35` (App Router) |
| **UI Engine** | React `18.3.1` |
| **Grid Engine** | `react-window` `1.8.10` |
| **Icons Library** | `lucide-react` `0.378.0` |
| **Deployment Engine** | Firebase CLI (`npx firebase-tools`) |
| **Hosting CDN** | Firebase Hosting Global Edge |

---

## 🎯 Firebase Hosting Configuration

- **Firebase Project ID**: `analyticsrise-56655`
- **Configuration File**: `firebase.json`
- **Project Target File**: `.firebaserc`
- **Public Export Directory**: `out`
- **Clean URLs**: `true`
- **Output Asset File Count**: 309 static files
- **Primary Custom Domain**: [https://analyticsrise.com](https://analyticsrise.com)
- **Firebase Subdomain**: [https://analyticsrise-56655.web.app](https://analyticsrise-56655.web.app)

---

## 🔨 Production Commands

### 1. Build Verification & Export Command
```bash
npm run build:fast
```
*Script Execution*: `npx next build` -> static export into `/out`.

### 2. Type Check & Validation Commands
```bash
npx tsc --noEmit
npm run lint
```

### 3. Production Firebase Deployment Command
```bash
npx firebase deploy --only hosting
```

---

## 🔐 Security & HTTP Headers

Applied in `firebase.json`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cache-Control: public, max-age=3600` for static assets.
