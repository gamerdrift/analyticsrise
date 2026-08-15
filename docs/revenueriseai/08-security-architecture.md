# RevenueRiseAI — Security Architecture & Zero-Trust Threat Model

**Document Version:** 1.0.0
**Author:** Lead Security Architect & Cryptographic Systems Engineer
**Status:** Approved Architectural Proposal

---

## 1. Zero-Trust Security Philosophy

RevenueRiseAI operates strictly under a **Zero-Trust Client Model**:

1. **Untrusted Client Environment**: The browser runtime is inherently hostile. No client-side parameter (role, plan tier, remaining credits, assessment score, or simulation equity) is accepted as authoritative.
2. **Mandatory Token Cryptographic Verification**: Every incoming API call and WebSocket frame is validated against Firebase Authentication cryptographic public keys.
3. **Least Privilege Principles**: Microservices, Cloud Functions, and database rules operate under strictly scoped IAM roles with minimal read/write permissions.

---

## 2. Threat Modeling & Defense Matrix

| Threat Category | Potential Attack Vector | RevenueRiseAI Defense Mechanism |
|-----------------|-------------------------|---------------------------------|
| **Client-Side Entitlement Tampering** | Attacker modifies `localStorage` planId to `'enterprise'` or `'pro'` | Server validates plan directly from Firestore `/entitlements/{uid}` during every gated function execution. |
| **Prompt Injection & Jailbreaking** | Attacker injects system override tokens to leak backend prompt secrets or obtain unauthorized test answers | **Context Builder Prompt Sanitizer**: Strips delimiter injections, enforces strict system role boundaries, and utilizes few-shot adversarial guards. |
| **Credential & Secret Exfiltration** | Attacker tricks LLM into outputting API keys, database URLs, or service account files | AI Context Builder completely omits environmental configuration and credentials from the prompt context. Cloud Secret Manager variables are never exposed in runtime memory accessible to AI pipelines. |
| **DDoS & Token Exhaustion Attacks** | Malicious bot spams AI Mentor endpoint to inflate API inference costs | **Firebase App Check** (reCAPTCHA Enterprise / DeviceCheck) + IP Rate Limiting + Server-Side User Quota Gates. |
| **Certificate Tampering & Forgery** | Fraudulent user alters certificate name or score in local PDF/HTML | **Cryptographic SHA-256 HMAC Signatures**: Each certificate contains a hash computed with a Secret Manager key: `HMAC(secret, userId + courseId + issueDate + score)`. Tampered certificates fail public verification instantly. |
| **Multi-Tenant Data Bleed** | Member of Enterprise Org A attempts to read Org B custom datasets or employee skill scores | Firestore Security Rules enforce strict path tenancy: `/organizations/{orgId}/datasets/{datasetId}` requires `request.auth.token.orgId == orgId`. |

---

## 3. Data Segregation & Privacy Firewalls

To guarantee user privacy and compliance with global data protection standards (GDPR, CCPA, SOC-2 Type II), data domains are segregated by strict architectural boundaries:

```
+-----------------------------------------------------------------------------------------------+
|                                      DATA DOMAIN SEGREGATION                                  |
+-------------------------------+-------------------------------+-------------------------------+
|       IDENTITY DOMAIN         |       LEARNING DOMAIN         |        BILLING DOMAIN         |
|  (Firebase Auth + Profile)    |  (Skills, Progress, Labs)     |  (Entitlements, Orders, Invoices)|
|                               |                               |                               |
| - UID, Email, Display Name    | - Course Progress, XP, Badges | - Plan Tier, Status, Dates    |
| - Masked Pseudonyms for AI    | - Code Submissions, Answers   | - Razorpay Order / Payment ID |
| - Timezone & Locale Prefs     | - Simulation Trades & Metrics | - Invoices & Payment Logs     |
+-------------------------------+-------------------------------+-------------------------------+
                                                |
                                                v
                              +-----------------------------------+
                              |     AI CONTEXT BUILDER FILTER     |
                              +-----------------------------------+
                              | Only permits:                     |
                              | - Masked User Pseudonym           |
                              | - Active Lab Code / Query Snippet |
                              | - Active Module Topic             |
                              | - Target Learning Goal            |
                              |                                   |
                              | STRICTLY FORBIDS:                 |
                              | - Payment IDs & Invoice Numbers   |
                              | - Real Email & Contact Info       |
                              | - Internal Secrets & System Keys  |
                              +-----------------------------------+
```

---

## 4. Cryptographic Certificate Verification Specification

Certificates are issued with an authoritative signature payload:

```typescript
export interface CertificateSignaturePayload {
  certificateId: string;
  recipientUid: string;
  recipientName: string;
  courseOrTrackId: string;
  issuedAtTimestamp: number;
  finalScorePercentage: number;
}

export function generateCertificateSignature(
  payload: CertificateSignaturePayload,
  signingSecret: string
): string {
  const serialized = [
    payload.certificateId,
    payload.recipientUid,
    payload.recipientName,
    payload.courseOrTrackId,
    payload.issuedAtTimestamp.toString(),
    payload.finalScorePercentage.toString(),
  ].join('::');

  return crypto.createHmac('sha256', signingSecret).update(serialized).digest('hex');
}
```

When a recruiter or employer visits `https://revenuerise.ai/verify/{certificateId}`, the server recomputes the HMAC hash from the immutable database record and verifies that it matches `signatureHash`.
