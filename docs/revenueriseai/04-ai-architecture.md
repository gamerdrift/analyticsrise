# RevenueRiseAI — AI Architecture & Provider Subsystem

**Document Version:** 1.0.0
**Author:** Lead AI Systems Architect & Security Engineer
**Status:** Approved Architectural Proposal

---

## 1. Architectural Objectives & Philosophy

The RevenueRiseAI AI Mentor is not a simple wrapper around a chat endpoint. It is a stateful, pedagogical, multimodal reasoning engine designed to:

1. **Teach & Explain**: Break down complex database normalization, statistical formulas, or financial mechanics into digestible steps.
2. **Socratic Questioning**: Guide users toward discovering the solution themselves rather than simply giving away homework/test answers.
3. **Diagnose & Debug**: Parse SQL syntax errors, Python stack traces, and DAX formula errors in the user's active editor context.
4. **Evaluate & Coach**: Provide constructive critique on code readability, algorithmic complexity, resume impact statements, and mock interview answers.
5. **Enforce Absolute Security**: Strictly insulate credentials, private user identity data, and billing records from model prompts.

---

## 2. Multi-Vendor AI Provider Abstraction

RevenueRiseAI enforces strict decoupling from any single LLM vendor. All application subsystems interact exclusively with the polymorphic `AIProvider` interface.

```
                                  +-----------------------+
                                  |    AI MENTOR CLIENT   |
                                  +-----------------------+
                                              |
                                              v
                                  +-----------------------+
                                  |   AI GATEWAY ROUTER   |
                                  |  - Load Balancer      |
                                  |  - Circuit Breaker    |
                                  |  - Rate Limiter       |
                                  +-----------------------+
                                              |
                    +-------------------------+-------------------------+
                    |                         |                         |
                    v                         v                         v
         +--------------------+    +--------------------+    +--------------------+
         |   GEMINI PROVIDER  |    |   CLAUDE PROVIDER  |    |   OPENAI PROVIDER  |
         |  (google-genai)    |    |  (@anthropic-ai)   |    |      (openai)      |
         +--------------------+    +--------------------+    +--------------------+
```

### 2.1 The `AIProvider` Interface Definition

```typescript
export interface AIModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
  stopSequences?: string[];
  responseFormat?: 'text' | 'json_object';
}

export interface TokenUsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AICompletionResult {
  content: string;
  structuredData?: Record<string, any>;
  usage: TokenUsageMetrics;
  model: string;
  provider: string;
  finishReason: string;
}

export interface AIProvider {
  readonly providerId: string;
  readonly defaultModel: string;

  /**
   * Generates a synchronous complete response
   */
  generateResponse(
    messages: AIModelMessage[],
    options?: CompletionOptions
  ): Promise<AICompletionResult>;

  /**
   * Streams token chunks via AsyncIterable
   */
  streamResponse(
    messages: AIModelMessage[],
    options?: CompletionOptions
  ): AsyncIterable<string>;

  /**
   * Generates type-safe JSON schema structured outputs
   */
  generateStructuredOutput<T>(
    messages: AIModelMessage[],
    schema: Record<string, any>,
    options?: CompletionOptions
  ): Promise<{ data: T; usage: TokenUsageMetrics }>;

  /**
   * Pre-calculates token requirements before dispatching to external APIs
   */
  estimateUsage(messages: AIModelMessage[]): number;

  /**
   * Verifies health, latency, and API quota status
   */
  healthCheck(): Promise<{ healthy: boolean; latencyMs: number; error?: string }>;
}
```

---

## 3. Secure AI Context Builder

The **Context Builder** is responsible for assembling the prompt context while enforcing strict privacy and security boundaries:

```
[ User Request + Active Editor Code + Workspace State ]
                         |
                         v
             +-----------------------+
             |    CONTEXT BUILDER    |
             +-----------------------+
                         |
      +------------------+------------------+
      |                                     |
      v                                     v
[ INCLUDED CONTEXT ]              [ REDACTED & BLOCKED ]
- Active Course / Lab Metadata    - Billing Secrets (Razorpay keys, payment IDs)
- User Skill Level & Goal         - User Real Name & Email (Masked to Pseudonym)
- Current Code / Query Snippet    - Service Account Keys / Cloud Config
- Spaced Repetition History       - Auth JWT Tokens & Session Cookies
- Error Message / Stack Trace     - Other Users' Data / Multi-tenant isolation
                         |
                         v
             +-----------------------+
             |   PROMPT SANITIZER    | (Strip prompt-injection attempts)
             +-----------------------+
                         |
                         v
                 [ AI PROVIDER ]
```

### 3.1 Context Builder Assembly Pipeline

1. **Role Definition**: Injects the system instruction according to the requested pedagogical mode (`Socratic`, `Direct Explanation`, `Code Optimization`, or `Mock Interview`).
2. **Knowledge Retrieval**: Fetches relevant documentation snippets or dataset schema definitions.
3. **Workspace Snapshot**: Attaches the user's active code snippet (e.g., active SQL query in the simulator).
4. **Token Truncation**: Enforces a strict context window budget (e.g., maximum 4,000 prompt tokens for real-time chat) using token estimation.

---

## 4. Server-Authoritative Usage Tracking & Cost Control

Because third-party LLM inference carries real infrastructure costs, token usage is strictly gated and deducted on the server.

### 4.1 Usage Flow

```
1. Client calls AI Mentor endpoint with Firebase Auth ID Token.
2. Cloud Function verifies JWT and queries user's active entitlement tier.
3. UsageService checks if user has remaining monthly credits or is on an Unlimited Tier.
   - If credits == 0 and not unlimited -> Return HTTP 402 / HTTP 429 with Upgrade Requirement.
4. If authorized, AI Provider executes inference and returns raw token usage counts.
5. In a Firestore transaction, UsageService increments:
   - /aiUsage/{userId}.monthlyTokens
   - /aiUsage/{userId}.monthlyQueries
   - /aiUsage/{userId}.estimatedCostUsd
6. Streaming chunk or response is forwarded to the client.
```

---

## 5. Resilience, Circuit Breakers & Failovers

If the primary provider (e.g., Gemini 1.5 Pro) experiences latency spikes (> 8,000ms) or returns HTTP 5xx errors:
1. The **AI Router Circuit Breaker** trips after 3 consecutive failures.
2. Requests automatically fail over to secondary providers (e.g., Anthropic Claude 3.5 Sonnet &rarr; OpenAI GPT-4o).
3. Degraded fallback message is injected if all upstream providers are unavailable, providing cached instructional hints.
