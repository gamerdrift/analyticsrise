# RevenueRiseAI — Mission 03 Decision Records & Unresolved Items

**Document Version:** 1.0.0
**Phase:** Mission 03 — AI Mentor Intelligence Engine
**Author:** Principal Software Architect & Technical Governance Board
**Status:** Approved Architectural Record

---

## 1. Architectural Decisions Recorded

### DEC-005: Cloud Functions v2 as Authoritative AI Boundary
- **Decision**: Shift all AI entitlement checks, prompt injection firewall filters, quota transactions, model selection policies, and conversation writes into Firebase Cloud Functions v2 (`functions/src/ai/`).
- **Rationale**: Because the frontend is compiled as a static export (`output: 'export'`), browser-side JavaScript cannot serve as a trusted execution boundary. Enforcing the 13-stage pipeline in Cloud Functions guarantees zero client-side quota manipulation or prompt injection bypass.

### DEC-006: Transactional Quota Accounting on Firestore `/aiUsage/{uid}`
- **Decision**: Execute quota checks and increments inside atomic Firestore transactions.
- **Rationale**: Completely eliminates race conditions caused by rapid double-clicks, concurrent browser tabs, or automated request flooding.

### DEC-007: Dual-Layer Security Firewall (Input & Output)
- **Decision**: Implement both input prompt inspection and output completion inspection in `AISecurityFirewall`.
- **Rationale**: Prevents prompt injection attacks and protects against inadvertent model hallucinations or system prompt leakages in completions.

---

## 2. Deferred & Unresolved Items

| Item | Architectural Status | Planned Phase | Notes |
|---|---|---|---|
| **True HTTPS Streaming Transport (SSE / Chunked)** | `DEFERRED` | Phase 4 (Streaming Infrastructure) | Currently utilizing request/response with client-side typing indicator. A streaming Cloud Function endpoint will be introduced in Phase 4. |
| **Production Vendor API Key Injection** | `DEFERRED` | Phase 8 (Production Deployment Gate) | Production keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`) will be injected from Google Cloud Secret Manager into runtime environment configurations. |
