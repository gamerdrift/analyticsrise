import { AIQuotaService } from '../../src/ai/quota';

describe('Server-Side AI Quota & Concurrency Enforcement', () => {
  let mockUsageStore: Map<string, any>;
  let mockDb: any;

  beforeEach(() => {
    mockUsageStore = new Map();

    mockDb = {
      collection: jest.fn().mockImplementation((colName: string) => ({
        doc: jest.fn().mockImplementation((docId: string) => ({
          _id: docId,
          _col: colName,
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
              if (data[key] && typeof data[key] === 'object' && data[key]._increment !== undefined) {
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
    };
  });

  it('should allow request when within free quota', async () => {
    const userId = 'usr_test_1';
    await expect(AIQuotaService.assertAndReserveQuota(userId, 'free', mockDb)).resolves.not.toThrow();
  });

  it('should block request when daily limit is exhausted', async () => {
    const userId = 'usr_daily_exhausted';
    const today = AIQuotaService.getTodayYMD();

    mockUsageStore.set(userId, {
      userId,
      dailyRequests: 10, // Max for free is 10
      dailyDate: today,
      monthlyRequests: 10,
      monthlyTokens: 5000,
    });

    await expect(AIQuotaService.assertAndReserveQuota(userId, 'free', mockDb)).rejects.toThrow(
      /Daily AI request quota reached/
    );
  });

  it('should block request when monthly limit is exhausted', async () => {
    const userId = 'usr_monthly_exhausted';
    const today = AIQuotaService.getTodayYMD();
    const { start: periodStart } = AIQuotaService.getCurrentMonthPeriod();

    mockUsageStore.set(userId, {
      userId,
      dailyRequests: 2,
      dailyDate: today,
      monthlyRequests: 15, // Max for free is 15
      monthlyTokens: 5000,
      periodStart,
    });

    await expect(AIQuotaService.assertAndReserveQuota(userId, 'free', mockDb)).rejects.toThrow(
      /Monthly AI request quota exhausted/
    );
  });

  it('should block request when monthly token limit is exhausted', async () => {
    const userId = 'usr_token_exhausted';
    const today = AIQuotaService.getTodayYMD();
    const { start: periodStart } = AIQuotaService.getCurrentMonthPeriod();

    mockUsageStore.set(userId, {
      userId,
      dailyRequests: 2,
      dailyDate: today,
      monthlyRequests: 5,
      monthlyTokens: 25000, // Max for free is 25000
      periodStart,
    });

    await expect(AIQuotaService.assertAndReserveQuota(userId, 'free', mockDb)).rejects.toThrow(
      /Monthly token budget exhausted/
    );
  });

  it('should allow pro user exceeding free thresholds', async () => {
    const userId = 'usr_pro_user';
    const today = AIQuotaService.getTodayYMD();
    const { start: periodStart } = AIQuotaService.getCurrentMonthPeriod();

    mockUsageStore.set(userId, {
      userId,
      dailyRequests: 25,
      dailyDate: today,
      monthlyRequests: 100,
      monthlyTokens: 200000,
      periodStart,
    });

    await expect(AIQuotaService.assertAndReserveQuota(userId, 'pro', mockDb)).resolves.not.toThrow();
  });

  it('should record usage atomically on initial execution', async () => {
    const userId = 'usr_first_call';
    await AIQuotaService.recordUsage(
      userId,
      {
        promptTokens: 120,
        completionTokens: 80,
        totalTokens: 200,
        estimatedCostUsd: 0.00034,
      },
      mockDb
    );

    const record = mockUsageStore.get(userId);
    expect(record).toBeDefined();
    expect(record.dailyRequests).toBe(1);
    expect(record.monthlyRequests).toBe(1);
    expect(record.monthlyTokens).toBe(200);
    expect(record.promptTokens).toBe(120);
    expect(record.completionTokens).toBe(80);
  });

  it('should increment existing usage atomically on subsequent executions', async () => {
    const userId = 'usr_subsequent_call';
    const today = AIQuotaService.getTodayYMD();
    const { start: periodStart, end: periodEnd } = AIQuotaService.getCurrentMonthPeriod();

    mockUsageStore.set(userId, {
      userId,
      dailyRequests: 2,
      dailyDate: today,
      monthlyRequests: 5,
      monthlyTokens: 1000,
      promptTokens: 600,
      completionTokens: 400,
      estimatedCostUsd: 0.0015,
      periodStart,
      periodEnd,
    });

    await AIQuotaService.recordUsage(
      userId,
      {
        promptTokens: 50,
        completionTokens: 50,
        totalTokens: 100,
        estimatedCostUsd: 0.0002,
      },
      mockDb
    );

    const record = mockUsageStore.get(userId);
    expect(record.dailyDate).toBe(today);
  });
});
