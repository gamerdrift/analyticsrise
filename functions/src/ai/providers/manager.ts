/**
 * RevenueRiseAI — Server-Side AI Provider Manager
 * Manages provider registration, circuit breakers, timeout governance, and automated failover.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { IAIProvider, ProviderGenerateOptions, ProviderGenerateResult, AIProviderConfig } from './types';
import { mockAIProvider } from './mock';

export class AIProviderManager {
  private providers: Map<string, IAIProvider> = new Map();
  private activeProviderId = 'mock_provider';
  private failureCounts: Map<string, number> = new Map();
  private readonly maxConsecutiveFailures = 3;

  constructor(includeDefaultMock = true) {
    if (includeDefaultMock) {
      this.registerProvider(mockAIProvider);
    }
  }

  public clearProviders() {
    this.providers.clear();
    this.failureCounts.clear();
    this.activeProviderId = '';
  }

  public registerProvider(provider: IAIProvider) {
    this.providers.set(provider.providerId, provider);
    if (!this.activeProviderId || this.providers.size === 1) {
      this.activeProviderId = provider.providerId;
    }
  }

  public setActiveProvider(providerId: string) {
    if (!this.providers.has(providerId)) {
      throw new HttpsError('not-found', `Provider ${providerId} is not registered.`);
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

  public getAvailableProviders(): AIProviderConfig[] {
    return Array.from(this.providers.values()).map((p, idx) => ({
      providerId: p.providerId,
      displayName: p.providerId.toUpperCase().replace('_', ' '),
      defaultModel: p.defaultModel,
      isAvailable: (this.failureCounts.get(p.providerId) || 0) < this.maxConsecutiveFailures,
      priority: idx + 1,
    }));
  }

  /**
   * Executes AI generation with timeout enforcement and circuit breaker failover
   */
  public async generateWithFallback(options: ProviderGenerateOptions): Promise<ProviderGenerateResult> {
    const primary = this.getActiveProvider();

    try {
      const response = await this.executeWithTimeout(primary, options);
      this.recordSuccess(primary.providerId);
      return response;
    } catch (err: any) {
      this.recordFailure(primary.providerId);
      logger.warn(`AI Provider ${primary.providerId} failed generation, attempting fallback:`, {
        error: err?.message,
      });

      // Attempt fallback to other registered, healthy providers
      for (const [id, fallbackProvider] of this.providers.entries()) {
        if (id !== primary.providerId && (this.failureCounts.get(id) || 0) < this.maxConsecutiveFailures) {
          try {
            logger.info(`Routing request to fallback provider ${id}...`);
            const fallbackResponse = await this.executeWithTimeout(fallbackProvider, options);
            this.recordSuccess(id);
            return fallbackResponse;
          } catch (fallbackErr: any) {
            this.recordFailure(id);
            logger.warn(`Fallback provider ${id} also failed:`, { error: fallbackErr?.message });
          }
        }
      }

      throw new HttpsError(
        'unavailable',
        `AI Intelligence Engine temporarily unavailable. Upstream cause: ${err?.message || 'timeout'}`
      );
    }
  }

  private async executeWithTimeout(
    provider: IAIProvider,
    options: ProviderGenerateOptions
  ): Promise<ProviderGenerateResult> {
    const timeoutMs = options.timeoutMs || 15000;

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`AI provider execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([provider.generate(options), timeoutPromise]);
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
