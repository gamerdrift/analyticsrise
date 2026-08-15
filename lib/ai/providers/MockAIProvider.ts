/**
 * RevenueRiseAI — Deterministic Mock AI Provider
 * Used for automated test suites, offline development, and fallback sandbox.
 */

import { IAIProvider, AIProviderHealth } from '../AIProvider';
import { AIRequest, AIResponse, AIMessage } from '../types';

export class MockAIProvider implements IAIProvider {
  public readonly providerId = 'mock_provider';
  public readonly defaultModel = 'mock-intelligence-v1';
  private shouldFail = false;
  private latencyMs = 10;

  public setFail(fail: boolean) {
    this.shouldFail = fail;
  }

  public setLatency(latency: number) {
    this.latencyMs = latency;
  }

  public async generate(request: AIRequest): Promise<AIResponse> {
    if (this.shouldFail) {
      throw new Error('Mock AI Provider simulated upstream failure.');
    }

    if (this.latencyMs > 0) {
      await new Promise((r) => setTimeout(r, this.latencyMs));
    }

    const lastMessage = request.messages[request.messages.length - 1]?.content || '';
    const mode = request.pedagogicalMode || 'direct';

    let content = `[RevenueRiseAI Mentor - ${mode.toUpperCase()}]: I analyzed your query. Let's break down the logic step-by-step.`;

    if (request.context?.simulatorType === 'sql') {
      content = `[RevenueRiseAI SQL Mentor]: In relational SQL, ensure you use GROUP BY on all non-aggregated columns. Check your HAVING clause.`;
    } else if (request.context?.simulatorType === 'python') {
      content = `[RevenueRiseAI Python Mentor]: In Pandas, avoid iterating rows with for-loops. Use vectorized operations like .apply() or .groupby().`;
    } else if (lastMessage.toLowerCase().includes('interview')) {
      content = `[RevenueRiseAI Interview Coach]: Great framing! To elevate your answer, quantify the business impact (e.g. "+18% efficiency increase").`;
    }

    let codeSnippet: string | undefined = request.context?.activeCodeSnippet
      ? '-- Optimized Query Example\nSELECT id, count(*) FROM users GROUP BY id;'
      : undefined;

    if (!codeSnippet && /sql|query|select|table/i.test(lastMessage)) {
      codeSnippet = '-- Optimized Index Query Example\nSELECT id, email FROM users WHERE active = true ORDER BY created_at DESC;';
    } else if (!codeSnippet && /python|pandas|dataframe/i.test(lastMessage)) {
      codeSnippet = 'import pandas as pd\n\n# Vectorized calculation\ndf["adjusted_revenue"] = df["gross_revenue"] * (1 - df["discount_rate"])';
    }

    const promptTokens = this.estimateTokens(request.messages);
    const completionTokens = Math.ceil(content.length / 4);

    return {
      id: `mock_resp_${Date.now()}`,
      content,
      codeSnippet,
      suggestedFollowUps: [
        'How do I optimize this query for large datasets?',
        'Can you show me the execution plan?',
        'What are the key trade-offs?',
      ],
      suggestedActionRoutes: ['/learning', '/analytics'],
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        estimatedCostUsd: Number(((promptTokens * 0.0000015) + (completionTokens * 0.000002)).toFixed(6)),
      },
      modelUsed: this.defaultModel,
      providerUsed: this.providerId,
      finishReason: 'stop',
    };
  }

  public async *stream(request: AIRequest): AsyncIterable<string> {
    if (this.shouldFail) {
      throw new Error('Mock AI Provider simulated stream failure.');
    }

    const response = await this.generate(request);
    const chunks = response.content.split(' ');

    for (const chunk of chunks) {
      if (this.latencyMs > 0) {
        await new Promise((r) => setTimeout(r, Math.min(20, this.latencyMs)));
      }
      yield chunk + ' ';
    }
  }

  public estimateTokens(messages: AIMessage[]): number {
    const totalChars = messages.reduce((acc, m) => acc + m.content.length, 0);
    return Math.ceil(totalChars / 4);
  }

  public async healthCheck(): Promise<AIProviderHealth> {
    return {
      healthy: !this.shouldFail,
      latencyMs: this.latencyMs,
      providerId: this.providerId,
      error: this.shouldFail ? 'Simulated failure' : undefined,
    };
  }
}

export const mockAIProvider = new MockAIProvider();
