import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  QuotaExceededError,
  AIProviderError,
  IntegrationError,
  ConfigurationError,
} from '@/lib/errors';

describe('RevenueRiseAI — Application Error Classes', () => {
  it('should maintain proper inheritance, error codes, and HTTP statuses', () => {
    const authErr = new AuthenticationError();
    expect(authErr).toBeInstanceOf(AppError);
    expect(authErr.statusCode).toBe(401);
    expect(authErr.code).toBe('UNAUTHENTICATED');

    const authzErr = new AuthorizationError();
    expect(authzErr.statusCode).toBe(403);
    expect(authzErr.code).toBe('UNAUTHORIZED_FEATURE_ACCESS');

    const quotaErr = new QuotaExceededError();
    expect(quotaErr.statusCode).toBe(429);
    expect(quotaErr.code).toBe('QUOTA_EXCEEDED');

    const aiErr = new AIProviderError();
    expect(aiErr.statusCode).toBe(502);
    expect(aiErr.code).toBe('AI_PROVIDER_ERROR');

    const intErr = new IntegrationError();
    expect(intErr.statusCode).toBe(500);

    const cfgErr = new ConfigurationError();
    expect(cfgErr.statusCode).toBe(500);
  });

  it('should serialize to JSON with user-safe message', () => {
    const err = new AppError('Internal database timeout', {
      code: 'DB_TIMEOUT',
      userMessage: 'The database took too long to respond.',
      statusCode: 504,
    });

    const json = err.toJSON();
    expect(json.code).toBe('DB_TIMEOUT');
    expect(json.userMessage).toBe('The database took too long to respond.');
    expect(json.statusCode).toBe(504);
  });
});
