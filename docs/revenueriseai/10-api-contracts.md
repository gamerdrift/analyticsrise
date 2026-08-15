# RevenueRiseAI — API Contracts & Interface Specifications

**Document Version:** 1.0.0
**Author:** Lead API Architect & Backend Systems Engineer
**Status:** Approved Architectural Proposal

---

## 1. Global API Standards & Conventions

1. **Transport**: HTTPS (TLS 1.3), JSON payloads, Server-Sent Events (SSE) for streaming.
2. **Authentication**: Bearer Authorization Token (`Authorization: Bearer <firebase_id_token>`).
3. **Error Payload Convention**:
   ```json
   {
     "success": false,
     "error": {
       "code": "QUOTA_EXCEEDED",
       "message": "Monthly AI Mentor query limit reached for your plan.",
       "details": {
         "requiredPlan": "pro",
         "currentUsage": 15,
         "quotaLimit": 15
       }
     }
   }
   ```

---

## 2. Core Endpoint Specifications

### 2.1 AI Mentor Service

#### `POST /api/v1/ai/chat` (or `httpsCallable('sendAIMentorMessage')`)
- **Description**: Dispatches a user query to the AI Mentor with isolated context.
- **Request Body**:
  ```typescript
  interface SendAIMentorMessageRequest {
    sessionId?: string;
    message: string;
    pedagogicalMode?: 'socratic' | 'direct' | 'code_review' | 'interview_coach';
    context: {
      courseId?: string;
      lessonId?: string;
      simulatorType?: 'sql' | 'excel' | 'python' | 'market_sim';
      activeCodeSnippet?: string;
      activeErrorMessage?: string;
    };
  }
  ```
- **Response Body**:
  ```typescript
  interface SendAIMentorMessageResponse {
    success: boolean;
    sessionId: string;
    messageId: string;
    response: {
      text: string;
      codeSnippet?: string;
      suggestedFollowUps: string[];
      suggestedActionRoutes?: string[];
    };
    usage: {
      queriesRemaining: number; // -1 for unlimited
      isNearLimit: boolean;
    };
  }
  ```

---

### 2.2 Assessment & Code Evaluation Engine

#### `POST /api/v1/assessments/evaluate-code` (or `httpsCallable('evaluateCodeSubmission')`)
- **Description**: Evaluates a user's SQL or Python code solution in a secure sandbox.
- **Request Body**:
  ```typescript
  interface EvaluateCodeRequest {
    assessmentId: string;
    questionId: string;
    language: 'sql' | 'python' | 'r';
    codeSubmission: string;
  }
  ```
- **Response Body**:
  ```typescript
  interface EvaluateCodeResponse {
    success: boolean;
    passed: boolean;
    scoreAchieved: number;
    maxScore: number;
    testCaseResults: Array<{
      testId: string;
      status: 'passed' | 'failed' | 'error';
      expectedOutputPreview?: string;
      actualOutputPreview?: string;
      executionTimeMs: number;
    }>;
    mentorFeedback?: string;
  }
  ```

---

### 2.3 Market Simulation & Paper Trading Engine

#### `POST /api/v1/simulation/orders/place` (or `httpsCallable('placeSimulatedOrder')`)
- **Description**: Submits a simulated paper trading order.
- **Request Body**:
  ```typescript
  interface PlaceSimulatedOrderRequest {
    portfolioId: string;
    symbol: string;
    side: 'buy' | 'sell';
    orderType: 'market' | 'limit' | 'stop_loss';
    quantity: number;
    limitPrice?: number;
    stopPrice?: number;
  }
  ```
- **Response Body**:
  ```typescript
  interface PlaceSimulatedOrderResponse {
    success: boolean;
    orderId: string;
    status: 'filled' | 'pending' | 'rejected';
    symbol: string;
    executedPrice?: number;
    executedQuantity?: number;
    slippageIncurred?: number;
    virtualFee?: number;
    portfolioSummary: {
      cashBalance: number;
      totalEquity: number;
      unrealizedPnl: number;
    };
  }
  ```

---

### 2.4 Certificate Verification Endpoint

#### `GET /api/v1/certificates/verify/{certificateId}` (Public / Unauthenticated)
- **Description**: Publicly validates the authenticity and cryptographic signature of a certificate.
- **Response Body**:
  ```typescript
  interface CertificateVerificationResponse {
    valid: boolean;
    certificateId: string;
    recipientName: string;
    credentialTitle: string;
    issuedAtIso: string;
    verificationHash: string;
    skillsVerified: string[];
    issuer: 'AnalyticsRise / RevenueRiseAI';
  }
  ```
