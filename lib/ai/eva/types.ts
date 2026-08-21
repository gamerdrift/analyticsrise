/**
 * AnalyticsRise — AI-EVA Core Types & Contracts
 * Universal AI learning assistant and Workspace Intelligence domain model.
 */

import { ExcelWorkspaceContextData, AiEvaWorkspaceType, AiEvaPrivacyLevel } from './context/types';

export type AiEvaRole = 'user' | 'assistant' | 'system';

export interface AiEvaMessage {
  id: string;
  role: AiEvaRole;
  content: string;
  timestamp: string;
  codeSnippet?: string;
  suggestedPrompts?: string[];
  contextBadge?: string;
  isStreaming?: boolean;
}

export type AnalyticsRiseProduct =
  | 'sql-studio'
  | 'sql-workspace'
  | 'excel-studio'
  | 'excel-workspace'
  | 'powerbi-studio'
  | 'ar-academy'
  | 'general';

export interface AiEvaContext {
  product: AnalyticsRiseProduct;
  workspaceType?: AiEvaWorkspaceType;
  privacyLevel?: AiEvaPrivacyLevel;
  learnerLevel?: 'beginner' | 'intermediate' | 'advanced';
  
  // SQL Specific Context
  challengeId?: string;
  challengeTitle?: string;
  currentQuery?: string;
  sqlError?: string;
  activeSchema?: string;
  activeTable?: string;
  activeColumns?: string[];

  // Excel Specific Workspace Intelligence Context (Mission 09)
  excelContext?: ExcelWorkspaceContextData;

  // General Key-Value Extensible Context
  additionalContext?: Record<string, string | number | boolean>;
}

export interface AiEvaRequest {
  messages: AiEvaMessage[];
  context?: AiEvaContext;
  userQuestion: string;
  conversationId?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiEvaUsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
}

export interface AiEvaResponse {
  id: string;
  content: string;
  codeSnippet?: string;
  suggestedPrompts?: string[];
  usage?: AiEvaUsageMetrics;
  modelUsed: string;
  providerUsed: string;
  finishReason: string;
  timestamp: string;
}

export interface AiEvaQuotaState {
  dailyQueriesUsed: number;
  dailyQuotaLimit: number;
  queriesRemaining: number;
  tier: 'free' | 'pro' | 'enterprise';
  isServerAuthoritative: boolean;
  resetsAt: string;
}

export interface AiEvaSecurityValidation {
  isSafe: boolean;
  sanitizedContext?: AiEvaContext;
  violationReason?: string;
}

export interface SuggestedPromptItem {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
  category?: 'explain' | 'fix' | 'hint' | 'concept' | 'next';
}

export * from './context/types';
