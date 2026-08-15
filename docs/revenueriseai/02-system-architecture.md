# RevenueRiseAI — System Architecture & Topology

**Document Version:** 1.0.0
**Author:** Lead Principal Architect & Security Systems Engineer
**Status:** Approved Architectural Proposal

---

## 1. High-Level Architecture Topology

RevenueRiseAI employs a decoupled, cloud-native, modular service architecture. The frontend application is deployed independently as an edge-rendered / static-optimized web application, interfacing with server-authoritative backend microservices, Cloud Functions v2, and secure external AI and Market Data providers.

```
+----------------------------------------------------------------------------------------------------+
|                                      CLIENT PRESENTATION LAYER                                     |
|  Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Zustand (Local State)       |
|                                                                                                    |
|  [ AI Mentor UI ]   [ Learning Studio ]   [ Market Lab ]   [ Analytics Lab ]   [ Career Hub ]     |
+----------------------------------------------------------------------------------------------------+
                                                  |
                                                  | HTTPS / WSS / gRPC-Web
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                    SECURITY & API GATEWAY LAYER                                    |
|  - Firebase App Check / Cloud Armor / Rate Limiter / JWT Authenticator (Firebase Auth)             |
|  - Request Context Builder & PII Redaction Filter                                                  |
+----------------------------------------------------------------------------------------------------+
         |                                |                                   |
         v                                v                                   v
+-----------------------+     +-----------------------+           +-----------------------+
|   AI SERVICES LAYER   |     |   DOMAIN SERVICES     |           |   DATA ENGINE LAYER   |
|                       |     |                       |           |                       |
| - AI Gateway / Router |     | - Learning Engine     |           | - Market Simulation   |
| - Context Builder     |     | - Assessment Engine   |           |   Execution Engine    |
| - Prompt Sanitizer    |     | - Career Intelligence |           | - Paper Trading Order |
| - Token & Cost Meter  |     | - Portfolio Service   |           |   Matching Engine     |
| - Fallback Orchestr.  |     | - Certificate Signer  |           | - Backtest Processor  |
+-----------------------+     +-----------------------+           +-----------------------+
         |                                |                                   |
         |                                v                                   |
         |                    +-----------------------+                       |
         |                    | ENTITLEMENT / BILLING |                       |
         |                    | (Federated to parent) |                       |
         |                    | - EntitlementService  |                       |
         |                    | - Usage Quota Enforcer|                       |
         |                    +-----------------------+                       |
         |                                |                                   |
         +--------------------------------+-----------------------------------+
                                          |
                                          v
+----------------------------------------------------------------------------------------------------+
|                                    PERSISTENCE & INTEGRATION LAYER                                 |
|                                                                                                    |
|  [ Cloud Firestore ]           [ Cloud Storage ]         [ Secret Manager ]     [ External APIs ]  |
|  - /users                      - Datasets / Artifacts    - LLM Provider Keys    - Gemini / Claude  |
|  - /skills & /learningPaths    - Certificates (PDF/SVG)  - Market API Keys      - OpenAI           |
|  - /simulations & /orders      - Portfolio Snapshots     - Webhook Secrets      - Market Feeds     |
|  - /aiUsage & /telemetry       - Video / Media Assets    - Razorpay Key Secret                     |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Layer Definitions & Responsibilities

### 2.1 Presentation Layer (Frontend)
- **Framework**: Next.js 14 App Router, React 18, TypeScript 5+.
- **Role**: Pure presentation, optimistic local state transitions, client-side WebAssembly computation (for sandbox data filtering and charting), and real-time streaming consumption (Server-Sent Events / WebSockets).
- **Security Constraint**: ZERO business-authoritative trust. Client state never dictates plan entitlements, assessment passing status, or credit balance.

### 2.2 Security & API Gateway Layer
- **Components**: Firebase App Check (reCAPTCHA Enterprise / DeviceCheck), Firebase Auth ID Token verification, Cloud Armor DDoS mitigation.
- **Responsibilities**:
  - Validates cryptographically signed Firebase ID tokens on every request.
  - Injects verified `userId`, `roles`, and `entitlementTier` into request execution context.
  - Rejects rate-limit abusers prior to downstream AI execution.

### 2.3 AI Services Subsystem
- **AI Gateway**: Directs incoming completion, streaming, and structured-output requests to the active underlying provider (`GeminiProvider`, `ClaudeProvider`, `OpenAIProvider`, `SelfHostedProvider`).
- **Context Builder**: Isolates sensitive billing data, sanitizes prompt injections, formats relevant learning state, and binds system instructions.
- **Usage & Cost Meter**: Calculates input/output token metrics, enforces daily/monthly tier quotas, and records transaction logs.

### 2.4 Domain Services Subsystem
- **Learning Engine**: Maintains DAG-based skill graphs, generates modular learning sequences, and schedules spaced repetition quizzes.
- **Assessment Engine**: Executes server-side answer verification, anti-plagiarism checks, code execution testing in isolated sandboxes, and score calculation.
- **Career Intelligence Engine**: Calculates multidimensional career readiness scores, analyzes skill gaps across 10 industry roles, and generates personalized roadmap milestones.
- **Certification Engine**: Issues immutable certificates backed by SHA-256 HMAC cryptographic signatures and public verification endpoints.

### 2.5 Market Simulation Subsystem
- **Paper Trading Engine**: Maintains simulated user portfolios, virtual cash balances, and positions. Executes market, limit, and stop-loss orders against historical or delayed market feeds.
- **Backtesting & Replay Engine**: Executes deterministic strategy simulations across tick/candle price series, calculating Sharpe ratio, Sortino ratio, max drawdown, and profit factor.

---

## 3. Communication Protocols & Contracts

| Interaction | Protocol | Payload Format | Latency Target | Reliability |
|-------------|----------|----------------|----------------|-------------|
| Client &rarr; API Gateway | HTTPS / REST / Callable | JSON (Strict TypeScript Interfaces) | < 150ms | At-least-once |
| Client &larr;&rarr; AI Stream | SSE (Server-Sent Events) | `text/event-stream` / Chunked UTF-8 | < 300ms TTFB | Resumable |
| Market Lab &larr;&rarr; Price Ticks | WebSockets (WSS) | Binary Protobuf / JSON | < 50ms | Real-time |
| Functions &larr;&rarr; External LLM | HTTPS (mTLS) | REST / gRPC | Variable (Provider) | Exponential Backoff |
| Functions &larr;&rarr; Firestore | gRPC (Cloud SDK) | Native Documents | < 25ms | Strongly Consistent |

---

## 4. Architectural Boundaries & Cross-Cutting Concerns

1. **Failure Domain Isolation**: A failure in the Market Simulation provider or External AI Provider must NEVER degrade the core Learning Engine or authentication pipelines. Circuit breakers and fallback adapters isolate third-party failures.
2. **Stateless Service Nodes**: All Cloud Functions and API handlers remain strictly stateless. Session and conversational memory are persisted in Cloud Firestore or Redis cache tiers.
3. **Observability By Design**: Every boundary traversal emits structured telemetry with OpenTelemetry-compatible trace IDs, request latencies, and sanitized metadata.
