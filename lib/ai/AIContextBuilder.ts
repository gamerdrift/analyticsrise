/**
 * RevenueRiseAI — AI Context Builder
 * Assembles minimal necessary workspace context while strictly filtering out
 * credentials, payment IDs, and private user details.
 */

import { AIMessage, AIContext, PedagogicalMode } from './types';
import { AISecurityFirewall } from './AISecurityFirewall';

export class AIContextBuilder {
  public static buildSystemPrompt(mode: PedagogicalMode = 'direct'): string {
    const baseDirectives = [
      'You are the RevenueRiseAI Mentor — an authoritative, pedagogical intelligence operating system.',
      'Your goal is to help the user master data engineering, relational SQL, Python Pandas, business intelligence, and market mechanics.',
      'Strictly avoid giving away raw capstone exam solutions; guide the user with constructive hints and logical explanations.',
      'Always format code snippets clearly using fenced markdown blocks with syntax highlighting.',
    ];

    const modeDirectives = {
      socratic:
        'PEDAGOGICAL MODE: SOCRATIC QUESTIONING. Do not provide the direct answer immediately. Ask a targeted guiding question that reveals the next logical step.',
      direct:
        'PEDAGOGICAL MODE: DIRECT EXPLANATION. Provide clear, concise, step-by-step explanations with minimal fluff.',
      code_review:
        'PEDAGOGICAL MODE: CODE REVIEW. Critique the user code for algorithmic efficiency (time/space complexity), readability, edge case handling, and best practices.',
      interview_coach:
        'PEDAGOGICAL MODE: TECHNICAL INTERVIEW COACH. Assess candidate communication clarity, structured thinking (STAR method), and quantitative business impact.',
    };

    return [...baseDirectives, modeDirectives[mode]].join('\n');
  }

  public static assemblePromptMessages(
    userQuery: string,
    context?: AIContext,
    mode: PedagogicalMode = 'direct'
  ): AIMessage[] {
    const systemPrompt = this.buildSystemPrompt(mode);

    let contextSnippet = '';
    if (context) {
      const parts: string[] = [];
      if (context.simulatorType) parts.push(`Simulator: ${context.simulatorType.toUpperCase()}`);
      if (context.courseId) parts.push(`Course ID: ${context.courseId}`);
      if (context.userSkillLevel) parts.push(`User Level: ${context.userSkillLevel}`);
      if (context.activeCodeSnippet) {
        parts.push(`Active Workspace Code:\n\`\`\`\n${AISecurityFirewall.truncateContext(context.activeCodeSnippet, 4000)}\n\`\`\``);
      }
      if (context.activeErrorMessage) {
        parts.push(`Active Error Message: ${context.activeErrorMessage}`);
      }

      if (parts.length > 0) {
        contextSnippet = `\n--- ACTIVE WORKSPACE CONTEXT ---\n${parts.join('\n')}\n--------------------------------\n`;
      }
    }

    const rawUserMessage = `${contextSnippet}${userQuery}`.trim();
    const { sanitizedContent } = AISecurityFirewall.sanitizeText(rawUserMessage);

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: sanitizedContent },
    ];
  }
}
