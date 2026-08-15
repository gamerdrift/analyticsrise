# RevenueRiseAI — Data Architecture & Schema Specification

**Document Version:** 1.0.0
**Author:** Lead Data Architect & Database Systems Engineer
**Status:** Approved Architectural Proposal

---

## 1. Storage Tiers & Engine Selection

RevenueRiseAI employs a polyglot persistence strategy tailored to access patterns and performance requirements:

| Persistence Layer | Technology | Primary Use Case | Retention / Scalability |
|-------------------|------------|------------------|-------------------------|
| **Document Store** | Cloud Firestore | User Profiles, Skill Graphs, Progress, AI Sessions, Entitlements | Real-time listeners, multi-region replication, sub-30ms latency |
| **Object Store** | Google Cloud Storage | User Project Datasets, Exported Reports (PDF/CSV), Cert Artifacts | Lifecycle rules, geo-redundant, signed download URLs |
| **Cache & Ephemeral Session** | Redis / Cloud Memorystore | Active Market Ticks, Temporary WebAssembly Workspace Cache | In-memory, TTL eviction (1 hour – 24 hours) |
| **Time-Series Analytical Store** | BigQuery / Parquet on GCS | Historical Market Candle Archives, Aggregated Telemetry Logs | Columnar compression, partition-optimized for backtesting |

---

## 2. Firestore Collection Hierarchy & Schemas

### 2.1 Core Collections

```
/users/{userId}
  -> profile: { displayName, email, role, avatarUrl, locale, createdAt }
  -> telemetry: { xp, level, currentStreak, practiceMinutesTotal }
  /skills/{skillId}
    -> { rating: 0-100, confidence: 0.0-1.0, lastAssessedAt }
  /progress/{courseId}
    -> { completedModules: string[], activeLessonId, lastAccessedAt }
  /achievements/{achievementId}
    -> { earnedAt, badgeUrl, metadata }

/skills/{skillId}
  -> { category, title, description, prerequisites: string[], xpValue }

/learningPaths/{pathId}
  -> { title, targetRole, skillNodes: string[], tierRequired }

/courses/{courseId}
  -> { title, slug, tierRequired, estimatedHours, modules: Module[] }

/assessments/{assessmentId}
  -> { courseId, passingScore, timeLimitMinutes, questions: Question[] }

/certificates/{certificateId}
  -> { userId, recipientName, courseId, issuedAt, signatureHash, verified }

/simulations/{portfolioId}
  -> { userId, name, currency, cashBalance, totalEquity, createdAt }
  /positions/{symbol}
    -> { side, quantity, averageEntryPrice, currentPrice, unrealizedPnl }
  /orders/{orderId}
    -> { symbol, side, type, status, quantity, requestedPrice, executedPrice, executedAt }

/backtests/{backtestId}
  -> { userId, strategyId, symbol, timeframe, dateRange, performanceMetrics }

/aiSessions/{sessionId}
  -> { userId, contextType, status, createdAt, updatedAt }
  /messages/{messageId}
    -> { sender, content, timestamp, tokenUsage, modelUsed }

/aiUsage/{userId}
  -> { monthlyTokens: number, monthlyQueries: number, estimatedCostUsd: number, cycleResetDate: string }

/organizations/{orgId}
  -> { name, tier: 'enterprise', seatLimit: number, adminUids: string[], ssoConfig }
  /members/{userId}
    -> { role: 'admin' | 'member', joinedAt, department }
```

---

## 3. Composite Indexes & Query Optimization

To maintain sub-50ms query response times under scale, the following composite indexes are configured:

1. **User Simulation Orders**:
   - Collection: `orders` (Collection Group)
   - Fields: `userId` (ASC), `status` (ASC), `executedAt` (DESC)
2. **Leaderboard XP Rankings**:
   - Collection: `users`
   - Fields: `telemetry.level` (DESC), `telemetry.xp` (DESC)
3. **Assessment Submissions**:
   - Collection: `assessmentResults`
   - Fields: `userId` (ASC), `assessmentId` (ASC), `submittedAt` (DESC)
4. **Active AI Sessions**:
   - Collection: `aiSessions`
   - Fields: `userId` (ASC), `status` (ASC), `updatedAt` (DESC)

---

## 4. Data Lifecycle, Retention & TTL Policies

- **Ephemeral AI Sessions**: Sessions with `status == 'archived'` older than 90 days are automatically pruned or compressed into cold GCS archives to minimize Firestore document footprint.
- **Temporary Uploaded Datasets (Free Tier)**: Uploaded CSV/Excel files for free users expire after 48 hours unless saved as an active project. Pro/Elite users retain persistent dataset storage up to their plan limit.
- **Simulation History**: Filled orders and backtest logs are retained indefinitely for user portfolio analytics, while pending/canceled orders are archived after 30 days.
