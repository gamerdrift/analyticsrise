# 🔍 ANALYTICSRISE – DEVOPS ROOT CAUSE ANALYSIS
## Mission Codename: ONE SOURCE OF TRUTH (Sprint DevOps 1.0)

### Executive Summary
This document provides an exhaustive post-mortem analysis of past deployment inconsistencies where local code updates, navigation fixes, and new features appeared in source code but failed to reflect on the live production website (`analyticsrise.com` & `analyticsrise-56655.web.app`).

---

## 🛑 1. Identified Root Causes

### Root Cause 1: Incremental Next.js & Webpack Caching (`.next/cache`)
- **Symptom**: Webpack cache restoring errors occurred during `npx next build` (`[webpack.cache.PackFileCacheStrategy] Restoring failed for Compilation/modules...`).
- **Impact**: Incremental build artifacts reused stale compiled JavaScript chunks instead of recompiling modified components.
- **Resolution**: Created `scripts/release.js` with `purgeCachedBuilds()` which forcibly purges `.next`, `out`, `dist`, `build`, and `node_modules/.cache` prior to compilation.

### Root Cause 2: Manual Deployment Inconsistencies & Deployment Targets
- **Symptom**: `npx firebase deploy --only hosting` was occasionally run without generating a fresh `npx next build` export, or deployed cached static outputs.
- **Impact**: Firebase Hosting uploaded unchanged static files from previous build runs.
- **Resolution**: Standardized Firebase Hosting target to `hosting.public = "out"` and enforced automated execution via `npm run release`.

### Root Cause 3: Incomplete Navigation Links in Primary Landing Component
- **Symptom**: `LandingNavbar.tsx` (the top navigation bar rendered on `app/page.tsx`) contained `Home`, `Learning Paths`, `Simulators`, `Career Hub`, `Pricing`, but lacked explicit menu array items for `Get Hired`, `About`, and `Contact`.
- **Impact**: Even when the page compiled, the header navigation did not display links to `/get-hired`, `/about`, and `/contact`.
- **Resolution**: Updated `LandingNavbar.tsx` `menuItems` array to include `Get Hired`, `About`, `Contact`, `Career Hub`, `Learning Paths`, `Simulators`, `Pricing`, and `Home`.

### Root Cause 4: Lack of Automated Fingerprint & Bundle Verification
- **Symptom**: Release engineers had no automated runtime mechanism to verify whether the deployed build matched local Git `HEAD`.
- **Impact**: Production could drift from local `main` without instant detection.
- **Resolution**: Implemented `scripts/generate-fingerprint.js`, generating `lib/config/fingerprint.json` rendered dynamically via `<DeploymentFingerprint />` in the footer.

---

## 🛠️ 2. Corrective Actions Implemented

1. **Canonical Repository Identified**: `c:\Users\Vidya\Desktop\AnalyticsRise` certified as the single active production workspace.
2. **Component Synchronization**: Updated `LandingNavbar.tsx` to include `Get Hired`, `About`, and `Contact`.
3. **Clean Build Enforcement**: Integrated `purgeCachedBuilds()` purging `.next`, `out`, `dist`, `build`, and `node_modules/.cache`.
4. **Automated Bundle Verification**: `scripts/release.js` verifies `out/index.html` contains `Get Hired`, `About`, `Contact` prior to deployment.
5. **Deployment Fingerprinting**: Integrated `<DeploymentFingerprint />` in footer displaying Git Commit, Version, Build Number, and Deployment Timestamp.

---

## 🛡️ 3. Permanent Prevention Strategy

- **Rule 1**: Production deployments MUST NEVER be triggered manually. All future deployments must run `npm run release`.
- **Rule 2**: Every deployment MUST automatically purge cached build directories (`.next`, `out`, `dist`, `build`, `node_modules/.cache`).
- **Rule 3**: `npm run release` automatically fails and aborts if `out/index.html` lacks required navbar keywords or if type-check/lint fails.
- **Rule 4**: Git `HEAD` hash must equal local build fingerprint commit hash and match production fingerprint timestamp.
