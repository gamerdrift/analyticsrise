/**
 * RevenueRiseAI — Server-Authoritative AI Usage Meter
 * Computes token accounting, cost metrics, and quota boundaries.
 */

import { AITokenUsage, AuthoritativeAIUsageRecord } from './types';

export class AIUsageMeter {
  // Estimated model pricing per 1M tokens ($)
  public static readonly MODEL_RATES_PER_MILLION = {
    'gemini-1.5-pro': { input: 3.5, output: 10.5 },
    'gemini-1.5-flash': { input: 0.35, output: 1.05 },
    'claude-3-5-sonnet': { input: 3.0, output: 15.0 },
    'gpt-4o': { input: 5.0, output: 15.0 },
    'mock-intelligence-v1': { input: 1.5, output: 2.0 },
  };

  /**
   * Calculates estimated cost in USD based on model and token counts
   */
  public static calculateCostUsd(model: string, promptTokens: number, completionTokens: number): number {
    const rates = this.MODEL_RATES_PER_MILLION[model as keyof typeof this.MODEL_RATES_PER_MILLION] || {
      input: 3.0,
      output: 10.0,
    };

    const cost = (promptTokens / 1_000_000) * rates.input + (completionTokens / 1_000_000) * rates.output;
    return Number(cost.toFixed(6));
  }

  /**
   * Evaluates if an usage addition breaches the allowed monthly budget ceiling
   */
  public static isUsageWithinLimit(
    currentRecord: AuthoritativeAIUsageRecord,
    newUsage: AITokenUsage,
    monthlyTokenQuota: number
  ): boolean {
    if (monthlyTokenQuota === -1) return true; // Unlimited tier
    return currentRecord.monthlyTokens + newUsage.totalTokens <= monthlyTokenQuota;
  }
}
