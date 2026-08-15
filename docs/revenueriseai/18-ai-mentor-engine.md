# RevenueRiseAI — Mission 03 Technical Specification: AI Mentor Intelligence Engine

**Document Version:** 1.0.0
**Phase:** Mission 03 — AI Mentor Intelligence Engine
**Author:** Principal AI Systems Architect & Security Engineer
**Status:** Implemented & Validated

---

## 1. Executive Overview

Mission 03 transitions **RevenueRiseAI** into an intelligent, production-grade operating system by implementing the server-authoritative **AI Mentor Intelligence Engine**. Because RevenueRiseAI utilizes a Next.js static export architecture (`output: 'export'`), the trusted AI execution boundary is established on **Firebase Cloud Functions v2** (`functions/src/ai/`), strictly isolating API credentials, entitlement decisions, quota accounting, and conversation persistence from the untrusted browser runtime.

---

## 2. 13-Stage Server-Authoritative Execution Pipeline

Every AI operation dispatched by the client undergoes a rigid, sequential 13-stage execution pipeline inside Cloud Functions v2:

```
[ UNTRUSTED BROWSER REQUEST ]
             │
             ▼
1. REQUEST VALIDATION
   ├── Validates JSON structure
   └── Validates query payload
             │
             ▼
2. AUTHENTICATION ENFORCEMENT
   └── Enforces request.auth.uid (ignores spoofed userId)
             │
             ▼
3. ENTITLEMENT RESOLUTION
   └── Reads /entitlements/{uid} in Firestore to verify capability access
             │
             ▼
4. QUOTA ENFORCEMENT
   └── Runs Firestore transaction on /aiUsage/{uid} (Daily / Monthly limits)
             │
             ▼
5. INPUT VALIDATION
   └── Enforces 8,000 character maximum threshold
             │
             ▼
6. INPUT SECURITY FIREWALL
   ├── Detects and flags prompt injection patterns
   ├── Scrubs credentials & secrets (Google, OpenAI, Razorpay, Bearer tokens)
   └── Masks email PII (al***@domain.com)
             │
             ▼
7. CONTEXT ENGINE ASSEMBLY
   ├── Injects pedagogical directives (socratic, direct, code_review, interview_coach)
   └── Truncates workspace context (SQL / Python snippets, error diagnostics)
             │
             ▼
8. MODEL POLICY RESOLUTION
   └── Server determines model, max output tokens, context budget, and temperature
             │
             ▼
9. AI PROVIDER MANAGER
   ├── Wraps execution in timeout protection (10-20s)
   └── Executes automatic circuit-breaker fallback upon 3 consecutive faults
             │
             ▼
10. OUTPUT SECURITY FIREWALL
    └── Scans LLM completion for leaked internal prompts, keys, or env variables
             │
             ▼
11. USAGE ACCOUNTING
    └── Atomically increments /aiUsage/{uid} (Tokens, Requests, Cost USD)
             │
             ▼
12. CONVERSATION PERSISTENCE
    ├── Validates conversation ownership
    └── Atomically commits user query and assistant response to Firestore
             │
             ▼
13. SANITIZED RESPONSE RETURN
    └── Returns structured completion with suggestions and action routes
```

---

## 3. Quota & Plan Capability Matrix

| Plan Tier | Daily Request Limit | Monthly Request Limit | Monthly Token Budget | Allowed Capabilities |
|---|---|---|---|---|
| **Free** | 10 requests | 15 requests | 25,000 tokens | `ai_mentor`, `ai_analytics`, `ai_market_education` |
| **Student Pro** | 50 requests | 150 requests | 250,000 tokens | All capabilities (`+ ai_reasoning, ai_career`) |
| **Pro** | 500 requests | Unlimited (`-1`) | 1,000,000 tokens | All capabilities |
| **Enterprise** | Unlimited (`-1`) | Unlimited (`-1`) | Unlimited (`-1`) | All capabilities |

---

## 4. Multi-Vendor Provider Architecture

The AI subsystem is decoupled from underlying LLM vendors via `IAIProvider`:
- `MockAIProvider`: Active by default for offline local development, deterministic unit testing, and CI/CD pipelines.
- `AIProviderManager`: Implements consecutive failure tracking, circuit breaker state transitions, timeout guarantees, and automated failover across registered providers.
- Real production LLM keys (`GEMINI_API_KEY`, etc.) remain in Google Cloud Secret Manager.

---

## 5. Security & Privacy Guarantees

1. **Zero Client Trust**: All quota deductions, identity checks, and model selections are executed on Cloud Functions.
2. **Credential Redaction**: `AISecurityFirewall` strips private keys, Razorpay secrets, and passwords before prompt assembly.
3. **PII Masking**: Email addresses are sanitized (`us***@domain.com`).
4. **Output Protection**: LLM outputs are inspected to guarantee zero leakage of internal prompts or secrets.
5. **Database Isolation**: Firestore security rules restrict `/aiConversations/{conversationId}` and `/aiConversations/{conversationId}/messages` to the authenticated owner (`request.auth.uid`), while client writes to `/aiUsage` are strictly forbidden (`allow write: if false;`).
