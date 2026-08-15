# RevenueRiseAI — Deployment Architecture & CI/CD Pipeline

**Document Version:** 1.0.0
**Author:** Principal DevOps & Site Reliability Engineer
**Status:** Approved Architectural Proposal

---

## 1. Deployment Topology & Environments

RevenueRiseAI is configured across three standardized operational environments:

| Environment | Purpose | URL / Target | Backend Strategy |
|-------------|---------|--------------|------------------|
| **Development** | Local iterative engineering & testing | `http://localhost:3000` | Firebase Local Emulator Suite (Auth, Firestore, Functions) |
| **Staging / Preview** | Automated PR verification & QA audit | `https://staging.revenuerise.ai` | Dedicated Staging Firebase Project (`revenuerise-staging`) |
| **Production** | Authoritative global customer traffic | `https://revenuerise.ai` | Global CDN + Cloud Functions v2 (Production Firebase Project) |

---

## 2. Firebase Multi-Site Hosting Strategy

To allow independent deployments without conflicting with AnalyticsRise's main static bundle, Firebase Multi-Site hosting is configured in `firebase.json`:

```json
{
  "hosting": [
    {
      "target": "analyticsrise-web",
      "public": "out",
      "cleanUrls": true
    },
    {
      "target": "revenuerise-app",
      "public": "out-revenuerise",
      "cleanUrls": true,
      "rewrites": [
        {
          "source": "/api/ai/**",
          "function": "revenueriseAIGateway"
        },
        {
          "source": "/api/simulation/**",
          "function": "revenueriseSimulationGateway"
        }
      ]
    }
  ]
}
```

---

## 3. GitHub Actions CI/CD Pipeline Specification

The deployment pipeline is automated through `.github/workflows/revenuerise-deploy.yml`:

```
[ Push to feature/* / PR # ]
              |
              v
[ Step 1: Clean Dependency Isolation (npm ci) ]
              |
              v
[ Step 2: Static Analysis & Linting (npm run lint) ]
              |
              v
[ Step 3: TypeScript Type-Check (npm run type-check) ]
              |
              v
[ Step 4: Unit & Integration Tests (npm test - 100% Pass Required) ]
              |
              v
[ Step 5: Next.js Production Build & Static Asset Verification ]
              |
              v
[ Step 6: Deploy Preview to Staging Channel ]
              |
              v
[ MERGE TO MAIN ] ---> [ Deploy to Production + Health Check Certification ]
```

---

## 4. Secret & Environment Configuration

All private API tokens and encryption keys are injected securely via Google Cloud Secret Manager at function initialization time:
- `GEMINI_API_KEY`: Google AI Studio / Vertex AI service key.
- `CLAUDE_API_KEY`: Anthropic API key.
- `OPENAI_API_KEY`: OpenAI API key.
- `CERTIFICATE_SIGNING_SECRET`: HMAC SHA-256 signing secret.
- `MARKET_DATA_API_KEY`: Premium financial tick data provider secret.

*Client-side bundle only receives non-sensitive public configuration (e.g., `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_APP_URL`).*
