import { AnalyticsRiseAuthAdapter } from '@/lib/integrations/analyticsrise/authAdapter';
import { AuthenticationError } from '@/lib/errors';

describe('RevenueRiseAI — Auth Adapter', () => {
  it('should return null when no user is authenticated', async () => {
    const adapter = new AnalyticsRiseAuthAdapter(null);
    const user = await adapter.getCurrentUser();
    expect(user).toBeNull();

    const session = await adapter.getSession();
    expect(session.isAuthenticated).toBe(false);
    expect(session.user).toBeNull();
  });

  it('should resolve session when authenticated user is present', async () => {
    const mockUser = {
      uid: 'user_12345',
      email: 'alex@analyticsrise.com',
      displayName: 'Alex Rivera',
      photoURL: null,
      emailVerified: true,
    };
    const adapter = new AnalyticsRiseAuthAdapter(mockUser);

    const user = await adapter.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.uid).toBe('user_12345');
    expect(user?.email).toBe('alex@analyticsrise.com');

    const session = await adapter.getSession();
    expect(session.isAuthenticated).toBe(true);
    expect(session.user?.displayName).toBe('Alex Rivera');
  });

  it('should throw AuthenticationError when requireAuth() is called without user', async () => {
    const adapter = new AnalyticsRiseAuthAdapter(null);
    await expect(adapter.requireAuth()).rejects.toThrow(AuthenticationError);
  });

  it('should return user when requireAuth() is called with authenticated user', async () => {
    const mockUser = {
      uid: 'user_999',
      email: 'pro@analyticsrise.com',
      displayName: 'Pro User',
      photoURL: null,
      emailVerified: true,
    };
    const adapter = new AnalyticsRiseAuthAdapter(mockUser);
    const user = await adapter.requireAuth();
    expect(user.uid).toBe('user_999');
  });
});
