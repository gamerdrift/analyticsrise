/**
 * RevenueRiseAI — Client-Side AI Mentor Proxy
 * Calls the trusted Firebase Cloud Functions v2 endpoint (aiMentorQuery)
 * with deterministic mock fallback for offline sandbox and testing.
 */

import { httpsCallable } from 'firebase/functions';
import { functions, auth } from '@/lib/firebase/config';
import { SendMentorMessageParams, SendMentorMessageResult } from './types';
import { mockAIProvider } from '../providers/MockAIProvider';
import { AIContextBuilder } from '../AIContextBuilder';
import { logger } from '@/lib/observability';

export class AIMentorClient {
  private useMockFallback = false;

  public setUseMockFallback(useMock: boolean) {
    this.useMockFallback = useMock;
  }

  /**
   * Sends user query to the trusted backend AI execution pipeline
   */
  public async sendMessage(params: SendMentorMessageParams): Promise<SendMentorMessageResult> {
    if (this.useMockFallback || typeof window === 'undefined' || !auth.currentUser) {
      return this.executeMockFallback(params);
    }

    try {
      const callable = httpsCallable<SendMentorMessageParams, SendMentorMessageResult>(
        functions,
        'aiMentorQuery'
      );

      const result = await callable(params);
      return result.data;
    } catch (err: any) {
      logger.warn('Backend aiMentorQuery callable failed, falling back to client mock:', {
        error: err?.message,
      });

      // Graceful fallback for local development without live functions emulator
      return this.executeMockFallback(params);
    }
  }

  private async executeMockFallback(params: SendMentorMessageParams): Promise<SendMentorMessageResult> {
    const promptMessages = AIContextBuilder.assemblePromptMessages(
      params.query,
      params.context as any,
      params.pedagogicalMode || 'socratic'
    );

    const mockResult = await mockAIProvider.generate({
      messages: promptMessages,
      pedagogicalMode: params.pedagogicalMode,
    });

    const convId = params.conversationId || `conv_client_${Date.now()}`;
    const messageId = `msg_client_${Date.now()}`;

    return {
      conversationId: convId,
      messageId,
      content: mockResult.content,
      codeSnippet: mockResult.codeSnippet,
      suggestedFollowUps: mockResult.suggestedFollowUps || [
        'How do I benchmark query latency?',
        'Can you show me the execution plan analysis?',
        'What are the memory trade-offs?',
      ],
      suggestedActionRoutes: mockResult.suggestedActionRoutes || ['/analytics', '/learning'],
      usage: mockResult.usage,
      modelUsed: mockResult.modelUsed,
      providerUsed: mockResult.providerUsed,
      timestamp: new Date().toISOString(),
    };
  }
}

export const aiMentorClient = new AIMentorClient();
