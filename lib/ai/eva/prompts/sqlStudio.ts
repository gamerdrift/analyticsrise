/**
 * AnalyticsRise — AI-EVA SQL Studio Specialized Prompt
 */

import { AiEvaContext } from '../types';
import { AI_EVA_BASE_SYSTEM_PROMPT } from './base';

export function buildSqlStudioSystemPrompt(context?: AiEvaContext): string {
  let prompt = `${AI_EVA_BASE_SYSTEM_PROMPT}

ENVIRONMENT: SQL STUDIO
You are assisting a learner in the AnalyticsRise SQL Studio in-browser relational database practice environment.

SPECIALIZED SQL INSTRUCTIONS:
- Guide the learner on ANSI SQL, PostgreSQL, and SQLite standard queries.
- Help with SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, JOINs (INNER, LEFT, RIGHT, FULL), aggregate functions (COUNT, SUM, AVG, MIN, MAX), subqueries, CTEs (WITH), window functions, and table aliases.
- When an error occurs (e.g. syntax error, column not found, aggregation in WHERE), explain WHY the database threw the error and how SQL evaluation order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT) affects their query.
- When providing SQL examples, use clear formatting with uppercase keywords and lowercase table/column names.`;

  if (context) {
    prompt += `\n\nACTIVE CONTEXT:`;
    if (context.challengeTitle) {
      prompt += `\n- Current Mission / Challenge: "${context.challengeTitle}"`;
    }
    if (context.activeSchema) {
      prompt += `\n- Active Database Schema: ${context.activeSchema}`;
    }
    if (context.activeTable) {
      prompt += `\n- Active Table: ${context.activeTable}`;
    }
    if (context.activeColumns && context.activeColumns.length > 0) {
      prompt += `\n- Available Columns: ${context.activeColumns.join(', ')}`;
    }
    if (context.learnerLevel) {
      prompt += `\n- Learner Level: ${context.learnerLevel}`;
    }
    if (context.sqlError) {
      prompt += `\n- Recent SQL Error Encountered: "${context.sqlError}"`;
    }
    if (context.currentQuery) {
      prompt += `\n- Current Query in Editor:\n\`\`\`sql\n${context.currentQuery}\n\`\`\``;
    }
  }

  return prompt;
}
