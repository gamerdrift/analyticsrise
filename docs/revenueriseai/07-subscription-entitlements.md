# RevenueRiseAI — Subscription, Entitlement & Usage Architecture

**Document Version:** 1.0.0
**Author:** Principal Billing Architect & Security Systems Engineer
**Status:** Approved Architectural Proposal

---

## 1. Single Source of Truth for Billing & Entitlements

RevenueRiseAI strictly adheres to the core system principle: **One Source of Truth Per Domain**.

- **AnalyticsRise** owns the authoritative payment gateway infrastructure (Firebase Functions v2, Razorpay Orders, HMAC SHA-256 Payment Signature Verification, and Webhook Ingestion Engine).
- **RevenueRiseAI** acts as an authorized client and consumer of authoritative subscription and entitlement state.
- RevenueRiseAI **DOES NOT** create a second payment gateway or duplicate Razorpay webhook listeners.

```
+------------------------------------+          +------------------------------------+
|            ANALYTICSRISE           |          |            REVENUERISEAI           |
|      (Billing & Payment Host)      |          |      (AI Operating System Host)    |
+------------------------------------+          +------------------------------------+
|                                    |          |                                    |
| [ Razorpay Gateway & Webhooks ]    |          | [ Interactive AI Mentor & Labs ]   |
|                 |                  |          |                 |                  |
|                 v                  |          |                 v                  |
| [ Cloud Functions v2 Engine ]      |          | [ Server-Authoritative Gateways ]  |
|                 |                  |          |                 |                  |
|                 v                  |          |                 v                  |
| [ Firestore: /entitlements/{uid} ] |<=========+==== [ Remote EntitlementService ]  |
|                                    |          |                 |                  |
+------------------------------------+          +-----------------+------------------+
                                                                  |
                                                                  v
                                                     [ Quota & Feature Authorization ]
```

---

## 2. Plan Tier Hierarchy & Feature Matrix

RevenueRiseAI extends the ecosystem's plan model with configuration-driven tiers:

| Feature / Resource | Free Learner (`free`) | Professional Pro (`pro`) | Elite Intelligence (`elite`) | Enterprise Workforce (`enterprise`) |
|--------------------|-----------------------|---------------------------|------------------------------|--------------------------------------|
| **AI Mentor Queries** | 15 / month | Unlimited (Fair-Use 1,000/mo) | Unlimited (Priority 3,000/mo) | Custom Team Pool |
| **Analytics Lab Access** | Basic Excel & SQL | Full SQL, Python, BI Studios | Advanced Distributed Compute | Dedicated Team Clusters |
| **Market Lab & Sim** | Introductory Sandbox | Full Paper Trading & Replay | Advanced Strategy Backtesting | Custom Quant Modeling |
| **Career Intelligence** | 1 ATS Scan / mo | Unlimited ATS + 50 AI Mocks | Unlimited + Recruiter Direct | Org Competency Matrix |
| **Verified Certificates**| No (Audit Only) | Yes (Unlimited Included) | Yes (With Honors Badges) | Org Admin Verification |
| **Custom Dataset Storage**| 50 MB | 2,048 MB (2 GB) | 10,240 MB (10 GB) | Dedicated Cloud Buckets |
| **SSO & Admin Controls**| No | No | No | SAML 2.0 / Okta / Azure AD |

---

## 3. Server-Authoritative `EntitlementService` Contract

```typescript
export type RevenueRiseFeatureKey =
  | 'ai_mentor_queries'
  | 'analytics_lab_execution'
  | 'market_paper_trading'
  | 'market_backtesting'
  | 'career_mock_interviews'
  | 'ats_resume_optimizer'
  | 'cryptographic_certificates'
  | 'custom_dataset_storage'
  | 'team_collaboration_workspaces';

export interface AuthoritativeEntitlement {
  userId: string;
  planId: 'free' | 'student_pro' | 'pro' | 'elite' | 'enterprise';
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  billingCycle: 'monthly' | 'annual';
  effectiveFrom: string;
  effectiveUntil: string;
  cancelAtPeriodEnd: boolean;
  featureFlags: Record<RevenueRiseFeatureKey, boolean>;
  monthlyQuotas: Record<string, number>; // -1 indicates unlimited
}

export interface EntitlementService {
  /**
   * Evaluates if a user has permission to invoke a specific feature
   */
  hasFeatureAccess(userId: string, featureKey: RevenueRiseFeatureKey): Promise<boolean>;

  /**
   * Fetches full authoritative entitlement snapshot directly from Firestore
   */
  getAuthoritativeEntitlement(userId: string): Promise<AuthoritativeEntitlement>;

  /**
   * Evaluates remaining numerical quota for a metered resource
   */
  getRemainingQuota(userId: string, quotaKey: string): Promise<number>;

  /**
   * Atomically checks quota and consumes units in a single server transaction
   */
  consumeQuota(
    userId: string,
    quotaKey: string,
    unitsToConsume: number
  ): Promise<{ allowed: boolean; remaining: number }>;
}
```

---

## 4. Usage Quota State Machine & Server Guard

```
User Action (e.g. AI Prompt / Python Sandbox Run / Backtest)
                           |
                           v
              +--------------------------+
              |    CLOUD FUNCTION GUARD  |
              +--------------------------+
                           |
                           v
        Fetch /entitlements/{uid} & /aiUsage/{uid}
                           |
            +--------------+--------------+
            |                             |
     [ Unlimited Plan ]          [ Metered Plan ]
            |                             |
            |              Check: used + cost <= quota?
            |                    /            \
            |               [ YES ]          [ NO ]
            |                  |                |
            |          Atomically Increment     +--> Reject: HTTP 402 / 429
            |            /aiUsage/{uid}              Return Upgrade Modal Trigger
            |                  |
            +------------------+
                     |
                     v
         [ EXECUTE WORKSPACE TASK ]
```
