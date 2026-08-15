/**
 * RevenueRiseAI — Server-Side AI Mentor Execution Pipeline
 * Implements the authoritative 13-stage execution pipeline inside Cloud Functions v2.
 */

import { Firestore } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { db } from '../index';
import { AIMentorQueryData, AIMentorQueryResponse, AICapability } from './types';
import { AIModelPolicyResolver } from './policy';
import { AIQuotaService } from './quota';
import { AISecurityFirewall } from './security';
import { AIContextEngine } from './context';
import { AIProviderManager, aiProviderManager } from './providers/manager';
import { AIConversationRepository } from './repository';

export interface ProcessAIMentorQueryOptions {
  firestoreDb?: Firestore;
  providerManager?: AIProviderManager;
}

/**
 * Authoritative AI Mentor Query Processor
 */
export async function processAIMentorQuery(
  userId: string,
  data: AIMentorQueryData,
  options: ProcessAIMentorQueryOptions = {}
): Promise<AIMentorQueryResponse> {
  const database = options.firestoreDb || db;
  const providers = options.providerManager || aiProviderManager;

  // =========================================================================
  // STAGE 1: REQUEST VALIDATION
  // =========================================================================
  if (!data || typeof data !== 'object') {
    throw new HttpsError('invalid-argument', 'Request body must be a valid JSON object.');
  }

  if (!data.query || typeof data.query !== 'string' || data.query.trim() === '') {
    throw new HttpsError('invalid-argument', 'The "query" field is required and cannot be empty.');
  }

  // =========================================================================
  // STAGE 2: AUTHENTICATION ENFORCEMENT
  // =========================================================================
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new HttpsError('unauthenticated', 'User must be authenticated with Firebase Auth.');
  }

  // =========================================================================
  // STAGE 3: ENTITLEMENT RESOLUTION (Direct Firestore Read from /entitlements/{uid})
  // =========================================================================
  let userPlanTier = 'free';
  try {
    const entDoc = await database.collection('entitlements').doc(userId).get();
    if (entDoc.exists) {
      const entData = entDoc.data();
      // Check if entitlement has not expired
      const isExpired = entData?.effectiveUntil
        ? entData.effectiveUntil.toDate().getTime() <= Date.now()
        : false;
      if (!isExpired && entData?.planId) {
        userPlanTier = entData.planId;
      }
    }
  } catch (err: any) {
    logger.warn('Could not read user entitlement record, defaulting to free tier:', {
      userId,
      error: err?.message,
    });
  }

  const capability: AICapability = data.capability || 'ai_mentor';
  if (!AIModelPolicyResolver.isCapabilityAllowed(userPlanTier, capability)) {
    throw new HttpsError(
      'permission-denied',
      `Your current plan (${userPlanTier}) does not include access to "${capability}". Please upgrade to Pro.`
    );
  }

  // =========================================================================
  // STAGE 4: QUOTA CHECK (Transactional /aiUsage/{uid})
  // =========================================================================
  await AIQuotaService.assertAndReserveQuota(userId, userPlanTier, database);

  // =========================================================================
  // STAGE 5: INPUT VALIDATION
  // =========================================================================
  const MAX_INPUT_CHARS = 8000;
  if (data.query.length > MAX_INPUT_CHARS) {
    throw new HttpsError(
      'invalid-argument',
      `Input query exceeds maximum allowed limit (${data.query.length}/${MAX_INPUT_CHARS} chars).`
    );
  }

  // =========================================================================
  // STAGE 6: INPUT SECURITY FIREWALL
  // =========================================================================
  const { sanitizedContent, injectionDetected, credentialsScrubbedCount } =
    AISecurityFirewall.sanitizeInput(data.query);

  if (injectionDetected) {
    logger.warn('Prompt injection attempt flagged on AI query:', {
      userId,
      queryLength: data.query.length,
    });
  }

  if (credentialsScrubbedCount > 0) {
    logger.info(`Scrubbed ${credentialsScrubbedCount} credentials/secrets from user prompt.`, {
      userId,
    });
  }

  // =========================================================================
  // STAGE 7: CONTEXT BUILDING
  // =========================================================================
  const pedagogicalMode = data.pedagogicalMode || 'socratic';

  // =========================================================================
  // STAGE 8: MODEL POLICY RESOLUTION
  // =========================================================================
  const policy = AIModelPolicyResolver.resolvePolicy(userPlanTier, capability);
  const messages = AIContextEngine.assemblePromptMessages(
    sanitizedContent,
    data.context,
    pedagogicalMode,
    policy.contextBudgetChars
  );

  // =========================================================================
  // STAGE 9: AI PROVIDER MANAGER EXECUTION
  // =========================================================================
  const providerResult = await providers.generateWithFallback({
    messages,
    model: policy.model,
    maxTokens: policy.maxTokens,
    temperature: policy.temperature,
    timeoutMs: policy.timeoutMs,
  });

  // =========================================================================
  // STAGE 10: OUTPUT SECURITY CHECK
  // =========================================================================
  const { sanitizedContent: safeOutput, leaksDetected } = AISecurityFirewall.sanitizeOutput(
    providerResult.content
  );

  if (leaksDetected) {
    logger.warn('Output security check sanitized potential secret leak from model completion', {
      userId,
      modelUsed: providerResult.modelUsed,
    });
  }

  // =========================================================================
  // STAGE 11: USAGE ACCOUNTING (Atomic Increment in /aiUsage/{uid})
  // =========================================================================
  await AIQuotaService.recordUsage(userId, providerResult.usage, database);

  // =========================================================================
  // STAGE 12: CONVERSATION PERSISTENCE
  // =========================================================================
  const conversation = await AIConversationRepository.getOrCreateConversation(
    userId,
    data.conversationId,
    pedagogicalMode,
    database
  );

  const { assistantMessageId } = await AIConversationRepository.persistExchange(
    conversation.conversationId,
    userId,
    data.query,
    safeOutput,
    providerResult.modelUsed,
    providerResult.usage,
    database
  );

  // =========================================================================
  // STAGE 13: RETURN RESPONSE
  // =========================================================================
  logger.info('AI Mentor query executed successfully:', {
    userId,
    conversationId: conversation.conversationId,
    totalTokens: providerResult.usage.totalTokens,
    modelUsed: providerResult.modelUsed,
    providerUsed: providerResult.providerUsed,
  });

  return {
    conversationId: conversation.conversationId,
    messageId: assistantMessageId,
    content: safeOutput,
    codeSnippet: providerResult.codeSnippet,
    suggestedFollowUps: providerResult.suggestedFollowUps,
    suggestedActionRoutes: providerResult.suggestedActionRoutes,
    usage: providerResult.usage,
    modelUsed: providerResult.modelUsed,
    providerUsed: providerResult.providerUsed,
    finishReason: providerResult.finishReason,
    timestamp: new Date().toISOString(),
  };
}
