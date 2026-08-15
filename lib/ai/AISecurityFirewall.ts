/**
 * RevenueRiseAI — AI Security Firewall & Sanitizer
 * Enforces prompt injection defense, credential scrubbing, PII masking,
 * and context token budgeting before dispatching to external LLMs.
 */

import { AIMessage } from './types';

// Sensitive patterns that must NEVER reach an external LLM
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
];

export interface SanitizationResult {
  sanitizedContent: string;
  piiRedactedCount: number;
  credentialsScrubbedCount: number;
  injectionDetected: boolean;
}

export class AISecurityFirewall {
  /**
   * Sanitizes a single text string by scrubbing credentials, masking emails, and detecting injections
   */
  public static sanitizeText(text: string): SanitizationResult {
    let sanitized = text;
    let credentialsScrubbedCount = 0;
    let piiRedactedCount = 0;
    let injectionDetected = false;

    // 1. Check prompt injection markers
    for (const pattern of PROMPT_INJECTION_INDICATORS) {
      if (pattern.test(sanitized)) {
        injectionDetected = true;
        sanitized = sanitized.replace(pattern, '[SECURITY_OVERRIDE_FLAGGED]');
      }
    }

    // 2. Scrub credentials & secrets
    for (const pattern of CREDENTIAL_SCRUB_PATTERNS) {
      const matches = sanitized.match(pattern);
      if (matches) {
        credentialsScrubbedCount += matches.length;
        sanitized = sanitized.replace(pattern, '[SCRUBBED_CREDENTIAL]');
      }
    }

    // 3. Mask email addresses
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
   * Sanitizes full message array
   */
  public static sanitizeMessages(messages: AIMessage[]): AIMessage[] {
    return messages.map((msg) => {
      const { sanitizedContent } = this.sanitizeText(msg.content);
      return {
        ...msg,
        content: sanitizedContent,
      };
    });
  }

  /**
   * Enforces max character / token truncation budget
   */
  public static truncateContext(content: string, maxChars = 16000): string {
    if (content.length <= maxChars) return content;
    return content.slice(0, maxChars) + '\n...[Context truncated to fit token budget]';
  }
}
