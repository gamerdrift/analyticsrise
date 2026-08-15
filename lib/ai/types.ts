/**
 * RevenueRiseAI — Core AI Types & Specifications
 */

export type PedagogicalMode = 'socratic' | 'direct' | 'code_review' | 'interview_coach';

export type AICapability =
  | 'ai_mentor'
  | 'ai_reasoning'
  | 'ai_career'
  | 'ai_analytics'
  | 'ai_market_education';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface AIContext {
  userId?: string;
  courseId?: string;
  lessonId?: string;
  simulatorType?: 'sql' | 'excel' | 'python' | 'market_sim';
  activeCodeSnippet?: string;
  activeErrorMessage?: string;
  userSkillLevel?: string;
  targetGoal?: string;
}

export interface AIRequest {
  messages: AIMessage[];
  context?: AIContext;
  pedagogicalMode?: PedagogicalMode;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AITokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AIResponse {
  id: string;
  content: string;
  codeSnippet?: string;
  suggestedFollowUps?: string[];
  suggestedActionRoutes?: string[];
  usage: AITokenUsage;
  modelUsed: string;
  providerUsed: string;
  finishReason: string;
}

export interface AIProviderConfig {
  providerId: string;
  displayName: string;
  defaultModel: string;
  isAvailable: boolean;
  priority: number;
}

export interface AuthoritativeAIUsageRecord {
  userId: string;
  monthlyTokens: number;
  monthlyRequests: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCostUsd: number;
  periodStart: string;
  periodEnd: string;
  updatedAt: string;
}
