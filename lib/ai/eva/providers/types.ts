/**
 * AnalyticsRise — AI-EVA Provider Contracts
 */

import { AiEvaRequest, AiEvaResponse } from '../types';

export interface IAiEvaProvider {
  readonly providerId: string;
  readonly defaultModel: string;

  /**
   * Generates an educational response for the learner request
   */
  generateResponse(request: AiEvaRequest): Promise<AiEvaResponse>;
}
