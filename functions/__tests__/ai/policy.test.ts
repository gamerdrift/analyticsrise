import { AIModelPolicyResolver } from '../../src/ai/policy';

describe('Server-Side AI Model Policy Resolver', () => {
  it('should restrict capabilities on Free tier', () => {
    expect(AIModelPolicyResolver.isCapabilityAllowed('free', 'ai_mentor')).toBe(true);
    expect(AIModelPolicyResolver.isCapabilityAllowed('free', 'ai_analytics')).toBe(true);
    expect(AIModelPolicyResolver.isCapabilityAllowed('free', 'ai_reasoning')).toBe(false);
    expect(AIModelPolicyResolver.isCapabilityAllowed('free', 'ai_career')).toBe(false);
  });

  it('should allow all capabilities on Pro and Enterprise tiers', () => {
    expect(AIModelPolicyResolver.isCapabilityAllowed('pro', 'ai_reasoning')).toBe(true);
    expect(AIModelPolicyResolver.isCapabilityAllowed('pro', 'ai_career')).toBe(true);
    expect(AIModelPolicyResolver.isCapabilityAllowed('enterprise', 'ai_reasoning')).toBe(true);
  });

  it('should resolve token and context budgets according to plan tier', () => {
    const freePolicy = AIModelPolicyResolver.resolvePolicy('free', 'ai_mentor');
    expect(freePolicy.maxTokens).toBe(500);
    expect(freePolicy.contextBudgetChars).toBe(4000);

    const proPolicy = AIModelPolicyResolver.resolvePolicy('pro', 'ai_mentor');
    expect(proPolicy.maxTokens).toBe(2048);
    expect(proPolicy.contextBudgetChars).toBe(16000);

    const enterprisePolicy = AIModelPolicyResolver.resolvePolicy('enterprise', 'ai_mentor');
    expect(enterprisePolicy.maxTokens).toBe(4096);
    expect(enterprisePolicy.contextBudgetChars).toBe(32000);
  });
});
