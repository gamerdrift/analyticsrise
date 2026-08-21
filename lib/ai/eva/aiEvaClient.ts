/**
 * AnalyticsRise — AI-EVA Client-Side Service Proxy
 * Encapsulates rate-limiting, safety filtering, quota tracking, telemetry,
 * and secure backend routing with seamless intelligent pedagogical fallback.
 */

import { httpsCallable } from 'firebase/functions';
import { functions, auth } from '@/lib/firebase/config';
import { AiEvaRequest, AiEvaResponse, AiEvaContext, AiEvaMessage } from './types';
import { validateUserPrompt, sanitizeAiEvaContext, postProcessAiResponse } from './safety';
import {
  isAiEvaQuotaAvailable,
  incrementAiEvaUsage,
  getAiEvaQuotaState,
  AI_EVA_LIMITS,
} from './limits';
import { IntelligentFallbackProvider } from './providers/intelligentFallback';
import { AnalyticsService } from '@/lib/services/analytics';

const fallbackProvider = new IntelligentFallbackProvider();

export class AiEvaClient {
  private lastRequestTimestamp: number = 0;
  private forceFallbackMode: boolean = false;

  public setForceFallbackMode(force: boolean) {
    this.forceFallbackMode = force;
  }

  /**
   * Primary entrypoint to send a message to AI-EVA
   */
  public async sendMessage(
    userQuestion: string,
    history: AiEvaMessage[] = [],
    context?: AiEvaContext,
    isPro: boolean = false
  ): Promise<AiEvaResponse> {
    const currentUserId = typeof window !== 'undefined' && auth?.currentUser ? auth.currentUser.uid : null;

    // 1. Safety & Prompt Validation
    const validation = validateUserPrompt(userQuestion);
    if (!validation.isSafe) {
      AnalyticsService.logAiEvaError({
        product: context?.product || 'general',
        errorType: 'validation_rejection',
      });
      return {
        id: `eva_err_${Date.now()}`,
        content: `⚠️ ${validation.violationReason || 'Invalid request.'}`,
        modelUsed: 'eva-safety-firewall',
        providerUsed: 'local',
        finishReason: 'rejected',
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Rate-Limiting Cooldown Check
    const now = Date.now();
    if (now - this.lastRequestTimestamp < AI_EVA_LIMITS.RATE_LIMIT_COOLDOWN_MS) {
      return {
        id: `eva_cooldown_${Date.now()}`,
        content: `⏱️ Please wait a moment before sending another message.`,
        modelUsed: 'eva-rate-limiter',
        providerUsed: 'local',
        finishReason: 'rate_limited',
        timestamp: new Date().toISOString(),
      };
    }
    this.lastRequestTimestamp = now;

    // 3. Quota Availability Check
    if (!isAiEvaQuotaAvailable(currentUserId, isPro)) {
      const quota = getAiEvaQuotaState(currentUserId, isPro);
      AnalyticsService.logAiEvaLimitReached({
        product: context?.product || 'general',
        quotaLimit: quota.dailyQuotaLimit,
      });
      return {
        id: `eva_limit_${Date.now()}`,
        content: `📊 You have reached your daily AI-EVA limit (${quota.dailyQuotaLimit} queries/day on ${quota.tier.toUpperCase()} tier). Your quota resets at midnight UTC. Upgrade to Pro for extended limits!`,
        modelUsed: 'eva-quota-manager',
        providerUsed: 'local',
        finishReason: 'quota_exceeded',
        timestamp: new Date().toISOString(),
      };
    }

    // 4. Sanitize Context
    const sanitizedContext = sanitizeAiEvaContext(context);

    const requestPayload: AiEvaRequest = {
      userQuestion,
      messages: history,
      context: sanitizedContext,
      conversationId: `conv_${Date.now()}`,
    };

    // Log telemetry for user request
    AnalyticsService.logAiEvaMessageSent({
      product: sanitizedContext?.product || 'general',
      promptLength: userQuestion.length,
      hasErrorContext: Boolean(sanitizedContext?.sqlError),
      hasQueryContext: Boolean(sanitizedContext?.currentQuery),
    });

    const startTime = Date.now();

    // 5. Secure Backend Callable or Intelligent In-Browser Fallback
    let response: AiEvaResponse;

    if (
      !this.forceFallbackMode &&
      typeof window !== 'undefined' &&
      auth?.currentUser &&
      functions
    ) {
      try {
        const callable = httpsCallable<AiEvaRequest, AiEvaResponse>(
          functions,
          'aiEvaQuery'
        );
        const result = await callable(requestPayload);
        response = result.data;
      } catch (err: any) {
        // Graceful fallback to client-side intelligent engine
        response = await fallbackProvider.generateResponse(requestPayload);
      }
    } else {
      // In-browser intelligent pedagogical engine
      response = await fallbackProvider.generateResponse(requestPayload);
    }

    const latencyMs = Date.now() - startTime;

    // 6. Post-process response to ensure zero secret leakages
    response.content = postProcessAiResponse(response.content);

    // 7. Track usage quota
    incrementAiEvaUsage(currentUserId);

    // 8. Log telemetry for response received
    AnalyticsService.logAiEvaResponseReceived({
      product: sanitizedContext?.product || 'general',
      providerUsed: response.providerUsed,
      responseLength: response.content.length,
      latencyMs,
    });

    return response;
  }
}

export const aiEvaClient = new AiEvaClient();
