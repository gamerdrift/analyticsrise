/**
 * RevenueRiseAI — Server-Side AI Model Policy Resolver
 * Determines allowed model, token budget, context budget, and temperature
 * based strictly on authoritative plan tier and capability.
 */

import { AICapability, AIModelPolicy } from './types';

export class AIModelPolicyResolver {
  private static readonly PLAN_CAPABILITY_MAP: Record<string, Set<AICapability>> = {
    free: new Set<AICapability>(['ai_mentor', 'ai_analytics', 'ai_market_education']),
    student_pro: new Set<AICapability>([
      'ai_mentor',
      'ai_reasoning',
      'ai_career',
      'ai_analytics',
      'ai_market_education',
    ]),
    pro: new Set<AICapability>([
      'ai_mentor',
      'ai_reasoning',
      'ai_career',
      'ai_analytics',
      'ai_market_education',
    ]),
    enterprise: new Set<AICapability>([
      'ai_mentor',
      'ai_reasoning',
      'ai_career',
      'ai_analytics',
      'ai_market_education',
    ]),
  };

  /**
   * Evaluates if user plan tier has access to requested AI capability
   */
  public static isCapabilityAllowed(planTier: string, capability: AICapability): boolean {
    const normalizedPlan = (planTier || 'free').toLowerCase();
    const allowed = this.PLAN_CAPABILITY_MAP[normalizedPlan] || this.PLAN_CAPABILITY_MAP.free;
    return allowed.has(capability);
  }

  /**
   * Resolves authoritative model policy parameters for execution
   */
  public static resolvePolicy(planTier: string, capability: AICapability = 'ai_mentor'): AIModelPolicy {
    const normalizedPlan = (planTier || 'free').toLowerCase();

    switch (normalizedPlan) {
      case 'enterprise':
        return {
          capability,
          planTier: 'enterprise',
          model: 'mock-intelligence-v1',
          maxTokens: 4096,
          contextBudgetChars: 32000,
          temperature: 0.6,
          timeoutMs: 20000,
        };

      case 'pro':
        return {
          capability,
          planTier: 'pro',
          model: 'mock-intelligence-v1',
          maxTokens: 2048,
          contextBudgetChars: 16000,
          temperature: 0.7,
          timeoutMs: 15000,
        };

      case 'student_pro':
        return {
          capability,
          planTier: 'student_pro',
          model: 'mock-intelligence-v1',
          maxTokens: 1200,
          contextBudgetChars: 8000,
          temperature: 0.7,
          timeoutMs: 15000,
        };

      case 'free':
      default:
        return {
          capability,
          planTier: 'free',
          model: 'mock-intelligence-v1',
          maxTokens: 500,
          contextBudgetChars: 4000,
          temperature: 0.7,
          timeoutMs: 10000,
        };
    }
  }
}
