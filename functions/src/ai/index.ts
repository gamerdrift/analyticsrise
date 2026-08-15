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
