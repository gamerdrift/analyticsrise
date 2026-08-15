/**
 * RevenueRiseAI — Structured Telemetry Event Definitions
 */

export type TelemetryEventType =
  | 'app_started'
  | 'page_view'
  | 'ai_session_started'
  | 'ai_request_started'
  | 'ai_request_completed'
  | 'ai_request_failed'
  | 'feature_access_denied'
  | 'quota_exhausted'
  | 'simulator_started'
  | 'simulation_order_placed'
  | 'assessment_started'
  | 'assessment_completed'
  | 'certificate_viewed';

export interface BaseTelemetryPayload {
  timestamp: string;
  eventType: TelemetryEventType;
  userIdMasked?: string;
  sessionId?: string;
}

export interface AIRequestTelemetryPayload extends BaseTelemetryPayload {
  eventType: 'ai_request_started' | 'ai_request_completed' | 'ai_request_failed';
  provider: string;
  model: string;
  promptTokensEstimate?: number;
  completionTokens?: number;
  durationMs?: number;
  errorCode?: string;
}

export interface FeatureAccessTelemetryPayload extends BaseTelemetryPayload {
  eventType: 'feature_access_denied' | 'quota_exhausted';
  featureKey: string;
  requiredPlan: string;
  currentPlan: string;
}
