/**
 * AnalyticsRise — OpenAI Provider Adapter for AI-EVA (Server-Side Execution Only)
 * 
 * CRITICAL SECURITY INVARIANT:
 * This adapter uses `process.env.OPENAI_API_KEY` on the trusted server-side gateway.
 * It is never exposed to client bundles or browser localStorage.
 */

import { IAiEvaProvider } from './types';
import { AiEvaRequest, AiEvaResponse } from '../types';
import { buildSqlStudioSystemPrompt } from '../prompts/sqlStudio';
import { buildExcelWorkspaceSystemPrompt } from '../prompts/excelWorkspace';
import { AI_EVA_BASE_SYSTEM_PROMPT } from '../prompts/base';
import { postProcessAiResponse } from '../safety';
import { AI_EVA_LIMITS, trimConversationHistory } from '../limits';

export class OpenAiEvaProvider implements IAiEvaProvider {
  public readonly providerId = 'openai';
  public readonly defaultModel = 'gpt-4o-mini';

  private apiKey?: string;

  constructor(apiKey?: string) {
    // Only resolve from environment if running in Node.js server context
    this.apiKey = apiKey || (typeof process !== 'undefined' && process.env ? process.env.OPENAI_API_KEY : undefined);
  }

  public async generateResponse(request: AiEvaRequest): Promise<AiEvaResponse> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured on the secure server gateway.');
    }

    // Build system prompt based on active product context
    let systemPrompt = AI_EVA_BASE_SYSTEM_PROMPT;
    if (request.context?.product === 'sql-studio') {
      systemPrompt = buildSqlStudioSystemPrompt(request.context);
    } else if (request.context?.product === 'excel-workspace') {
      systemPrompt = buildExcelWorkspaceSystemPrompt(request.context.excelContext);
    }


    // Assemble messages payload
    const trimmedMessages = trimConversationHistory(
      request.messages,
      AI_EVA_LIMITS.MAX_CONVERSATION_HISTORY_TURNS
    );

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...trimmedMessages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: request.userQuestion },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.defaultModel,
        messages: apiMessages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? AI_EVA_LIMITS.MAX_RESPONSE_TOKENS,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const rawContent = choice?.message?.content || 'I could not generate a response. Please try again.';
    const sanitizedContent = postProcessAiResponse(rawContent);

    return {
      id: `eva_${data.id || Date.now()}`,
      content: sanitizedContent,
      modelUsed: data.model || this.defaultModel,
      providerUsed: this.providerId,
      finishReason: choice?.finish_reason || 'stop',
      timestamp: new Date().toISOString(),
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }
}
