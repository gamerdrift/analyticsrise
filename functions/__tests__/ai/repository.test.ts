import { AIConversationRepository } from '../../src/ai/repository';

describe('Server-Side AI Conversation Repository & Ownership Enforcement', () => {
  let mockConversationStore: Map<string, any>;
  let mockMessageStore: Map<string, any>;
  let mockDb: any;

  beforeEach(() => {
    mockConversationStore = new Map();
    mockMessageStore = new Map();

    mockDb = {
      collection: jest.fn().mockImplementation((colName: string) => ({
        doc: jest.fn().mockImplementation((docId: string) => ({
          _id: docId,
          _col: colName,
          get: jest.fn().mockImplementation(async () => ({
            exists: mockConversationStore.has(docId),
            data: () => mockConversationStore.get(docId),
          })),
          set: jest.fn().mockImplementation(async (data: any) => {
            mockConversationStore.set(docId, { ...data });
          }),
          collection: jest.fn().mockImplementation((subColName: string) => ({
            doc: jest.fn().mockImplementation((subDocId: string) => ({
              _id: subDocId,
              _subCol: subColName,
            })),
          })),
        })),
      })),
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

  it('should initialize a new conversation with ownership', async () => {
    const conv = await AIConversationRepository.getOrCreateConversation(
      'usr_owner_1',
      undefined,
      'socratic',
      mockDb
    );

    expect(conv.conversationId).toBeDefined();
    expect(conv.userId).toBe('usr_owner_1');
    expect(conv.pedagogicalMode).toBe('socratic');
  });

  it('should reject access to a conversation owned by another user', async () => {
    const existingConvId = 'conv_alice_123';
    mockConversationStore.set(existingConvId, {
      conversationId: existingConvId,
      userId: 'usr_alice',
      title: "Alice's SQL Optimization",
      pedagogicalMode: 'socratic',
      messageCount: 2,
    });

    // Bob tries to access Alice's conversation
    await expect(
      AIConversationRepository.getOrCreateConversation('usr_bob_attacker', existingConvId, 'socratic', mockDb)
    ).rejects.toThrow(/You do not have permission to access/);
  });

  it('should persist user query and assistant response in batch', async () => {
    const convId = 'conv_valid_456';
    mockConversationStore.set(convId, {
      conversationId: convId,
      userId: 'usr_user_1',
      title: 'Initial Session',
      messageCount: 0,
    });

    const result = await AIConversationRepository.persistExchange(
      convId,
      'usr_user_1',
      'How do I index a table in PostgreSQL?',
      'Use CREATE INDEX idx_users_email ON users(email);',
      'mock-intelligence-v1',
      { promptTokens: 10, completionTokens: 15, totalTokens: 25, estimatedCostUsd: 0.000045 },
      mockDb
    );

    expect(result.userMessageId).toBeDefined();
    expect(result.assistantMessageId).toBeDefined();
    expect(mockMessageStore.has(result.userMessageId)).toBe(true);
    expect(mockMessageStore.has(result.assistantMessageId)).toBe(true);
  });
});
