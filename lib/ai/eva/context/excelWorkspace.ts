/**
 * AnalyticsRise — Excel Workspace Context Adapter for AI-EVA
 * Extracts safe metadata, formula context, and user-approved data samples
 * from the active Excel Workspace state.
 */

import { ExcelWorkspaceState } from '@/app/excel-workspace/contexts/ExcelWorkspaceContext';
import { ExcelWorkspaceContextData, ExcelApprovedSample, ExcelFormulaContext } from './types';
import { sanitizeExcelWorkspaceContext } from './sanitizer';

/**
 * Converts 0-indexed column integer to Excel column letters (0 -> 'A', 25 -> 'Z', 26 -> 'AA')
 */
export function colToLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Converts 0-indexed row & column to standard Excel cell address (e.g. 0, 0 -> 'A1')
 */
export function toCellCoordinate(row: number, col: number): string {
  return `${colToLetter(col)}${row + 1}`;
}

/**
 * Extracts formula error string if present
 */
const EXCEL_ERROR_SIGS = ['#VALUE!', '#REF!', '#DIV/0!', '#NAME?', '#N/A', '#NULL!', '#NUM!'];
export function detectFormulaError(val: unknown): string | undefined {
  if (typeof val === 'string') {
    const upper = val.toUpperCase().trim();
    for (const err of EXCEL_ERROR_SIGS) {
      if (upper.includes(err)) return err;
    }
  }
  return undefined;
}

/**
 * Adapts live ExcelWorkspaceState into safe, privacy-aware ExcelWorkspaceContextData
 */
export function adaptExcelWorkspaceContext(
  state: Partial<ExcelWorkspaceState>,
  userApprovedSample?: ExcelApprovedSample
): ExcelWorkspaceContextData | undefined {
  const workbook = state.workbook;
  if (!workbook) return undefined;

  const activeSheetId = state.activeSheetId || workbook.activeSheetId || workbook.sheetOrder[0];
  const activeSheet = workbook.sheets[activeSheetId] || Object.values(workbook.sheets)[0];
  const sheetNames = (workbook.sheetOrder || Object.keys(workbook.sheets)).map(
    (id) => workbook.sheets[id]?.name || id
  );
  const activeSheetProfile = state.profile?.sheetProfiles?.[activeSheet?.id];

  // 1. Column Metadata
  const columns = (activeSheet?.headers || []).map((headerName, idx) => {
    const colProfile = activeSheetProfile?.columns.find(
      (cp) => cp.header === headerName || cp.colIndex === idx
    );
    return {
      name: headerName || `Col ${colToLetter(idx)}`,
      inferredType: colProfile?.inferredType || 'text',
      nullCount: colProfile?.nullCount,
      nullRatio: colProfile?.nullRatio,
      distinctCount: colProfile?.uniqueCount,
      sampleValues: colProfile?.sampleValues?.slice(0, 3),
    };
  });

  // 2. Data Quality Summary
  let dataQuality = undefined;
  if (state.profile) {
    const warnings = state.profile.qualityWarnings || [];
    dataQuality = {
      warningCount: warnings.length,
      warnings: warnings.slice(0, 10),
      totalNullRatio: 0,
      hasMixedTypes: false,
      hasDuplicateHeaders: warnings.some((w) => w.toLowerCase().includes('duplicate')),
    };
  }


  // 3. Active Selection / Formula Context
  let activeFormula: ExcelFormulaContext | undefined = undefined;
  if (state.selectedCell && activeSheet) {
    const { row, col } = state.selectedCell;
    const cellAddress = toCellCoordinate(row, col);
    const cellKey = `${row},${col}`;
    const cell = activeSheet.cells[cellKey];

    if (cell && (cell.formula || (typeof cell.value === 'string' && cell.value.startsWith('=')) || detectFormulaError(cell.value))) {
      activeFormula = {
        cellAddress,
        formulaText: cell.formula || (typeof cell.value === 'string' && cell.value.startsWith('=') ? cell.value : ''),
        errorState: detectFormulaError(cell.value) || detectFormulaError(cell.formula),
      };
    } else if (cell) {
      activeFormula = {
        cellAddress,
        formulaText: '',
      };
    }
  }

  const rawContext: ExcelWorkspaceContextData = {
    workbookName: workbook.fileName,
    sheetCount: workbook.sheetOrder?.length || Object.keys(workbook.sheets).length,
    sheetNames,
    activeSheetName: activeSheet ? activeSheet.name : 'Sheet1',
    rowCount: activeSheet ? activeSheet.rows : 0,
    colCount: activeSheet ? activeSheet.cols : 0,
    columns,
    dataQuality,
    activeFormula,
    approvedSample: userApprovedSample,
    privacyLevel: userApprovedSample?.userApproved
      ? 'approved_sample'
      : activeFormula?.formulaText
      ? 'formula'
      : 'metadata',
  };

  return sanitizeExcelWorkspaceContext(rawContext);
}
