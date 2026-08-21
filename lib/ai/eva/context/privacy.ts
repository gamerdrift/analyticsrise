/**
 * AnalyticsRise — AI-EVA Workspace Privacy Shield
 * Enforces controlled context sharing boundaries:
 * - Level 1: Safe Metadata Only (Automatic)
 * - Level 2: User-Approved Data Sample (Explicit user confirmation)
 * - Level 3: Formula Context (Active cell formula only)
 */

import { ExcelWorkspaceContextData, ExcelApprovedSample, AiEvaPrivacyLevel } from './types';
import { AI_EVA_LIMITS } from '../limits';

const CREDENTIAL_PATTERNS = [
  /password\s*[:=]\s*\S+/i,
  /bearer\s+[a-zA-Z0-9_\-\.]+/i,
  /sk-[a-zA-Z0-9]{20,}/i,
  /ghp_[a-zA-Z0-9]{20,}/i,
  /ey[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}/i,
];

/**
 * Sanitizes a cell string value to remove accidental secret leaks
 */
export function sanitizeCellValue(val: unknown): string | number | boolean | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number' || typeof val === 'boolean') return val;

  const str = String(val).trim();
  // Check if string matches any credential pattern
  for (const pattern of CREDENTIAL_PATTERNS) {
    if (pattern.test(str)) {
      return '[REDACTED_CREDENTIAL]';
    }
  }

  // Truncate overly long single cell values
  return str.length > 100 ? str.slice(0, 100) + '…' : str;
}

/**
 * Applies privacy controls to an Excel Workspace context payload.
 * Ensures Level 1 (Metadata) NEVER contains raw row data.
 * Ensures Level 2 (Sample) requires explicit user approval and is bounded.
 */
export function applyPrivacyShield(
  context: ExcelWorkspaceContextData
): ExcelWorkspaceContextData {
  let privacyLevel: AiEvaPrivacyLevel = 'metadata';

  // Check if formula context exists
  if (context.activeFormula && context.activeFormula.formulaText) {
    privacyLevel = 'formula';
  }

  // Check if user approved sharing a data sample
  let boundedSample: ExcelApprovedSample | undefined = undefined;

  if (context.approvedSample && context.approvedSample.userApproved) {
    privacyLevel = 'approved_sample';

    const safeHeaders = (context.approvedSample.headers || [])
      .slice(0, AI_EVA_LIMITS.MAX_APPROVED_SAMPLE_COLS)
      .map((h) => String(h).slice(0, 50));

    const safeRows = (context.approvedSample.rows || [])
      .slice(0, AI_EVA_LIMITS.MAX_APPROVED_SAMPLE_ROWS)
      .map((row) =>
        row
          .slice(0, AI_EVA_LIMITS.MAX_APPROVED_SAMPLE_COLS)
          .map((cell) => sanitizeCellValue(cell))
      );

    boundedSample = {
      cellRange: String(context.approvedSample.cellRange || 'Selection').slice(0, 20),
      rowCount: safeRows.length,
      colCount: safeHeaders.length,
      headers: safeHeaders,
      rows: safeRows,
      userApproved: true,
      timestamp: context.approvedSample.timestamp || new Date().toISOString(),
    };
  }

  return {
    ...context,
    privacyLevel,
    approvedSample: boundedSample,
  };
}
