import { AIProviderManager } from '@/lib/ai/aiProviderManager';
import { MockAIProvider } from '@/lib/ai/providers/MockAIProvider';
import { AIProviderError } from '@/lib/errors';

describe('RevenueRiseAI — AI Provider Manager & Circuit Breaker', () => {
  it('should register providers and list available configurations', () => {
    const manager = new AIProviderManager();
    const providers = manager.getAvailableProviders();

    expect(providers.length).toBeGreaterThan(0);
    expect(providers[0].providerId).toBe('mock_provider');
  });

  it('should fallback to secondary provider when primary provider fails', async () => {
    const manager = new AIProviderManager(false);

    const failingPrimary = new MockAIProvider();
    failingPrimary.setFail(true);
    // Custom ID for primary
    Object.defineProperty(failingPrimary, 'providerId', { value: 'primary_failing_provider' });

    const healthySecondary = new MockAIProvider();
    healthySecondary.setFail(false);
    Object.defineProperty(healthySecondary, 'providerId', { value: 'secondary_backup_provider' });

    manager.registerProvider(failingPrimary);
    manager.registerProvider(healthySecondary);

    manager.setActiveProvider('primary_failing_provider');

    // Should automatically fall back to secondary without throwing
    const response = await manager.generateWithFallback({
      messages: [{ role: 'user', content: 'Test fallback' }],
    });

    expect(response.content).toBeDefined();
    expect(response.providerUsed).toBe('secondary_backup_provider');
  });

  it('should throw AIProviderError when all available providers fail', async () => {
    const manager = new AIProviderManager(false);

    const failing1 = new MockAIProvider();
    failing1.setFail(true);
    Object.defineProperty(failing1, 'providerId', { value: 'fail_1' });

    const failing2 = new MockAIProvider();
    failing2.setFail(true);
    Object.defineProperty(failing2, 'providerId', { value: 'fail_2' });

    manager.registerProvider(failing1);
    manager.registerProvider(failing2);
    manager.setActiveProvider('fail_1');

    await expect(
      manager.generateWithFallback({
        messages: [{ role: 'user', content: 'Test failure' }],
      })
    ).rejects.toThrow(AIProviderError);
  });
});
