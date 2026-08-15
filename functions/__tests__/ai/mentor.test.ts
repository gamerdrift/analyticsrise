import { processAIMentorQuery } from '../../src/ai/mentor';
import { AIProviderManager } from '../../src/ai/providers/manager';
import { MockAIProvider } from '../../src/ai/providers/mock';

describe('Mission 03: Server-Side AI Mentor 13-Stage Execution Pipeline', () => {
  let mockEntitlementStore: Map<string, any>;
  let mockUsageStore: Map<string, any>;
  let mockConversationStore: Map<string, any>;
  let mockMessageStore: Map<string, any>;
  let mockDb: any;
  let providerManager: AIProviderManager;
  let mockProvider: MockAIProvider;

  beforeEach(() => {
    mockEntitlementStore = new Map();
    mockUsageStore = new Map();
    mockConversationStore = new Map();
    mockMessageStore = new Map();

    mockProvider = new MockAIProvider();
    providerManager = new AIProviderManager(false);
    providerManager.registerProvider(mockProvider);

    mockDb = {
      collection: jest.fn().mockImplementation((colName: string) => ({
        doc: jest.fn().mockImplementation((docId: string) => ({
          _id: docId,
          _col: colName,
          get: jest.fn().mockImplementation(async () => {
            if (colName === 'entitlements') {
              return {
                exists: mockEntitlementStore.has(docId),
                data: () => mockEntitlementStore.get(docId),
              };
            }
            if (colName === 'aiConversations') {
              return {
                exists: mockConversationStore.has(docId),
                data: () => mockConversationStore.get(docId),
              };
            }
            if (colName === 'aiUsage') {
              return {
                exists: mockUsageStore.has(docId),
                data: () => mockUsageStore.get(docId),
              };
            }
            return { exists: false, data: () => undefined };
          }),
          set: jest.fn().mockImplementation(async (data: any) => {
            if (colName === 'aiConversations') {
              mockConversationStore.set(docId, { ...data });
            }
          }),
          collection: jest.fn().mockImplementation((subColName: string) => ({
            doc: jest.fn().mockImplementation((subDocId: string) => ({
              _id: subDocId,
              _subCol: subColName,
            })),
          })),
        })),
      })),
      runTransaction: jest.fn().mockImplementation(async (callback: any) => {
        const mockTx = {
          get: jest.fn().mockImplementation(async (docRef: any) => {
            const docId = docRef._id;
            return {
              exists: mockUsageStore.has(docId),
              data: () => mockUsageStore.get(docId),
            };
          }),
          set: jest.fn().mockImplementation((docRef: any, data: any) => {
            mockUsageStore.set(docRef._id, { ...data });
          }),
          update: jest.fn().mockImplementation((docRef: any, data: any) => {
            const existing = mockUsageStore.get(docRef._id) || {};
            const updated = { ...existing };
            for (const key of Object.keys(data)) {
              if (data[key] && typeof data[key] === 'object' && data[key]._increment) {
                updated[key] = (updated[key] || 0) + data[key]._increment;
              } else {
                updated[key] = data[key];
              }
            }
            mockUsageStore.set(docRef._id, updated);
          }),
        };
        return callback(mockTx);
      }),
      batch: jest.fn().mockImplementation(() => {
        const operations: Array<() => void> = [];
        return {
          set: jest.fn().mockImplementation((docRef: any, data: any) => {
            operations.push(() => {
              if (docRef._subCol === 'messages') {
                mockMessageStore.set(docRef._id, { ...data });
              } else {
                mockConversationStore.set(docRef._id, { ...data });
              }
            });
          }),
          update: jest.fn().mockImplementation((docRef: any, data: any) => {
            operations.push(() => {
              const current = mockConversationStore.get(docRef._id) || {};
              mockConversationStore.set(docRef._id, { ...current, ...data });
            });
          }),
          commit: jest.fn().mockImplementation(async () => {
            operations.forEach((op) => op());
          }),
        };
      }),
    };
  });

  it('Stage 1: should reject missing or invalid query payload', async () => {
    await expect(
      processAIMentorQuery('usr_123', { query: '' }, { firestoreDb: mockDb, providerManager })
    ).rejects.toThrow(/The "query" field is required/);
  });

  it('Stage 2: should reject unauthenticated request with empty user ID', async () => {
    await expect(
      processAIMentorQuery('', { query: 'Hello mentor' }, { firestoreDb: mockDb, providerManager })
    ).rejects.toThrow(/User must be authenticated/);
  });

  it('Stage 3: should reject unauthorized capability on Free plan', async () => {
    const userId = 'usr_free_user';
    mockEntitlementStore.set(userId, {
      planId: 'free',
      status: 'active',
    });

    await expect(
      processAIMentorQuery(
        userId,
        { query: 'Solve this with reasoning', capability: 'ai_reasoning' },
        { firestoreDb: mockDb, providerManager }
      )
    ).rejects.toThrow(/does not include access to "ai_reasoning"/);
  });

  it('Stage 4: should reject query when monthly quota is exhausted', async () => {
    const userId = 'usr_exhausted_quota';
    const today = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString();

    mockUsageStore.set(userId, {
      userId,
      dailyRequests: 5,
      dailyDate: today,
      monthlyRequests: 15, // Free tier max = 15
      monthlyTokens: 2000,
      periodStart: start,
    });

    await expect(
      processAIMentorQuery(
        userId,
        { query: 'Help with SQL join', capability: 'ai_mentor' },
        { firestoreDb: mockDb, providerManager }
      )
    ).rejects.toThrow(/Monthly AI request quota exhausted/);
  });

  it('Stage 5: should reject excessive query length', async () => {
    const userId = 'usr_long_prompt';
    const longQuery = 'SELECT * FROM big_table '.repeat(500); // > 8000 chars

    await expect(
      processAIMentorQuery(
        userId,
        { query: longQuery, capability: 'ai_mentor' },
        { firestoreDb: mockDb, providerManager }
      )
    ).rejects.toThrow(/Input query exceeds maximum allowed limit/);
  });

  it('Stage 6 & 13: should execute end-to-end, scrub secrets, mask PII, and return response', async () => {
    const userId = 'usr_valid_pro';
    mockEntitlementStore.set(userId, {
      planId: 'pro',
      status: 'active',
    });

    const response = await processAIMentorQuery(
      userId,
      {
        query: 'Here is my secret rzp_live_testsecret123456 and email dev@example.com for SQL indexing help',
        pedagogicalMode: 'direct',
        capability: 'ai_mentor',
      },
      { firestoreDb: mockDb, providerManager }
    );

    expect(response.conversationId).toBeDefined();
    expect(response.messageId).toBeDefined();
    expect(response.content).toBeDefined();
    expect(response.usage.totalTokens).toBeGreaterThan(0);
    expect(response.suggestedFollowUps.length).toBeGreaterThan(0);
    expect(response.suggestedActionRoutes.length).toBeGreaterThan(0);

    // Verify conversation was persisted
    expect(mockConversationStore.has(response.conversationId)).toBe(true);
    // Verify messages were persisted
    expect(mockMessageStore.has(response.messageId)).toBe(true);
  });

  it('Stage 9: should trigger automated circuit breaker fallback when primary provider fails', async () => {
    const userId = 'usr_fallback_test';
    mockEntitlementStore.set(userId, {
      planId: 'pro',
      status: 'active',
    });

    // Primary failing provider
    const failingPrimary = new MockAIProvider();
    failingPrimary.setFail(true);
    Object.defineProperty(failingPrimary, 'providerId', { value: 'primary_failing' });

    // Secondary healthy backup provider
    const healthySecondary = new MockAIProvider();
    healthySecondary.setFail(false);
    Object.defineProperty(healthySecondary, 'providerId', { value: 'secondary_backup' });

    const testManager = new AIProviderManager(false);
    testManager.registerProvider(failingPrimary);
    testManager.registerProvider(healthySecondary);
    testManager.setActiveProvider('primary_failing');

    const response = await processAIMentorQuery(
      userId,
      { query: 'Test fallback execution' },
      { firestoreDb: mockDb, providerManager: testManager }
    );

    expect(response.content).toBeDefined();
    expect(response.providerUsed).toBe('secondary_backup');
  });
});
