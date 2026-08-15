/**
 * RevenueRiseAI — Multi-Vendor AI Provider Manager
 * Manages provider registration, active provider selection, circuit breaker
 * failovers, and request routing across external and mock LLM providers.
 */

import { IAIProvider } from './AIProvider';
import { AIRequest, AIResponse, AIProviderConfig } from './types';
import { mockAIProvider } from './providers/MockAIProvider';
import { AIProviderError } from '@/lib/errors';
import { logger } from '@/lib/observability';

export class AIProviderManager {
  private providers: Map<string, IAIProvider> = new Map();
  private activeProviderId = 'mock_provider';
  private failureCounts: Map<string, number> = new Map();
  private maxConsecutiveFailures = 3;

  constructor(includeDefaultMock = true) {
    if (includeDefaultMock) {
      // Register default mock provider for deterministic tests & baseline
      this.registerProvider(mockAIProvider);
    }
  }

  public clearProviders() {
    this.providers.clear();
    this.failureCounts.clear();
  }

  public registerProvider(provider: IAIProvider) {
    this.providers.set(provider.providerId, provider);
    if (!this.activeProviderId || this.providers.size === 1) {
      this.activeProviderId = provider.providerId;
    }
  }

  public getAvailableProviders(): AIProviderConfig[] {
    return Array.from(this.providers.values()).map((p, idx) => ({
      providerId: p.providerId,
      displayName: p.providerId.toUpperCase().replace('_', ' '),
      defaultModel: p.defaultModel,
      isAvailable: (this.failureCounts.get(p.providerId) || 0) < this.maxConsecutiveFailures,
      priority: idx + 1,
    }));
  }

  public setActiveProvider(providerId: string) {
    if (!this.providers.has(providerId)) {
      throw new AIProviderError(`Provider ${providerId} is not registered.`);
    }
    this.activeProviderId = providerId;
  }

  public getActiveProvider(): IAIProvider {
    const provider = this.providers.get(this.activeProviderId);
    if (!provider) {
      return mockAIProvider;
    }
    return provider;
  }

  /**
   * Dispatches generation with automated fallback on provider failure
   */
  public async generateWithFallback(request: AIRequest): Promise<AIResponse> {
    const primary = this.getActiveProvider();

    try {
      const response = await primary.generate(request);
      this.recordSuccess(primary.providerId);
      return response;
    } catch (err: any) {
      this.recordFailure(primary.providerId);
      logger.warn(`Primary provider ${primary.providerId} failed, evaluating fallback:`, {
        error: err?.message,
      });

      // Fallback to secondary available providers
      for (const [id, fallback] of this.providers.entries()) {
        if (id !== primary.providerId && (this.failureCounts.get(id) || 0) < this.maxConsecutiveFailures) {
          try {
            logger.info(`Attempting fallback to provider ${id}...`);
            const fallbackResponse = await fallback.generate(request);
            this.recordSuccess(id);
            return fallbackResponse;
          } catch (fallbackErr: any) {
            this.recordFailure(id);
          }
        }
      }

      throw new AIProviderError(`All AI providers failed. Upstream message: ${err?.message}`);
    }
  }

  private recordSuccess(providerId: string) {
    this.failureCounts.set(providerId, 0);
  }

  private recordFailure(providerId: string) {
    const current = this.failureCounts.get(providerId) || 0;
    this.failureCounts.set(providerId, current + 1);
  }
}

export const aiProviderManager = new AIProviderManager();
