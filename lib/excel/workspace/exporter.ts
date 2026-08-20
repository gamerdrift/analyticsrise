/**
 * Excel Workspace — Exporter Module
 * Serializes active worksheet data into RFC-4180 CSV, TSV, and JSON formats.
 */

import { WorkspaceSheet } from './types';
import { evaluateFormula } from '@/lib/utils/excel/formulaEvaluator';

/**
 * Format active worksheet cells into RFC-4180 CSV format
 */
export function formatWorksheetAsCsv(
  sheet: WorkspaceSheet,
  maxExportRows: number = 10000
): string {
  // Determine actual row and col bounds
  let maxRow = 0;
  let maxCol = Math.max(0, sheet.headers.length - 1);

  for (const key of Object.keys(sheet.cells)) {
    const [r, c] = key.split(',').map((n) => parseInt(n, 10));
    maxRow = Math.max(maxRow, r);
    maxCol = Math.max(maxCol, c);
  }

  const boundedMaxRow = Math.min(maxRow, maxExportRows);
  const lines: string[] = [];

  for (let r = 0; r <= boundedMaxRow; r++) {
    const rowValues: string[] = [];
    for (let c = 0; c <= maxCol; c++) {
      const cell = sheet.cells[`${r},${c}`];
      let valStr = '';

      if (cell) {
        if (cell.formula) {
          try {
            const evaluated = evaluateFormula(cell.formula, sheet.cells as any);
            valStr = evaluated !== null && evaluated !== undefined ? String(evaluated) : '';
          } catch {
            valStr = cell.value !== null && cell.value !== undefined ? String(cell.value) : '';
          }
        } else {
          valStr = cell.value !== null && cell.value !== undefined ? String(cell.value) : '';
        }
      }

      // Escape quotes and wrap in quotes if containing special characters
      if (valStr.includes(',') || valStr.includes('"') || valStr.includes('\n') || valStr.includes('\r')) {
        valStr = `"${valStr.replace(/"/g, '""')}"`;
      }
      rowValues.push(valStr);
    }
    lines.push(rowValues.join(','));
  }

  return lines.join('\n');
}

/**
 * Format active worksheet cells into TSV format
 */
export function formatWorksheetAsTsv(
  sheet: WorkspaceSheet,
  maxExportRows: number = 10000
): string {
  let maxRow = 0;
  let maxCol = Math.max(0, sheet.headers.length - 1);

  for (const key of Object.keys(sheet.cells)) {
    const [r, c] = key.split(',').map((n) => parseInt(n, 10));
    maxRow = Math.max(maxRow, r);
    maxCol = Math.max(maxCol, c);
  }

  const boundedMaxRow = Math.min(maxRow, maxExportRows);
  const lines: string[] = [];

  for (let r = 0; r <= boundedMaxRow; r++) {
    const rowValues: string[] = [];
    for (let c = 0; c <= maxCol; c++) {
      const cell = sheet.cells[`${r},${c}`];
      let valStr = '';

      if (cell) {
        if (cell.formula) {
          try {
            const evaluated = evaluateFormula(cell.formula, sheet.cells as any);
            valStr = evaluated !== null && evaluated !== undefined ? String(evaluated) : '';
          } catch {
            valStr = cell.value !== null && cell.value !== undefined ? String(cell.value) : '';
          }
        } else {
          valStr = cell.value !== null && cell.value !== undefined ? String(cell.value) : '';
        }
      }

      rowValues.push(valStr.replace(/\t/g, ' '));
    }
    lines.push(rowValues.join('\t'));
  }

  return lines.join('\n');
}

/**
 * Trigger native browser file download using a Blob URL
 */
export function downloadExportFile(
  content: string,
  fileName: string,
  mimeType: string = 'text/csv;charset=utf-8;'
): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up object URL to prevent memory leaks
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
