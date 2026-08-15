import { MockAIProvider } from '@/lib/ai/providers/MockAIProvider';

describe('RevenueRiseAI — AI Provider & Mock Engine', () => {
  it('should generate deterministic completions with usage metrics', async () => {
    const provider = new MockAIProvider();
    provider.setLatency(0);

    const response = await provider.generate({
      messages: [{ role: 'user', content: 'Explain SQL Window Functions' }],
      pedagogicalMode: 'socratic',
    });

    expect(response.content).toBeDefined();
    expect(response.usage.promptTokens).toBeGreaterThan(0);
    expect(response.usage.completionTokens).toBeGreaterThan(0);
    expect(response.usage.estimatedCostUsd).toBeGreaterThanOrEqual(0);
    expect(response.modelUsed).toBe('mock-intelligence-v1');
  });

  it('should stream response chunks via AsyncIterable', async () => {
    const provider = new MockAIProvider();
    provider.setLatency(0);

    const stream = provider.stream({
      messages: [{ role: 'user', content: 'Hello AI' }],
    });

    const chunks: string[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBeGreaterThan(0);
    const combined = chunks.join('');
    expect(combined).toContain('RevenueRiseAI');
  });

  it('should report healthy status and handle simulated errors', async () => {
    const provider = new MockAIProvider();
    provider.setLatency(0);

    const health1 = await provider.healthCheck();
    expect(health1.healthy).toBe(true);

    provider.setFail(true);
    const health2 = await provider.healthCheck();
    expect(health2.healthy).toBe(false);

    await expect(
      provider.generate({ messages: [{ role: 'user', content: 'Test' }] })
    ).rejects.toThrow('Mock AI Provider simulated upstream failure.');
  });
});
