# RevenueRiseAI — Mission 02 Decision Records & Unresolved Items

**Document Version:** 1.0.0
**Phase:** Mission 02 — Core Product Foundation
**Author:** Lead Principal Architect & Technical Governance Board
**Status:** Approved Architectural Proposal

---

## 1. Implementation Decisions Recorded

### DEC-001: Component Library Co-location
- **Decision**: Create RevenueRiseAI UI primitives under [`app/components/revenuerise/ui/`](file:///c:/Users/hp/Documents/analyticsrise/app/components/revenuerise/ui) rather than overwriting existing legacy components in `app/components/ui/`.
- **Rationale**: Prevents regression in existing AnalyticsRise pages while providing a clean, modern, WCAG-compliant design system tailored to the intelligence OS visual standard.

### DEC-002: Adapter-Based Integration Pattern
- **Decision**: Wrap external services (Auth, Entitlements, Subscriptions, AI Providers) inside interface adapters (`IAuthAdapter`, `IEntitlementAdapter`, `ISubscriptionAdapter`, `IAIProvider`).
- **Rationale**: Decouples the application UI from backend implementation details, enabling 100% deterministic unit testing and frictionless multi-vendor switching.

### DEC-003: Deterministic Mock Provider in Base Registry
- **Decision**: Seed `AIProviderManager` with a `MockAIProvider` by default for offline development and testing.
- **Rationale**: Guarantees zero runtime crashes when third-party API keys are absent and eliminates paid API calls during CI/CD pipelines.

### DEC-004: In-Memory Telemetry Queue with Auto-Flush
- **Decision**: Implement a buffered client-side telemetry queue in [`TelemetryService`](file:///c:/Users/hp/Documents/analyticsrise/lib/observability/telemetry.ts) with automatic batching and privacy masking.
- **Rationale**: Prevents network request flooding on high-frequency UI events while guaranteeing zero transmission of unmasked PII.

---

## 2. Unresolved Architectural Items & Deferred Decisions

| Item | Context | Resolution Plan |
|---|---|---|
| **Firebase Project Topology (Shared vs Federated)** | Whether RevenueRiseAI will share the exact same Firebase Project ID as AnalyticsRise or use cross-project token federation. | **Deferred to Phase 8 / Production Deployment Gate**. The `AnalyticsRiseAuthAdapter` supports both models via ID token validation. |
| **Market Data Tick Vendor Selection** | Choosing between Polygon.io, Alpha Vantage, or historical Parquet archives on Google Cloud Storage for Phase 5 market simulation. | **Deferred to Phase 5 Inception**. Abstracted behind the `MarketDataProvider` interface. |
| **Production LLM Key Provisioning** | Injecting live Google Cloud Secret Manager secrets for Gemini 1.5 Pro and Claude 3.5 Sonnet. | **Deferred to Phase 2 (AI Mentor Gateway Deployment)**. |
