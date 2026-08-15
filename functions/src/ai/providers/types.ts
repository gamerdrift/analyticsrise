/**
 * RevenueRiseAI — Server-Side AI Provider Interfaces
 */

import { ConstructedMessage } from '../context';
import { AITokenUsage } from '../types';

export interface ProviderGenerateOptions {
  messages: ConstructedMessage[];
  model: string;
  maxTokens: number;
  temperature: number;
  timeoutMs: number;
}

export interface ProviderGenerateResult {
  content: string;
  codeSnippet?: string;
  suggestedFollowUps: string[];
  suggestedActionRoutes: string[];
  usage: AITokenUsage;
  modelUsed: string;
  providerUsed: string;
  finishReason: string;
}

export interface IAIProvider {
  readonly providerId: string;
  readonly defaultModel: string;

  generate(options: ProviderGenerateOptions): Promise<ProviderGenerateResult>;
  estimateTokens(messages: ConstructedMessage[]): number;
  healthCheck(): Promise<{ healthy: boolean; latencyMs: number; error?: string }>;
}

export interface AIProviderConfig {
  providerId: string;
  displayName: string;
  defaultModel: string;
  isAvailable: boolean;
  priority: number;
}
