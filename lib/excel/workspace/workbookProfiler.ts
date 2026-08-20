/**
 * Excel Workspace — Workbook & Worksheet Statistical Profiler
 * Analyzes worksheet structure, column distributions, formula density,
 * and data quality warnings in bounded client execution time.
 */

import { ParsedWorkbook, WorkspaceSheet, WorksheetProfile, WorkbookProfile, ColumnDataSummary } from './types';

/**
 * Infer data type of an array of cell values
 */
export function inferTypeFromValues(values: any[]): 'INTEGER' | 'DECIMAL' | 'TEXT' | 'BOOLEAN' | 'DATE' | 'EMPTY' {
  const nonNulls = values.filter((v) => v !== null && v !== undefined && v !== '');
  if (nonNulls.length === 0) return 'EMPTY';

  let hasInt = false;
  let hasDec = false;
  let hasBool = false;
  let hasDate = false;
  let hasText = false;

  for (const val of nonNulls) {
    if (typeof val === 'boolean') {
      hasBool = true;
    } else if (typeof val === 'number') {
      if (Number.isInteger(val)) hasInt = true;
      else hasDec = true;
    } else if (typeof val === 'string') {
      const trimmed = val.trim();
      const num = Number(trimmed);
      if (!isNaN(num) && trimmed.length > 0) {
        if (Number.isInteger(num)) hasInt = true;
        else hasDec = true;
      } else if (/^(true|false|yes|no)$/i.test(trimmed)) {
        hasBool = true;
      } else if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(trimmed)) {
        hasDate = true;
      } else {
        hasText = true;
      }
    } else {
      hasText = true;
    }
  }

  if (hasText) return 'TEXT';
  if (hasDate && !hasInt && !hasDec) return 'DATE';
  if (hasBool && !hasInt && !hasDec) return 'BOOLEAN';
  if (hasDec) return 'DECIMAL';
  if (hasInt) return 'INTEGER';

  return 'TEXT';
}

/**
 * Profile an individual worksheet
 */
export function profileWorksheet(sheet: WorkspaceSheet): WorksheetProfile {
  let populatedCellCount = 0;
  let formulaCount = 0;
  let maxRow = 0;
  let maxCol = Math.max(0, sheet.headers.length - 1);

  // Group cell values by column index (skipping header row 0)
  const colValues: Record<number, any[]> = {};

  for (const [key, cell] of Object.entries(sheet.cells)) {
    const [rStr, cStr] = key.split(',');
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);

    maxRow = Math.max(maxRow, r);
    maxCol = Math.max(maxCol, c);

    if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
      populatedCellCount++;
    }
    if (cell.formula) {
      formulaCount++;
    }

    if (r > 0) {
      if (!colValues[c]) colValues[c] = [];
      colValues[c].push(cell.value);
    }
  }

  const columns: ColumnDataSummary[] = [];
  const blankColumns: number[] = [];
  const headerCounts: Record<string, number> = {};
  const duplicateHeaders: string[] = [];

  const totalDataRows = Math.max(1, maxRow);

  for (let c = 0; c <= maxCol; c++) {
    const header = sheet.headers[c] || `Col_${c + 1}`;
    const cleanHeader = header.toLowerCase();
    headerCounts[cleanHeader] = (headerCounts[cleanHeader] || 0) + 1;
    if (headerCounts[cleanHeader] === 2) {
      duplicateHeaders.push(header);
    }

    const values = colValues[c] || [];
    const nonNulls = values.filter((v) => v !== null && v !== undefined && v !== '');
    const nullCount = totalDataRows - nonNulls.length;
    const nullRatio = Number((nullCount / totalDataRows).toFixed(3));

    if (nonNulls.length === 0) {
      blankColumns.push(c);
    }

    // Unique count & sample values
    const uniqueSet = new Set(nonNulls.map(String));
    const sampleValues = Array.from(uniqueSet).slice(0, 3);

    const inferredType = inferTypeFromValues(values);

    // Compute numeric statistics if applicable
    let min: number | undefined;
    let max: number | undefined;
    let avg: number | undefined;
    let sum: number | undefined;

    if (inferredType === 'INTEGER' || inferredType === 'DECIMAL') {
      const numbers = nonNulls.map(Number).filter((n) => !isNaN(n));
      if (numbers.length > 0) {
        min = Math.min(...numbers);
        max = Math.max(...numbers);
        sum = Number(numbers.reduce((a, b) => a + b, 0).toFixed(2));
        avg = Number((sum / numbers.length).toFixed(2));
      }
    }

    columns.push({
      colIndex: c,
      header,
      inferredType,
      nonEmptyCount: nonNulls.length,
      nullCount,
      nullRatio,
      uniqueCount: uniqueSet.size,
      sampleValues,
      min,
      max,
      avg,
      sum,
    });
  }

  const estimatedMemoryBytes = populatedCellCount * 120 + maxRow * maxCol * 8;

  return {
    sheetId: sheet.id,
    sheetName: sheet.name,
    rowCount: maxRow + 1,
    colCount: maxCol + 1,
    populatedCellCount,
    formulaCount,
    columns,
    duplicateHeaders,
    blankColumns,
    estimatedMemoryBytes,
  };
}

/**
 * Profile an entire workbook and aggregate data quality alerts
 */
export function profileWorkbook(workbook: ParsedWorkbook): WorkbookProfile {
  const sheetProfiles: Record<string, WorksheetProfile> = {};
  let totalCellCount = 0;
  let totalFormulaCount = 0;
  const qualityWarnings: string[] = [];

  for (const sheetId of workbook.sheetOrder) {
    const sheet = workbook.sheets[sheetId];
    if (!sheet) continue;

    const profile = profileWorksheet(sheet);
    sheetProfiles[sheetId] = profile;

    totalCellCount += profile.populatedCellCount;
    totalFormulaCount += profile.formulaCount;

    if (profile.duplicateHeaders.length > 0) {
      qualityWarnings.push(`Sheet "${profile.sheetName}" contains duplicate headers: ${profile.duplicateHeaders.join(', ')}`);
    }

    if (profile.blankColumns.length > 0) {
      qualityWarnings.push(`Sheet "${profile.sheetName}" contains ${profile.blankColumns.length} blank column(s).`);
    }

    const highMissingCols = profile.columns.filter((c) => c.nullRatio > 0.4 && c.nonEmptyCount > 0);
    if (highMissingCols.length > 0) {
      qualityWarnings.push(`Sheet "${profile.sheetName}" has high missing data (>40%) in: ${highMissingCols.map((c) => c.header).slice(0, 3).join(', ')}`);
    }
  }

  return {
    fileName: workbook.fileName,
    fileSizeBytes: workbook.fileSizeBytes,
    sheetCount: workbook.sheetOrder.length,
    totalCellCount,
    totalFormulaCount,
    sheetProfiles,
    qualityWarnings,
  };
}
