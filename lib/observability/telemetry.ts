'use client';

import { TelemetryEventType } from './events';
import { sanitizeLogValue, maskUserId } from './logger';

export class TelemetryService {
  private queue: Array<{ event: TelemetryEventType; properties: Record<string, any>; timestamp: string }> = [];
  private isFlushing = false;

  public track(event: TelemetryEventType, properties: Record<string, any> = {}, userId?: string | null) {
    const timestamp = new Date().toISOString();
    const payload = {
      event,
      properties: sanitizeLogValue({
        ...properties,
        userIdMasked: maskUserId(userId),
      }),
      timestamp,
    };

    this.queue.push(payload);

    if (process.env.NODE_ENV === 'development') {
      // In development, log event
    }

    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  public async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) return;
    this.isFlushing = true;
    try {
      const itemsToFlush = [...this.queue];
      this.queue = [];
      // Telemetry batch dispatch endpoint abstraction (buffered in memory for Mission 02)
    } finally {
      this.isFlushing = false;
    }
  }
}

export const telemetry = new TelemetryService();
