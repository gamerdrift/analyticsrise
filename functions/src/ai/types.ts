/**
 * RevenueRiseAI — Server-Side AI Domain Types & Contracts
 * Authoritative type definitions for Cloud Functions v2 AI execution boundary.
 */

export type AIMessageRole = 'system' | 'user' | 'assistant' | 'tool';

export type AIMessageStatus = 'pending' | 'streaming' | 'completed' | 'failed' | 'cancelled';

export type PedagogicalMode = 'socratic' | 'direct' | 'code_review' | 'interview_coach';

export type AICapability =
  | 'ai_mentor'
  | 'ai_reasoning'
  | 'ai_career'
  | 'ai_analytics'
  | 'ai_market_education';

export interface AIMessage {
  messageId: string;
  conversationId: string;
  userId: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
  status: AIMessageStatus;
  tokens?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  modelUsed?: string;
}

export interface AIConversation {
  conversationId: string;
  userId: string;
  title: string;
  pedagogicalMode: PedagogicalMode;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessageAt: string;
  metadata?: Record<string, unknown>;
}

export interface AIContextInput {
  courseId?: string;
  lessonId?: string;
  simulatorType?: 'sql' | 'excel' | 'python' | 'market_sim';
  activeCodeSnippet?: string;
  activeErrorMessage?: string;
  userSkillLevel?: string;
  targetGoal?: string;
}

export interface AIMentorQueryData {
  conversationId?: string;
  query: string;
  pedagogicalMode?: PedagogicalMode;
  capability?: AICapability;
  context?: AIContextInput;
}

export interface AITokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AIMentorQueryResponse {
  conversationId: string;
  messageId: string;
  content: string;
  codeSnippet?: string;
  suggestedFollowUps: string[];
  suggestedActionRoutes: string[];
  usage: AITokenUsage;
  modelUsed: string;
  providerUsed: string;
  finishReason: string;
  timestamp: string;
}

export interface AIModelPolicy {
  capability: AICapability;
  planTier: string;
  model: string;
  maxTokens: number;
  contextBudgetChars: number;
  temperature: number;
  timeoutMs: number;
}

export interface AIUsageRecord {
  userId: string;
  dailyRequests: number;
  dailyDate: string;
  monthlyTokens: number;
  monthlyRequests: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  periodStart: string;
  periodEnd: string;
  updatedAt: string;
}

export interface AIExecutionMetadata {
  requestId: string;
  userId: string;
  capability: AICapability;
  providerUsed: string;
  modelUsed: string;
  latencyMs: number;
  usage: AITokenUsage;
  timestamp: string;
}
