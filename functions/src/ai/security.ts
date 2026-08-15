/**
 * RevenueRiseAI — Server-Side AI Security Firewall
 * Authoritative input and output security inspection executed inside Cloud Functions.
 */

const CREDENTIAL_SCRUB_PATTERNS = [
  /AIza[0-9A-Za-z-_]{30,45}/gi,                    // Google API Keys
  /sk-[a-zA-Z0-9_-]{20,}/gi,                        // OpenAI / Anthropic Keys
  /rzp_(test|live)_[a-zA-Z0-9]{10,}/gi,             // Razorpay Secrets
  /Bearer\s+[a-zA-Z0-9\-_.]+/gi,                    // JWTs
  /(service[-_]?account|private[-_]?key)/gi,        // Cloud IAM references
  /password\s*[:=]\s*["'][^"']+["']/gi,             // Passwords
];

const PROMPT_INJECTION_INDICATORS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+override/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions)/i,
  /disregard\s+(all\s+)?safety\s+(rules|guidelines)/i,
  /bypass\s+(entitlements|filters|firewall)/i,
];

const OUTPUT_LEAK_INDICATORS = [
  /AIza[0-9A-Za-z-_]{30,45}/gi,
  /sk-[a-zA-Z0-9_-]{20,}/gi,
  /rzp_(test|live)_[a-zA-Z0-9]{10,}/gi,
  /FIREBASE_CONFIG/i,
  /process\.env\.[A-Z0-9_]+/gi,
];

export interface InputSanitizationResult {
  sanitizedContent: string;
  piiRedactedCount: number;
  credentialsScrubbedCount: number;
  injectionDetected: boolean;
}

export interface OutputSanitizationResult {
  sanitizedContent: string;
  leaksDetected: boolean;
  leaksCount: number;
}

export class AISecurityFirewall {
  /**
   * Sanitizes input user prompt text before LLM dispatch
   */
  public static sanitizeInput(text: string): InputSanitizationResult {
    let sanitized = text;
    let credentialsScrubbedCount = 0;
    let piiRedactedCount = 0;
    let injectionDetected = false;

    // 1. Detect prompt injection attempts
    for (const pattern of PROMPT_INJECTION_INDICATORS) {
      if (pattern.test(sanitized)) {
        injectionDetected = true;
        sanitized = sanitized.replace(pattern, '[SECURITY_OVERRIDE_FLAGGED]');
      }
    }

    // 2. Scrub credentials & API secrets
    for (const pattern of CREDENTIAL_SCRUB_PATTERNS) {
      const matches = sanitized.match(pattern);
      if (matches) {
        credentialsScrubbedCount += matches.length;
        sanitized = sanitized.replace(pattern, '[SCRUBBED_CREDENTIAL]');
      }
    }

    // 3. Mask email PII
    const emailRegex = /([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g;
    const emailMatches = sanitized.match(emailRegex);
    if (emailMatches) {
      piiRedactedCount += emailMatches.length;
      sanitized = sanitized.replace(emailRegex, (_match, user, domain) => {
        const maskedUser = user.length > 2 ? `${user.slice(0, 2)}***` : '***';
        return `${maskedUser}@${domain}`;
      });
    }

    return {
      sanitizedContent: sanitized,
      piiRedactedCount,
      credentialsScrubbedCount,
      injectionDetected,
    };
  }

  /**
   * Sanitizes raw completion output from LLM before returning to client
   */
  public static sanitizeOutput(content: string): OutputSanitizationResult {
    let sanitized = content;
    let leaksCount = 0;
    let leaksDetected = false;

    for (const pattern of OUTPUT_LEAK_INDICATORS) {
      const matches = sanitized.match(pattern);
      if (matches) {
        leaksDetected = true;
        leaksCount += matches.length;
        sanitized = sanitized.replace(pattern, '[REDACTED_SECURITY_POLICY]');
      }
    }

    return {
      sanitizedContent: sanitized,
      leaksDetected,
      leaksCount,
    };
  }

  /**
   * Enforces character budget truncation on context snippets
   */
  public static truncateContext(content: string, maxChars = 8000): string {
    if (!content || content.length <= maxChars) return content || '';
    return content.slice(0, maxChars) + '\n...[Context truncated by AI Security Firewall]';
  }
}
