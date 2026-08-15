/**
 * RevenueRiseAI — Client-Side AI Mentor Types
 */

import { PedagogicalMode, AICapability, AITokenUsage } from '../types';

export interface ClientAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeSnippet?: string;
  timestamp: string;
  status: 'pending' | 'streaming' | 'completed' | 'failed';
  suggestedFollowUps?: string[];
  suggestedActionRoutes?: string[];
}

export interface ClientAIConversation {
  id: string;
  title: string;
  pedagogicalMode: PedagogicalMode;
  lastMessageAt: string;
  messageCount: number;
}

export interface SendMentorMessageParams {
  conversationId?: string;
  query: string;
  pedagogicalMode?: PedagogicalMode;
  capability?: AICapability;
  context?: {
    courseId?: string;
    lessonId?: string;
    simulatorType?: 'sql' | 'excel' | 'python' | 'market_sim';
    activeCodeSnippet?: string;
    activeErrorMessage?: string;
    userSkillLevel?: string;
  };
}

export interface SendMentorMessageResult {
  conversationId: string;
  messageId: string;
  content: string;
  codeSnippet?: string;
  suggestedFollowUps: string[];
  suggestedActionRoutes: string[];
  usage: AITokenUsage;
  modelUsed: string;
  providerUsed: string;
  timestamp: string;
}
