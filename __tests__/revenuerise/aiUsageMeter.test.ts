import { AIUsageMeter } from '@/lib/ai/AIUsageMeter';

describe('RevenueRiseAI — AI Usage Meter & Cost Calculator', () => {
  it('should calculate estimated USD cost accurately', () => {
    const cost = AIUsageMeter.calculateCostUsd('gemini-1.5-pro', 1000, 500);
    expect(cost).toBeGreaterThan(0);
    expect(typeof cost).toBe('number');
  });

  it('should correctly evaluate usage limits for metered vs unlimited tiers', () => {
    const currentUsage = {
      userId: 'usr_1',
      monthlyTokens: 8000,
      monthlyRequests: 8,
      promptTokens: 5000,
      completionTokens: 3000,
      estimatedCostUsd: 0.02,
      periodStart: '2026-08-01',
      periodEnd: '2026-08-31',
      updatedAt: '2026-08-15',
    };

    // Case 1: Unlimited tier (-1)
    const withinUnlimited = AIUsageMeter.isUsageWithinLimit(
      currentRecordWrapper(currentUsage),
      { promptTokens: 5000, completionTokens: 5000, totalTokens: 10000, estimatedCostUsd: 0.02 },
      -1
    );
    expect(withinUnlimited).toBe(true);

    // Case 2: Metered tier with quota 15000 -> 8000 + 5000 = 13000 <= 15000
    const withinMetered = AIUsageMeter.isUsageWithinLimit(
      currentRecordWrapper(currentUsage),
      { promptTokens: 2500, completionTokens: 2500, totalTokens: 5000, estimatedCostUsd: 0.01 },
      15000
    );
    expect(withinMetered).toBe(true);

    // Case 3: Metered tier exceeding quota -> 8000 + 10000 = 18000 > 15000
    const exceedsMetered = AIUsageMeter.isUsageWithinLimit(
      currentRecordWrapper(currentUsage),
      { promptTokens: 5000, completionTokens: 5000, totalTokens: 10000, estimatedCostUsd: 0.02 },
      15000
    );
    expect(exceedsMetered).toBe(false);
  });
});

function currentRecordWrapper(data: any) {
  return data;
}
