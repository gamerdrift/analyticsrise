# RevenueRiseAI — Integration Architecture with AnalyticsRise

**Document Version:** 1.0.0
**Author:** Lead Principal Architect & Systems Integration Engineer
**Status:** Approved Architectural Proposal

---

## 1. Ecosystem Relationship & Boundary Charter

RevenueRiseAI is designed as an **independently deployable heroic extension** of AnalyticsRise. It possesses its own dedicated product surface, navigation model, and deep workspace capabilities while sharing foundational platform services.

```
+----------------------------------------------------------------------------------------------------+
|                                      ANALYTICSRISE ECOSYSTEM                                       |
+----------------------------------------------------------------------------------------------------+
                                                  |
                  +-------------------------------+-------------------------------+
                  |                                                               |
                  v                                                               v
+-----------------------------------+                           +-----------------------------------+
|       ANALYTICSRISE PARENT        |                           |           REVENUERISEAI           |
|      (Main Marketing & Labs)      |                           |   (AI Learning & Decision OS)     |
+-----------------------------------+                           +-----------------------------------+
| - Main Portal & Landing Pages     |                           | - AI Mentor & Socratic Engine     |
| - Foundational Simulators         |                           | - Market & Trading Education Lab  |
| - Razorpay Payment Processing     |                           | - Strategy Backtesting Sandbox    |
| - Subscription Management Portal  |                           | - Quantitative Analytics Studio   |
| - Public Community & Jobs Board   |                           | - Adaptive Graph Learning Path    |
+-----------------------------------+                           +-----------------------------------+
                  |                                                               |
                  +-------------------------------+-------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                    SHARED ENTERPRISE SERVICES                                      |
|                                                                                                    |
|  [ Firebase Auth ]            [ Entitlements Core ]       [ Unified Profile ]  [ Telemetry Sync ]  |
|  Shared JWT Token Authority   /entitlements/{uid}         /users/{uid}         Shared XP & Streaks |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Shared vs. Dedicated Domain Ownership Matrix

| Domain / Service | Owning Subsystem | Integration Pattern | Rationale |
|------------------|------------------|---------------------|-----------|
| **User Identity & Auth** | AnalyticsRise Shared | Single Firebase Project Auth (Shared JWT) | Seamless SSO; user logs in once across all properties |
| **Payments & Invoicing** | AnalyticsRise Core | Authoritative Razorpay Webhooks | Single PCI/Payment regulatory footprint; no duplicate gateways |
| **Subscription Entitlements** | AnalyticsRise Core | Read-Only Firestore `/entitlements/{uid}` | Real-time synchronization; zero billing discrepancies |
| **AI Mentor Gateway** | RevenueRiseAI | Cloud Functions v2 / Dedicated Gateway | Highly customized LLM routing, token metering, and caching |
| **Market Simulation Engine** | RevenueRiseAI | Dedicated Engine & Memory State | Independent scaling of quantitative backtests and price feeds |
| **Certifications** | Shared / Federated | Firestore `/certificates/{certId}` | Universal credential verification on both domains |
| **Global Gamification (XP/Streak)** | Shared | Firestore `/users/{uid}/telemetry` | Cohesive user progress regardless of which app they practice on |

---

## 3. Cross-Platform Navigation & User Flow

1. **Seamless Deep Linking**:
   - AnalyticsRise navbar features direct launch triggers: `[ Launch RevenueRiseAI -> ]`.
   - RevenueRiseAI provides one-click navigation back to main settings, billing, or job boards.
2. **Unified Session Handling**:
   - Firebase Auth state is persisted in standard secure cookies / indexedDB, allowing automatic session hydration across subdomains (`app.revenuerise.ai` and `analyticsrise.com`).
3. **Graceful Entitlement Upgrades**:
   - If a free user in RevenueRiseAI attempts to access an Elite backtest feature, the application opens the standard `UpgradeModal` which communicates with the authoritative billing engine to initiate the Razorpay checkout.
