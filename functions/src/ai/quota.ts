/**
 * RevenueRiseAI — Server-Authoritative AI Quota & Usage Accounting
 * Enforces transactionally protected limits on /aiUsage/{uid} in Firestore.
 */

import { FieldValue, Firestore } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { AITokenUsage, AIUsageRecord } from './types';

export interface PlanQuotaLimits {
  dailyRequests: number;
  monthlyRequests: number;
  monthlyTokens: number;
}

export class AIQuotaService {
  public static readonly PLAN_LIMITS: Record<string, PlanQuotaLimits> = {
    free: {
      dailyRequests: 10,
      monthlyRequests: 15,
      monthlyTokens: 25000,
    },
    student_pro: {
      dailyRequests: 50,
      monthlyRequests: 150,
      monthlyTokens: 250000,
    },
    pro: {
      dailyRequests: 500,
      monthlyRequests: -1, // Unlimited
      monthlyTokens: 1000000,
    },
    enterprise: {
      dailyRequests: -1, // Unlimited
      monthlyRequests: -1, // Unlimited
      monthlyTokens: -1, // Unlimited
    },
  };

  /**
   * Helper to format UTC Date as YYYY-MM-DD
   */
  public static getTodayYMD(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Helper to format current Month Period as YYYY-MM
   */
  public static getCurrentMonthPeriod(): { start: string; end: string } {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)).toISOString();
    return { start, end };
  }

  /**
   * Evaluates quota inside a Firestore transaction to prevent concurrent race exploitation
   */
  public static async assertAndReserveQuota(
    userId: string,
    planTier: string,
    database: Firestore
  ): Promise<void> {
    const limits = this.PLAN_LIMITS[planTier] || this.PLAN_LIMITS.free;
    const usageDocRef = database.collection('aiUsage').doc(userId);
    const today = this.getTodayYMD();
    const { start: periodStart } = this.getCurrentMonthPeriod();

    await database.runTransaction(async (tx) => {
      const snap = await tx.get(usageDocRef);
      let currentDaily = 0;
      let currentMonthly = 0;
      let currentTokens = 0;

      if (snap.exists) {
        const data = snap.data() as Partial<AIUsageRecord>;
        // Reset daily count if date changed
        if (data.dailyDate === today) {
          currentDaily = data.dailyRequests || 0;
        }
        // Reset monthly count if period changed
        if (data.periodStart === periodStart) {
          currentMonthly = data.monthlyRequests || 0;
          currentTokens = data.monthlyTokens || 0;
        }
      }

      // Check daily request ceiling
      if (limits.dailyRequests !== -1 && currentDaily >= limits.dailyRequests) {
        throw new HttpsError(
          'resource-exhausted',
          `Daily AI request quota reached (${currentDaily}/${limits.dailyRequests}). Resets at 00:00 UTC.`
        );
      }

      // Check monthly request ceiling
      if (limits.monthlyRequests !== -1 && currentMonthly >= limits.monthlyRequests) {
        throw new HttpsError(
          'resource-exhausted',
          `Monthly AI request quota exhausted (${currentMonthly}/${limits.monthlyRequests}). Please upgrade to Pro.`
        );
      }

      // Check monthly token ceiling
      if (limits.monthlyTokens !== -1 && currentTokens >= limits.monthlyTokens) {
        throw new HttpsError(
          'resource-exhausted',
          `Monthly token budget exhausted (${currentTokens}/${limits.monthlyTokens}). Please upgrade plan.`
        );
      }
    });
  }

  /**
   * Records authoritative usage in Firestore /aiUsage/{userId}
   */
  public static async recordUsage(
    userId: string,
    usage: AITokenUsage,
    database: Firestore
  ): Promise<void> {
    const usageDocRef = database.collection('aiUsage').doc(userId);
    const today = this.getTodayYMD();
    const { start: periodStart, end: periodEnd } = this.getCurrentMonthPeriod();

    await database.runTransaction(async (tx) => {
      const snap = await tx.get(usageDocRef);

      if (!snap.exists) {
        tx.set(usageDocRef, {
          userId,
          dailyRequests: 1,
          dailyDate: today,
          monthlyRequests: 1,
          monthlyTokens: usage.totalTokens,
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          estimatedCostUsd: usage.estimatedCostUsd,
          periodStart,
          periodEnd,
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        const data = snap.data() as Partial<AIUsageRecord>;
        const isNewDay = data.dailyDate !== today;
        const isNewMonth = data.periodStart !== periodStart;

        tx.update(usageDocRef, {
          dailyRequests: isNewDay ? 1 : FieldValue.increment(1),
          dailyDate: today,
          monthlyRequests: isNewMonth ? 1 : FieldValue.increment(1),
          monthlyTokens: isNewMonth ? usage.totalTokens : FieldValue.increment(usage.totalTokens),
          promptTokens: isNewMonth ? usage.promptTokens : FieldValue.increment(usage.promptTokens),
          completionTokens: isNewMonth ? usage.completionTokens : FieldValue.increment(usage.completionTokens),
          estimatedCostUsd: isNewMonth ? usage.estimatedCostUsd : FieldValue.increment(usage.estimatedCostUsd),
          periodStart,
          periodEnd,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    });
  }
}
