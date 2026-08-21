/**
 * RevenueRiseAI — Server-Side AI Module Barrel & Cloud Function Entrypoint
 */

import { onCall, HttpsError, CallableRequest } from 'firebase-functions/v2/https';
import { AIMentorQueryData, AIMentorQueryResponse } from './types';
import { processAIMentorQuery } from './mentor';

export * from './types';
export * from './security';
export * from './policy';
export * from './quota';
export * from './context';
export * from './repository';
export * from './mentor';
export * from './providers/types';
export * from './providers/mock';
export * from './providers/manager';

/**
 * Cloud Function v2 Callable: aiMentorQuery
 *
 * Authenticated AI endpoint enforcing the 13-stage server-authoritative execution pipeline.
 */
export const aiMentorQuery = onCall(
  {
    cors: true,
    maxInstances: 20,
  },
  async (request: CallableRequest<AIMentorQueryData>): Promise<AIMentorQueryResponse> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated with Firebase Auth to query the AI Mentor.'
      );
    }

    const userId = request.auth.uid;
    return processAIMentorQuery(userId, request.data);
  }
);

/**
 * Cloud Function v2 Callable: aiEvaQuery (Mission 08)
 *
 * Authenticated endpoint for AI-EVA queries on the server-side.
 */
export const aiEvaQuery = onCall(
  {
    cors: true,
    maxInstances: 20,
  },
  async (request: CallableRequest<any>): Promise<any> => {
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError(
        'unauthenticated',
        'User must be authenticated with Firebase Auth to query AI-EVA.'
      );
    }

    const data = request.data || {};
    const question = String(data.userQuestion || '').trim();
    if (!question) {
      throw new HttpsError('invalid-argument', 'Question cannot be empty.');
    }

    // Default pedagogical response
    return {
      id: `eva_srv_${Date.now()}`,
      content: `Hello from AI-EVA! I received your query regarding "${data.context?.challengeTitle || 'SQL'}". Let's work through this step by step.`,
      modelUsed: 'eva-server-v1',
      providerUsed: 'analyticsrise-cloud',
      finishReason: 'stop',
      timestamp: new Date().toISOString(),
    };
  }
);

