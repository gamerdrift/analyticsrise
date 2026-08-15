/**
 * RevenueRiseAI — Server-Side AI Context Engine
 * Assembles minimal necessary workspace and pedagogical context within token budget limits.
 */

import { AIMessageRole, PedagogicalMode, AIContextInput } from './types';
import { AISecurityFirewall } from './security';

export interface ConstructedMessage {
  role: AIMessageRole;
  content: string;
}

export class AIContextEngine {
  public static buildSystemPrompt(mode: PedagogicalMode = 'socratic'): string {
    const baseDirectives = [
      'You are the RevenueRiseAI Mentor — an authoritative, pedagogical intelligence operating system for AnalyticsRise.',
      'Your mission is to guide users toward mastering relational data modeling, advanced SQL queries, Python data structures, ETL pipelines, and quantitative market mechanics.',
      'Maintain rigorous pedagogical boundaries: never provide direct exam answers without explaining foundational mechanics.',
      'Format code snippets cleanly in fenced markdown with language syntax specifiers.',
    ];

    const modeDirectives: Record<PedagogicalMode, string> = {
      socratic:
        'PEDAGOGICAL MODE: SOCRATIC GUIDANCE. Guide the user step-by-step using thought-provoking questions. Help them identify logical errors themselves.',
      direct:
        'PEDAGOGICAL MODE: DIRECT ARCHITECTURAL EXPLANATION. Provide concise, highly accurate, and practical explanations with immediate technical clarity.',
      code_review:
        'PEDAGOGICAL MODE: CODE & QUERY REVIEW. Critique algorithmic efficiency (time/space complexity), index utilization, execution plan cost, and edge cases.',
      interview_coach:
        'PEDAGOGICAL MODE: TECHNICAL INTERVIEW COACH. Frame feedback around candidate communication structure, the STAR method, and quantitative business metrics.',
    };

    return [...baseDirectives, modeDirectives[mode] || modeDirectives.socratic].join('\n\n');
  }

  public static assemblePromptMessages(
    userQuery: string,
    context?: AIContextInput,
    mode: PedagogicalMode = 'socratic',
    maxContextChars = 8000
  ): ConstructedMessage[] {
    const systemPrompt = this.buildSystemPrompt(mode);

    let contextSnippet = '';
    if (context) {
      const parts: string[] = [];
      if (context.simulatorType) parts.push(`Active Simulator: ${context.simulatorType.toUpperCase()}`);
      if (context.courseId) parts.push(`Course ID: ${context.courseId}`);
      if (context.lessonId) parts.push(`Lesson ID: ${context.lessonId}`);
      if (context.userSkillLevel) parts.push(`User Skill Level: ${context.userSkillLevel}`);
      if (context.activeCodeSnippet) {
        const truncatedCode = AISecurityFirewall.truncateContext(
          context.activeCodeSnippet,
          Math.floor(maxContextChars * 0.6)
        );
        parts.push(`Active Workspace Code:\n\`\`\`\n${truncatedCode}\n\`\`\``);
      }
      if (context.activeErrorMessage) {
        const truncatedError = AISecurityFirewall.truncateContext(
          context.activeErrorMessage,
          Math.floor(maxContextChars * 0.2)
        );
        parts.push(`Active Error Diagnostic:\n${truncatedError}`);
      }

      if (parts.length > 0) {
        contextSnippet = `\n--- AUTHORITATIVE WORKSPACE CONTEXT ---\n${parts.join('\n')}\n---------------------------------------\n\n`;
      }
    }

    const rawUserMessage = `${contextSnippet}${userQuery}`.trim();
    const { sanitizedContent } = AISecurityFirewall.sanitizeInput(rawUserMessage);

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: sanitizedContent },
    ];
  }
}
