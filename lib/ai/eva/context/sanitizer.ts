/**
 * AnalyticsRise — AI-EVA Spreadsheet Context Sanitizer
 * Prepares safe, structured context strings from Excel Workspace metadata
 * ensuring untrusted user data cannot execute prompt injection attacks.
 */

import { ExcelWorkspaceContextData } from './types';
import { applyPrivacyShield } from './privacy';
import { AI_EVA_LIMITS } from '../limits';

export function sanitizeExcelWorkspaceContext(
  context?: ExcelWorkspaceContextData
): ExcelWorkspaceContextData | undefined {
  if (!context) return undefined;

  // 1. Enforce privacy levels and sanitize sample rows
  const shielded = applyPrivacyShield(context);

  // 2. Bound string lengths and sanitize metadata
  const sanitizedWorkbookName = String(shielded.workbookName || 'Workbook.xlsx').slice(0, 80);
  const sanitizedSheetNames = (shielded.sheetNames || []).slice(0, 30).map((s) => String(s).slice(0, 50));
  const sanitizedActiveSheetName = String(shielded.activeSheetName || 'Sheet1').slice(0, 50);

  const sanitizedColumns = (shielded.columns || []).slice(0, 50).map((col) => ({
    name: String(col.name).slice(0, 60),
    inferredType: String(col.inferredType || 'general').slice(0, 30),
    nullCount: typeof col.nullCount === 'number' ? col.nullCount : undefined,
    nullRatio: typeof col.nullRatio === 'number' ? Math.min(1, Math.max(0, col.nullRatio)) : undefined,
    distinctCount: typeof col.distinctCount === 'number' ? col.distinctCount : undefined,
    sampleValues: Array.isArray(col.sampleValues)
      ? col.sampleValues.slice(0, 3).map((v) => String(v).slice(0, 40))
      : undefined,
  }));

  // 3. Bound formula context
  let sanitizedFormula = undefined;
  if (shielded.activeFormula && shielded.activeFormula.formulaText) {
    let cleanFormula = String(shielded.activeFormula.formulaText).trim();
    if (cleanFormula.length > AI_EVA_LIMITS.MAX_ATTACHED_FORMULA_LENGTH) {
      cleanFormula = cleanFormula.slice(0, AI_EVA_LIMITS.MAX_ATTACHED_FORMULA_LENGTH) + '…';
    }

    sanitizedFormula = {
      cellAddress: String(shielded.activeFormula.cellAddress || '').slice(0, 10),
      formulaText: cleanFormula,
      errorState: shielded.activeFormula.errorState ? String(shielded.activeFormula.errorState).slice(0, 30) : undefined,
      referencedCoordinates: Array.isArray(shielded.activeFormula.referencedCoordinates)
        ? shielded.activeFormula.referencedCoordinates.slice(0, 20).map((c) => String(c).slice(0, 10))
        : undefined,
    };
  }

  return {
    workbookName: sanitizedWorkbookName,
    sheetCount: shielded.sheetCount,
    sheetNames: sanitizedSheetNames,
    activeSheetName: sanitizedActiveSheetName,
    rowCount: shielded.rowCount,
    colCount: shielded.colCount,
    columns: sanitizedColumns,
    dataQuality: shielded.dataQuality,
    activeFormula: sanitizedFormula,
    approvedSample: shielded.approvedSample,
    privacyLevel: shielded.privacyLevel,
  };
}
