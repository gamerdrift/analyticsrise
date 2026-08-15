import { sanitizeLogValue, maskUserId, Logger } from '@/lib/observability/logger';
import { TelemetryService } from '@/lib/observability/telemetry';

describe('RevenueRiseAI — Observability & Telemetry Subsystem', () => {
  it('should sanitize sensitive secrets and credentials from log context', () => {
    const rawContext = {
      apiKey: 'AIzaSyA1234567890123456789012345678901',
      razorpaySecret: 'rzp_live_secret123456',
      userEmail: 'sensitive.analyst@example.com',
      normalField: 'SQL Studio Run',
    };

    const sanitized = sanitizeLogValue(rawContext);
    expect(sanitized.apiKey).toBe('[REDACTED_FIELD]');
    expect(sanitized.razorpaySecret).toBe('[REDACTED_FIELD]');
    expect(sanitized.userEmail).toBe('[REDACTED]');
    expect(sanitized.normalField).toBe('SQL Studio Run');
  });

  it('should mask user IDs correctly for telemetry', () => {
    expect(maskUserId('user_abcdef123456')).toBe('usr_***3456');
    expect(maskUserId(null)).toBe('anonymous');
    expect(maskUserId('abc')).toBe('usr_***');
  });

  it('should queue and flush telemetry events', async () => {
    const telemetry = new TelemetryService();
    telemetry.track('page_view', { path: '/dashboard' }, 'user_123456');
    await telemetry.flush();
    // Flush should succeed without throwing
  });
});
