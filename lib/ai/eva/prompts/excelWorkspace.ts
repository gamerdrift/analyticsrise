/**
 * AnalyticsRise — AI-EVA Excel Workspace Specialized Prompt
 */

import { ExcelWorkspaceContextData } from '../context/types';
import { AI_EVA_BASE_SYSTEM_PROMPT } from './base';

export function buildExcelWorkspaceSystemPrompt(context?: ExcelWorkspaceContextData): string {
  let prompt = `${AI_EVA_BASE_SYSTEM_PROMPT}

ENVIRONMENT: EXCEL WORKSPACE (Spreadsheet Intelligence)
You are acting as the AI Learning & Workspace Companion for AnalyticsRise Excel Workspace.

CORE TEACHING & MENTORING STYLE:
- Patient, encouraging, practical, and intelligent.
- Explain concepts clearly: UNDERSTAND -> EXPLAIN -> GUIDE -> SUGGEST.
- When explaining formulas, break down:
  1. Formula Purpose (What does it calculate?)
  2. Syntax & Arguments (What each argument does)
  3. Expected Result & Return Value
  4. Common Pitfalls & Edge Cases
- When diagnosing errors (#VALUE!, #REF!, #DIV/0!, #NAME?, #N/A):
  1. Explain why Excel threw this specific error code.
  2. Identify likely root causes based on data types and cell references.
  3. Provide concrete debugging steps and a corrected formula example.
- When recommending formulas or charts:
  - Inspect the available columns in the active worksheet.
  - DO NOT invent column names that do not exist in the metadata.
  - Explain why a particular chart or formula is optimal for the detected data types.
- Never modify user data directly; provide clear guidance so the user learns and remains in full control.`;

  if (context) {
    prompt += `\n\nACTIVE WORKBOOK METADATA (Privacy Level: ${context.privacyLevel}):`;
    prompt += `\n- Workbook: "${context.workbookName}" (${context.sheetCount} sheets)`;
    prompt += `\n- Active Sheet: "${context.activeSheetName}" (${context.rowCount} rows × ${context.colCount} columns)`;

    if (context.columns && context.columns.length > 0) {
      prompt += `\n- Available Columns in Active Sheet:`;
      for (const col of context.columns) {
        prompt += `\n  * \`${col.name}\` (Type: ${col.inferredType}${
          col.nullRatio !== undefined && col.nullRatio > 0 ? `, ${(col.nullRatio * 100).toFixed(0)}% empty` : ''
        })`;
      }
    }

    if (context.dataQuality && context.dataQuality.warnings.length > 0) {
      prompt += `\n\nDATA QUALITY PROFILER FINDINGS:`;
      for (const w of context.dataQuality.warnings) {
        prompt += `\n- ⚠️ ${w}`;
      }
    }

    if (context.activeFormula && context.activeFormula.formulaText) {
      prompt += `\n\nACTIVE FORMULA IN CELL ${context.activeFormula.cellAddress || 'selected'}:`;
      prompt += `\n\`\`\`excel\n${context.activeFormula.formulaText}\n\`\`\``;
      if (context.activeFormula.errorState) {
        prompt += `\n- Active Error: ${context.activeFormula.errorState}`;
      }
    } else if (context.activeFormula?.cellAddress) {
      prompt += `\n- Selected Cell Address: ${context.activeFormula.cellAddress}`;
    }

    if (context.approvedSample && context.approvedSample.userApproved) {
      prompt += `\n\nUSER-APPROVED DATA SAMPLE (${context.approvedSample.cellRange}):`;
      prompt += `\nHeaders: [${context.approvedSample.headers.join(', ')}]`;
      prompt += `\nRows:`;
      for (const row of context.approvedSample.rows) {
        prompt += `\n- [${row.join(', ')}]`;
      }
    }
  }

  return prompt;
}
