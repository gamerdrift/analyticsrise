/**
 * RevenueRiseAI — Server-Side Mock AI Provider
 * Deterministic provider used for local offline development, unit tests, and CI/CD pipelines.
 */

import { IAIProvider, ProviderGenerateOptions, ProviderGenerateResult } from './types';
import { ConstructedMessage } from '../context';

export class MockAIProvider implements IAIProvider {
  public readonly providerId = 'mock_provider';
  public readonly defaultModel = 'mock-intelligence-v1';

  private shouldFail = false;
  private delayMs = 10;

  public setFail(fail: boolean) {
    this.shouldFail = fail;
  }

  public setDelay(delay: number) {
    this.delayMs = delay;
  }

  public estimateTokens(messages: ConstructedMessage[]): number {
    const totalChars = messages.reduce((acc, m) => acc + m.content.length, 0);
    return Math.max(1, Math.ceil(totalChars / 4));
  }

  public async healthCheck(): Promise<{ healthy: boolean; latencyMs: number; error?: string }> {
    return {
      healthy: !this.shouldFail,
      latencyMs: this.delayMs,
      error: this.shouldFail ? 'Mock provider simulated outage' : undefined,
    };
  }

  public async generate(options: ProviderGenerateOptions): Promise<ProviderGenerateResult> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }

    if (this.shouldFail) {
      throw new Error('Simulated upstream AI provider connection error');
    }

    const lastUserMessage = [...options.messages].reverse().find((m) => m.role === 'user')?.content || '';
    const promptTokens = this.estimateTokens(options.messages);

    let content = "I have analyzed your architecture. Let's break down the execution mechanics step-by-step.";
    let codeSnippet: string | undefined;

    if (/sql|query|select|table|index/i.test(lastUserMessage)) {
      content =
        'To optimize this query, consider restructuring your JOIN condition and ensuring an index exists on the foreign key column:';
      codeSnippet = 'EXPLAIN ANALYZE\nSELECT u.id, u.email, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.email;';
    } else if (/python|pandas|dataframe/i.test(lastUserMessage)) {
      content = 'Using vectorized Pandas operations is significantly faster than row iteration with `.iterrows()`:';
      codeSnippet = 'import pandas as pd\n\n# Vectorized calculation\ndf["adjusted_revenue"] = df["gross_revenue"] * (1 - df["discount_rate"])';
    }

    const completionTokens = Math.max(1, Math.ceil(content.length / 4));
    const totalTokens = promptTokens + completionTokens;

    // Rate: $1.50 input / $2.00 output per 1M tokens
    const estimatedCostUsd = Number(
      ((promptTokens / 1_000_000) * 1.5 + (completionTokens / 1_000_000) * 2.0).toFixed(6)
    );

    return {
      content,
      codeSnippet,
      suggestedFollowUps: [
        'How do I benchmark query latency?',
        'Can you show me the execution plan analysis?',
        'What are the memory trade-offs?',
      ],
      suggestedActionRoutes: ['/analytics', '/learning'],
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd,
      },
      modelUsed: options.model || this.defaultModel,
      providerUsed: this.providerId,
      finishReason: 'stop',
    };
  }
}

export const mockAIProvider = new MockAIProvider();
