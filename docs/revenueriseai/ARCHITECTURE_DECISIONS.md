# RevenueRiseAI — Architecture Decision Records (ADRs)

**Document Version:** 1.0.0
**Author:** Lead Principal Architect & Technical Governance Board
**Status:** Approved Architectural Proposal

---

## Record Index

- [ADR-001: Independent Product Repository & Multi-Site Deployment](#adr-001-independent-product-repository--multi-site-deployment)
- [ADR-002: Multi-Vendor AI Provider Abstraction (`AIProvider`)](#adr-002-multi-vendor-ai-provider-abstraction-aiprovider)
- [ADR-003: Server-Authoritative Usage Metering & Zero-Trust Client Model](#adr-003-server-authoritative-usage-metering--zero-trust-client-model)
- [ADR-004: Educational & Paper Trading Simulation Boundary](#adr-004-educational--paper-trading-simulation-boundary)
- [ADR-005: Federated Identity & Payment Reconciliation with AnalyticsRise Core](#adr-005-federated-identity--payment-reconciliation-with-analyticsrise-core)
- [ADR-006: Graph-Based Skill Representation (DAG)](#adr-006-graph-based-skill-representation-dag)
- [ADR-007: Cryptographic HMAC SHA-256 Verification for Certifications](#adr-007-cryptographic-hmac-sha-256-verification-for-certifications)
- [ADR-008: Polyglot Persistence Strategy](#adr-008-polyglot-persistence-strategy)
- [ADR-009: Privacy-Conscious Telemetry & Context Builder PII Redaction](#adr-009-privacy-conscious-telemetry--context-builder-pii-redaction)
- [ADR-010: Configuration-Driven Dynamic Regional Pricing Matrix](#adr-010-configuration-driven-dynamic-regional-pricing-matrix)

---

### ADR-001: Independent Product Repository & Multi-Site Deployment
- **Status**: Accepted
- **Context**: RevenueRiseAI is the flagship hero product of AnalyticsRise. It requires rapid iteration, independent release cadences, and distinct workspace tools without destabilizing the main platform.
- **Decision**: Architect RevenueRiseAI as an independently deployable application with its own repository and Firebase Multi-Site hosting target (`revenuerise-app`), federating shared services (Auth, Payments, Profile) via cloud contracts.
- **Consequences**: Enables zero-downtime independent releases, prevents mono-repo build bottlenecks, and enforces clean boundary interfaces.

---

### ADR-002: Multi-Vendor AI Provider Abstraction (`AIProvider`)
- **Status**: Accepted
- **Context**: Relying directly on a single LLM vendor (e.g. OpenAI or Gemini) introduces vendor lock-in, price vulnerability, and single-point-of-failure risks.
- **Decision**: Define a strict `AIProvider` interface. All domain code calls the abstract provider. Adapters implement Google Gemini (primary), Anthropic Claude, OpenAI, and local mock/test providers. Automated circuit breakers fail over upon latency or error spikes.
- **Consequences**: Codebase is vendor-agnostic; models can be hot-swapped without refactoring business logic.

---

### ADR-003: Server-Authoritative Usage Metering & Zero-Trust Client Model
- **Status**: Accepted
- **Context**: Client-side storage (e.g., `localStorage`) can be manipulated by users to bypass monthly credit limits or fake premium subscriptions.
- **Decision**: All entitlement validation, credit checks, and usage deductions must occur server-side inside Cloud Functions v2 using atomic Firestore transactions.
- **Consequences**: Guarantees zero revenue leakage and enforces fair-use policies reliably.

---

### ADR-004: Educational & Paper Trading Simulation Boundary
- **Status**: Accepted
- **Context**: Financial regulation strictly governs live brokerage execution and investment advisory services.
- **Decision**: RevenueRiseAI is strictly an educational simulation and decision-intelligence platform. Real-money trading execution is strictly out of scope. Real and simulated money are visually segregated, and all paper trading happens in virtual sandboxes.
- **Consequences**: Avoids regulatory overhead, eliminates user capital risk, and maintains pure educational focus.

---

### ADR-005: Federated Identity & Payment Reconciliation with AnalyticsRise Core
- **Status**: Accepted
- **Context**: AnalyticsRise already possesses a certified, battle-tested Razorpay billing engine, HMAC SHA-256 verification, and webhook idempotency system.
- **Decision**: RevenueRiseAI will NOT implement a secondary payment gateway. It consumes authoritative subscription states from Firestore `/entitlements/{uid}` and delegates payment initiation to the parent billing engine.
- **Consequences**: Maintains "One Source of Truth Per Domain" and avoids duplicate webhook management or audit surface.

---

### ADR-006: Graph-Based Skill Representation (DAG)
- **Status**: Accepted
- **Context**: Flat course video lists fail to adapt to varied learner backgrounds and create high drop-off rates.
- **Decision**: Represent curriculum competencies as a Directed Acyclic Graph (DAG) of prerequisite skill nodes. The engine dynamically calculates optimal learning paths and remediation modules.
- **Consequences**: Enables true personalization, dynamic diagnostic placement, and spaced repetition micro-drills.

---

### ADR-007: Cryptographic HMAC SHA-256 Verification for Certifications
- **Status**: Accepted
- **Context**: Certificate forgery undermines the value of credentials to employers and recruiters.
- **Decision**: Every issued certificate is signed with a server-side HMAC SHA-256 hash using a Secret Manager key: `HMAC(secret, userId + courseId + issueDate + score)`. Public validation endpoints recompute and verify this hash.
- **Consequences**: Certificates are 100% tamper-proof and instantly verifiable by employers.

---

### ADR-008: Polyglot Persistence Strategy
- **Status**: Accepted
- **Context**: Different platform domains have vastly different data access patterns (document CRUD, high-throughput time-series, large binary files).
- **Decision**: Use Cloud Firestore for real-time document state, Cloud Storage for datasets and certificates, Redis for active session/tick caches, and BigQuery/Parquet for historical market archives.
- **Consequences**: Optimizes latency, query efficiency, and storage cost per data type.

---

### ADR-009: Privacy-Conscious Telemetry & Context Builder PII Redaction
- **Status**: Accepted
- **Context**: LLM prompts must comply with GDPR/CCPA and prevent credential leakage.
- **Decision**: The AI Context Builder automatically sanitizes all prompts, redacting real names, emails, billing records, and cloud secrets before passing context to external AI APIs.
- **Consequences**: Protects user confidentiality and eliminates prompt-based exfiltration risks.

---

### ADR-010: Configuration-Driven Dynamic Regional Pricing Matrix
- **Status**: Accepted
- **Context**: Hardcoding plan prices in frontend components breaks internationalization and makes price experiments expensive.
- **Decision**: All subscription pricing, annual discount ratios, and multi-currency formats are defined in centralized, configuration-driven price matrix objects and loaded authoritatively.
- **Consequences**: Enables Purchasing Power Parity (PPP) pricing, currency localization, and frictionless A/B testing.
