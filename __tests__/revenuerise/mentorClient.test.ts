import { aiMentorClient } from '@/lib/ai/mentor/mentorClient';

describe('RevenueRiseAI — Client-Side AI Mentor Proxy', () => {
  beforeEach(() => {
    aiMentorClient.setUseMockFallback(true);
  });

  it('should execute message query with mock fallback successfully', async () => {
    const result = await aiMentorClient.sendMessage({
      query: 'How do I optimize a SQL query with indexes?',
      pedagogicalMode: 'socratic',
      capability: 'ai_mentor',
    });

    expect(result.conversationId).toBeDefined();
    expect(result.messageId).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.usage.totalTokens).toBeGreaterThan(0);
    expect(result.suggestedFollowUps.length).toBeGreaterThan(0);
    expect(result.suggestedActionRoutes.length).toBeGreaterThan(0);
  });

  it('should include code snippet when requesting SQL or Python analysis', async () => {
    const result = await aiMentorClient.sendMessage({
      query: 'Show me an example of Python Pandas dataframe vectorized operation',
      pedagogicalMode: 'direct',
      capability: 'ai_analytics',
    });

    expect(result.codeSnippet).toBeDefined();
    expect(result.codeSnippet).toContain('pandas');
  });
});
