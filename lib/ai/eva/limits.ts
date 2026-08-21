/**
 * AnalyticsRise — AI-EVA FinOps & Cost Controls
 * Centralized token boundaries, conversation turn limits, and tiered usage quotas.
 */

import { AiEvaQuotaState } from './types';

export const AI_EVA_LIMITS = {
  /**
   * Maximum character length allowed for user input prompt
   */
  MAX_USER_MESSAGE_LENGTH: 2000,

  /**
   * Maximum character length allowed for attached SQL queries in context
   */
  MAX_ATTACHED_QUERY_LENGTH: 1500,

  /**
   * Maximum character length allowed for attached error messages in context
   */
  MAX_ATTACHED_ERROR_LENGTH: 500,

  /**
   * Maximum character length allowed for attached formulas in workspace context
   */
  MAX_ATTACHED_FORMULA_LENGTH: 500,

  /**
   * Maximum rows allowed when a user approves sharing a small data sample
   */
  MAX_APPROVED_SAMPLE_ROWS: 10,

  /**
   * Maximum columns allowed in user-approved sample
   */
  MAX_APPROVED_SAMPLE_COLS: 20,


  /**
   * Maximum conversation history turns sent to provider (user + assistant pairs)
   */
  MAX_CONVERSATION_HISTORY_TURNS: 6,

  /**
   * Maximum token generation ceiling per response
   */
  MAX_RESPONSE_TOKENS: 600,

  /**
   * Minimum interval between consecutive requests from the same client (milliseconds)
   */
  RATE_LIMIT_COOLDOWN_MS: 2500,

  /**
   * Daily query limits by user tier
   */
  DAILY_QUOTA: {
    guest: 10,
    free: 25,
    pro: 250,
    enterprise: 1000,
  },
} as const;

const QUOTA_STORAGE_PREFIX = 'ar_ai_eva_quota_';

/**
 * Generates daily date key in YYYY-MM-DD format (UTC)
 */
function getTodayDateKey(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/**
 * Retrieves the current quota state for the learner
 */
export function getAiEvaQuotaState(
  userId?: string | null,
  isPro: boolean = false
): AiEvaQuotaState {
  const tier: 'free' | 'pro' | 'enterprise' = isPro ? 'pro' : 'free';
  const quotaLimit = isPro
    ? AI_EVA_LIMITS.DAILY_QUOTA.pro
    : userId
    ? AI_EVA_LIMITS.DAILY_QUOTA.free
    : AI_EVA_LIMITS.DAILY_QUOTA.guest;

  const dateKey = getTodayDateKey();
  const storageKey = `${QUOTA_STORAGE_PREFIX}${userId || 'guest'}_${dateKey}`;

  let queriesUsed = 0;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        queriesUsed = parseInt(stored, 10) || 0;
      }
    } catch {
      // Fallback for storage restricted environments
    }
  }

  const queriesRemaining = Math.max(0, quotaLimit - queriesUsed);

  // Compute midnight UTC reset timestamp
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);

  return {
    dailyQueriesUsed: queriesUsed,
    dailyQuotaLimit: quotaLimit,
    queriesRemaining,
    tier,
    isServerAuthoritative: false, // Honestly report launch-mode local quota state
    resetsAt: tomorrow.toISOString(),
  };
}

/**
 * Increments query usage count for today
 */
export function incrementAiEvaUsage(userId?: string | null): number {
  if (typeof window === 'undefined') return 1;

  const dateKey = getTodayDateKey();
  const storageKey = `${QUOTA_STORAGE_PREFIX}${userId || 'guest'}_${dateKey}`;

  try {
    const current = parseInt(localStorage.getItem(storageKey) || '0', 10) || 0;
    const updated = current + 1;
    localStorage.setItem(storageKey, updated.toString());
    return updated;
  } catch {
    return 1;
  }
}

/**
 * Validates whether the user has exceeded their daily quota
 */
export function isAiEvaQuotaAvailable(userId?: string | null, isPro: boolean = false): boolean {
  const quota = getAiEvaQuotaState(userId, isPro);
  return quota.queriesRemaining > 0;
}

/**
 * Trims conversation history to prevent token bloat
 */
export function trimConversationHistory<T>(messages: T[], maxTurns: number = AI_EVA_LIMITS.MAX_CONVERSATION_HISTORY_TURNS): T[] {
  if (!messages || messages.length <= maxTurns) {
    return messages;
  }
  return messages.slice(messages.length - maxTurns);
}
