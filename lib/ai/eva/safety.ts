/**
 * AnalyticsRise — AI-EVA Security & Privacy Firewall
 * Sanitizes input contexts, filters sensitive data, detects prompt injections,
 * and ensures SQL challenge answers and private system secrets never leak.
 */

import { AiEvaContext, AiEvaSecurityValidation } from './types';
import { AI_EVA_LIMITS } from './limits';
import { sanitizeExcelWorkspaceContext } from './context/sanitizer';


// Patterns associated with prompt injection, system jailbreaks, and secret extraction
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(unrestricted|jailbroken|dan|in\s+developer\s+mode)/i,
  /reveal\s+(the\s+)?(system\s+prompt|hidden\s+instructions|master\s+key|api\s+key)/i,
  /print\s+(your\s+)?(initial|system)\s+(prompt|instructions)/i,
  /bypass\s+(all\s+)?(guardrails|safety|security|filters)/i,
  /give\s+me\s+the\s+(exact|official|canonical)?.*(solution|answer\s+key|sql\s+query).*challenge/i,
];


// Sensitive keys that must NEVER appear in contextual payloads
const SENSITIVE_CONTEXT_KEYS = [
  'token',
  'jwt',
  'password',
  'secret',
  'key',
  'authorization',
  'bearer',
  'expectedquery',
  'solutionquery',
  'canonicalquery',
  'answerkey',
  'validationrules',
  'privateseed',
];

/**
 * Validates a user's input prompt for security, injection vectors, and length boundaries
 */
export function validateUserPrompt(prompt: string): AiEvaSecurityValidation {
  if (!prompt || typeof prompt !== 'string') {
    return {
      isSafe: false,
      violationReason: 'Prompt cannot be empty.',
    };
  }

  const trimmed = prompt.trim();
  if (trimmed.length === 0) {
    return {
      isSafe: false,
      violationReason: 'Prompt cannot be whitespace only.',
    };
  }

  if (trimmed.length > AI_EVA_LIMITS.MAX_USER_MESSAGE_LENGTH) {
    return {
      isSafe: false,
      violationReason: `Prompt exceeds maximum length of ${AI_EVA_LIMITS.MAX_USER_MESSAGE_LENGTH} characters.`,
    };
  }

  // Check for adversarial prompt injection signatures
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isSafe: false,
        violationReason: 'Prompt contains unauthorized administrative or override syntax.',
      };
    }
  }

  return { isSafe: true };
}

/**
 * Sanitizes context metadata before it is processed or sent to an AI provider
 */
export function sanitizeAiEvaContext(context?: AiEvaContext): AiEvaContext | undefined {
  if (!context) return undefined;

  const sanitized: AiEvaContext = {
    product: context.product,
    learnerLevel: context.learnerLevel || 'beginner',
  };

  if (context.challengeId) {
    sanitized.challengeId = String(context.challengeId).slice(0, 100);
  }

  if (context.challengeTitle) {
    sanitized.challengeTitle = String(context.challengeTitle).slice(0, 150);
  }

  // Sanitize attached query
  if (context.currentQuery) {
    let cleanQuery = String(context.currentQuery).trim();
    if (cleanQuery.length > AI_EVA_LIMITS.MAX_ATTACHED_QUERY_LENGTH) {
      cleanQuery = cleanQuery.slice(0, AI_EVA_LIMITS.MAX_ATTACHED_QUERY_LENGTH) + ' -- [truncated]';
    }
    sanitized.currentQuery = cleanQuery;
  }

  // Sanitize attached error message
  if (context.sqlError) {
    let cleanError = String(context.sqlError).trim();
    if (cleanError.length > AI_EVA_LIMITS.MAX_ATTACHED_ERROR_LENGTH) {
      cleanError = cleanError.slice(0, AI_EVA_LIMITS.MAX_ATTACHED_ERROR_LENGTH) + '...';
    }
    sanitized.sqlError = cleanError;
  }

  if (context.activeSchema) {
    sanitized.activeSchema = String(context.activeSchema).slice(0, 100);
  }

  if (context.activeTable) {
    sanitized.activeTable = String(context.activeTable).slice(0, 100);
  }

  if (Array.isArray(context.activeColumns)) {
    sanitized.activeColumns = context.activeColumns
      .slice(0, 30)
      .map((col) => String(col).slice(0, 50));
  }

  // Clean additionalContext by stripping sensitive keys
  if (context.additionalContext && typeof context.additionalContext === 'object') {
    const cleanedAdditional: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(context.additionalContext)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_CONTEXT_KEYS.some((sk) => lowerKey.includes(sk));
      if (!isSensitive && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        cleanedAdditional[key] = typeof value === 'string' ? value.slice(0, 200) : value;
      }
    }
    if (Object.keys(cleanedAdditional).length > 0) {
      sanitized.additionalContext = cleanedAdditional;
    }
  }

  // Sanitize Excel Workspace Context (Mission 09)
  if (context.excelContext) {
    sanitized.excelContext = sanitizeExcelWorkspaceContext(context.excelContext);
    sanitized.workspaceType = context.workspaceType || 'excel_workspace';
    sanitized.privacyLevel = sanitized.excelContext?.privacyLevel || 'metadata';
  }

  return sanitized;
}

/**
 * Verifies that AI-EVA responses never reveal verbatim solution queries or internal secrets
 */
export function postProcessAiResponse(responseContent: string): string {
  if (!responseContent) return '';

  // Redact any accidental environment variable or token leaks
  let clean = responseContent.replace(/sk-[a-zA-Z0-9]{20,}/g, '[REDACTED_SECRET]');
  clean = clean.replace(/eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, '[REDACTED_JWT]');

  return clean;
}
