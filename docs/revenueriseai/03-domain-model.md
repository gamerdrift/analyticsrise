# RevenueRiseAI — Domain Model & Entity Architecture

**Document Version:** 1.0.0
**Author:** Lead Principal Architect & Data Modeler
**Status:** Approved Architectural Proposal

---

## 1. Domain Aggregate Overview

RevenueRiseAI's business logic is modeled using Domain-Driven Design (DDD) principles. Aggregates enforce business invariants and maintain state consistency across transactional boundaries.

```
                           +------------------------+
                           |     USER AGGREGATE     |
                           | UserProfile, Auth, XP  |
                           +------------------------+
                                       |
        +------------------------------+------------------------------+
        |                              |                              |
        v                              v                              v
+----------------+             +----------------+             +----------------+
| LEARNING PATH  |             | SIMULATION LAB |             | CAREER PROFILE |
| AGGREGATE      |             | AGGREGATE      |             | AGGREGATE      |
| SkillGraph     |             | Portfolio      |             | RoleTarget     |
| Course/Module  |             | Position/Trade |             | SkillGaps      |
| Assessment     |             | Strategy/Test  |             | ResumeArtifact |
+----------------+             +----------------+             +----------------+
        |                              |                              |
        +------------------------------+------------------------------+
                                       |
                                       v
                        +------------------------------+
                        |      ENTITLEMENT & USAGE     |
                        |      AGGREGATE               |
                        | PlanTier, Quota, Meter       |
                        +------------------------------+
```

---

## 2. Core Entities & Value Objects

### 2.1 User & Intelligence Entities

#### `UserProfile` (Entity)
- `id`: `string` (UUID / Firebase Auth UID)
- `email`: `string`
- `displayName`: `string`
- `avatarUrl`: `string`
- `role`: `UserRole` (`'student' | 'analyst' | 'trader' | 'instructor' | 'admin' | 'enterprise_member'`)
- `preferredLanguage`: `string` (e.g., `'en'`, `'es'`, `'de'`, `'hi'`, `'ar'`)
- `timezone`: `string`
- `learningStyle`: `LearningStyle` (`'visual' | 'hands_on' | 'theoretical' | 'socratic'`)
- `createdAt`: `Timestamp`
- `updatedAt`: `Timestamp`

#### `SkillNode` & `SkillGraph` (Aggregate Root)
- `id`: `string` (e.g., `'sql.window_functions'`, `'stats.hypothesis_testing'`, `'market.order_book'`)
- `category`: `SkillCategory` (`'database' | 'programming' | 'bi' | 'statistics' | 'market_microstructure' | 'risk_management'`)
- `title`: `string`
- `description`: `string`
- `prerequisiteSkillIds`: `string[]` (DAG edges)
- `masteryThresholdScore`: `number` (0–100)
- `xpValue`: `number`

#### `UserSkillProgress` (Entity)
- `userId`: `string`
- `skillId`: `string`
- `currentRating`: `number` (0–100 mastery score)
- `confidenceLevel`: `number` (0.0–1.0)
- `lastAssessedAt`: `Timestamp`
- `assessmentHistory`: `SkillAssessmentRecord[]`

---

### 2.2 Learning & Assessment Entities

#### `Course` (Aggregate Root)
- `id`: `string`
- `slug`: `string`
- `title`: `string`
- `description`: `string`
- `tierRequirement`: `PlanTier` (`'free' | 'pro' | 'elite' | 'enterprise'`)
- `modules`: `Module[]`
- `targetSkillIds`: `string[]`
- `estimatedDurationMinutes`: `number`
- `published`: `boolean`

#### `Assessment` (Aggregate Root)
- `id`: `string`
- `courseId`: `string | null`
- `skillIds`: `string[]`
- `title`: `string`
- `passingScorePercentage`: `number` (e.g., 80)
- `timeLimitSeconds`: `number`
- `questions`: `Question[]`
  - `id`: `string`
  - `type`: `'multiple_choice' | 'code_execution' | 'scenario_analysis' | 'formula_calculation'`
  - `prompt`: `string`
  - `options` (optional): `QuestionOption[]`
  - `testCases` (for code questions): `CodeTestCase[]`
  - `rubricCriteria`: `RubricItem[]`

#### `Certificate` (Entity)
- `id`: `string`
- `userId`: `string`
- `recipientName`: `string`
- `credentialTitle`: `string`
- `issuedAt`: `Timestamp`
- `expiresAt`: `Timestamp | null`
- `signatureHash`: `string` (Cryptographic HMAC SHA-256)
- `verificationUrl`: `string`
- `skillsCertified`: `string[]`

---

### 2.3 Market & Trading Simulation Entities

#### `Instrument` (Value Object)
- `symbol`: `string` (e.g., `'AAPL'`, `'EURUSD'`, `'SPY'`, `'BTC-USD'`)
- `name`: `string`
- `assetClass`: `'equity' | 'fx' | 'commodity' | 'crypto' | 'index'`
- `currency`: `string` (e.g., `'USD'`)
- `tickSize`: `number`
- `lotSize`: `number`

#### `Candle` & `PriceSeries` (Value Objects)
- `symbol`: `string`
- `timeframe`: `'1m' | '5m' | '15m' | '1h' | '1d'`
- `timestamp`: `number` (Epoch ms)
- `open`: `number`
- `high`: `number`
- `low`: `number`
- `close`: `number`
- `volume`: `number`

#### `SimulatedPortfolio` (Aggregate Root)
- `id`: `string`
- `userId`: `string`
- `name`: `string`
- `currency`: `string` (e.g., `'USD'`)
- `initialVirtualBalance`: `number` (e.g., 100,000.00)
- `cashBalance`: `number`
- `positions`: `Map<string, Position>`
- `realizedPnl`: `number`
- `unrealizedPnl`: `number`
- `totalEquity`: `number`
- `createdAt`: `Timestamp`
- `updatedAt`: `Timestamp`

#### `Position` (Value Object)
- `symbol`: `string`
- `side`: `'long' | 'short'`
- `quantity`: `number`
- `averageEntryPrice`: `number`
- `currentPrice`: `number`
- `unrealizedPnl`: `number`
- `realizedPnl`: `number`

#### `OrderSimulation` (Entity)
- `id`: `string`
- `portfolioId`: `string`
- `userId`: `string`
- `symbol`: `string`
- `side`: `'buy' | 'sell'`
- `type`: `'market' | 'limit' | 'stop_loss' | 'take_profit'`
- `status`: `'pending' | 'filled' | 'canceled' | 'rejected'`
- `quantity`: `number`
- `requestedPrice`: `number | null`
- `executedPrice`: `number | null`
- `executedAt`: `Timestamp | null`
- `slippageIncurred`: `number`
- `virtualFee`: `number`

#### `Backtest` (Aggregate Root)
- `id`: `string`
- `userId`: `string`
- `strategyId`: `string`
- `symbol`: `string`
- `timeframe`: `string`
- `startDate`: `string`
- `endDate`: `string`
- `initialCapital`: `number`
- `performanceMetrics`: `PerformanceMetrics`
  - `totalTrades`: `number`
  - `winRatePercentage`: `number`
  - `profitFactor`: `number`
  - `sharpeRatio`: `number`
  - `sortinoRatio`: `number`
  - `maxDrawdownPercentage`: `number`
  - `netReturnPercentage`: `number`

---

### 2.4 AI Mentor & Intelligence Entities

#### `AISession` (Aggregate Root)
- `id`: `string`
- `userId`: `string`
- `contextType`: `'learning' | 'sql_lab' | 'python_lab' | 'market_sim' | 'career_interview'`
- `targetEntityId`: `string | null` (e.g., `courseId`, `labId`, `portfolioId`)
- `status`: `'active' | 'archived'`
- `messages`: `AIMessage[]`
- `tokenUsage`: `TokenUsageSummary`
- `createdAt`: `Timestamp`
- `updatedAt`: `Timestamp`

#### `AIMessage` (Value Object)
- `id`: `string`
- `sender`: `'user' | 'assistant' | 'system'`
- `content`: `string`
- `timestamp`: `Timestamp`
- `codeArtifacts`: `CodeArtifact[]`
- `suggestedActions`: `string[]`
- `modelUsed`: `string`

---

## 3. Entity State Transitions & Lifecycles

### 3.1 Simulated Order State Machine
```
[ PENDING ] ---> (Market Price Matches / Immediate) ---> [ FILLED ]
    |
    +---------> (User / Strategy Cancels) -------------> [ CANCELED ]
    |
    +---------> (Insufficient Virtual Margin) ---------> [ REJECTED ]
```

### 3.2 Certificate Issuance State Machine
```
[ INELIGIBLE ] ---> (Pass All Capstone Tests >= 80%) ---> [ ELIGIBLE ]
                                                               |
                                                               v
                                                    [ GENERATED & SIGNED ]
                                                               |
                                                               v
                                                      [ VERIFIED ACTIVE ]
```
