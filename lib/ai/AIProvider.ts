/**
 * RevenueRiseAI — Polymorphic AIProvider Interface
 * Decouples all application intelligence and mentor workflows from individual LLM vendors.
 */

import { AIRequest, AIResponse, AIMessage } from './types';

export interface AIProviderHealth {
  healthy: boolean;
  latencyMs: number;
  providerId: string;
  error?: string;
}

export interface IAIProvider {
  readonly providerId: string;
  readonly defaultModel: string;

  /**
   * Generates a complete AI response for given request
   */
  generate(request: AIRequest): Promise<AIResponse>;

  /**
   * Streams token chunks asynchronously
   */
  stream(request: AIRequest): AsyncIterable<string>;

  /**
   * Estimates token requirement before executing external API call
   */
  estimateTokens(messages: AIMessage[]): number;

  /**
   * Health and quota check
   */
  healthCheck(): Promise<AIProviderHealth>;
}
