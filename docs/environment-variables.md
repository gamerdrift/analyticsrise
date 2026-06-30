# Environment Variables Configuration Guide

This document describes how to configure the local, staging, and production environment configurations for the **AnalyticsRise** application stack.

---

## Local Configuration File (`.env.local`)

1. Copy the documented example template to a local environment file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and replace the placeholder keys with your authentic Firebase project credentials.
3. The `.env.local` file is listed in `.gitignore` and must **never** be committed to GitHub.

---

## Variable Reference Catalog

### 1. Firebase Client SDK (Prefix: `NEXT_PUBLIC_`)
These parameters configure the Firebase Client SDK directly in the browser runtime.

- `NEXT_PUBLIC_FIREBASE_API_KEY`: The API key generated for your Firebase web application (e.g. `AIzaSyA1...`).
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Auth domain URL (e.g. `analyticsrise-56655.firebaseapp.com`).
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: The primary Firebase Project ID (`analyticsrise-56655`).
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Storage bucket URL (e.g. `analyticsrise-56655.appspot.com`).
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Unique integer sender ID for Cloud Messaging.
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Unique identifier generated for the Web Client.
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Google Analytics measurement identifier (e.g. `G-XXXXXXXXXX`).

### 2. Firebase Admin SDK (Server Only - No Prefix)
These variables are reserved strictly for Backend Server contexts (Next.js server-side API routes, getServerSideProps, or Server Actions).

- `FIREBASE_ADMIN_SDK_KEY`: A JSON string containing the private key credential file issued for your Service Account in the Google Cloud Console.

### 3. Application Configurations
- `NODE_ENV`: Runtime identifier (`development`, `production`, `test`).
- `NEXT_PUBLIC_APP_URL`: The host origin of the application UI (e.g., `http://localhost:3000` locally, or `https://analyticsrise-56655.web.app` in production).
- `NEXT_PUBLIC_API_URL`: Root path of the Next.js API endpoints.

---

## Safety Requirements

> [!CAUTION]
> **Credential Safety & Git Violations:**
> - Never commit your `.env.local` to public repositories.
> - Private keys (such as `FIREBASE_ADMIN_SDK_KEY`) must never be prefixed with `NEXT_PUBLIC_`. Prefixing a variable with `NEXT_PUBLIC_` triggers the Next.js builder compiler to bundle and expose the value inside client-side JS bundles, exposing your credentials to the browser console.
