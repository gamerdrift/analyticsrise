import { Sheet, Cell } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { evaluateFormula } from '@/lib/utils/excel/formulaEvaluator';

/**
 * Parse raw CSV string into cells record and row/col counts
 */
export function parseCSV(csvText: string): {
  cells: Record<string, Cell>;
  rows: number;
  cols: number;
} {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const cells: Record<string, Cell> = {};
  let maxCols = 0;

  lines.forEach((line, rowIdx) => {
    // Parse CSV line handling quotes
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    maxCols = Math.max(maxCols, values.length);

    values.forEach((val, colIdx) => {
      if (val !== '') {
        const key = `${rowIdx},${colIdx}`;
        const isFormula = val.startsWith('=');
        const numVal = Number(val);
        const cellValue = isFormula ? '' : isNaN(numVal) ? val : numVal;

        cells[key] = {
          address: { sheetId: 'active', row: rowIdx, col: colIdx },
          value: cellValue,
          formula: isFormula ? val : undefined,
        };
      }
    });
  });

  return {
    cells,
    rows: Math.max(100, lines.length + 10),
    cols: Math.max(26, maxCols + 5),
  };
}

/**
 * Export active Sheet cells to CSV string
 */
export function exportToCSV(sheet: Sheet): string {
  const cellKeys = Object.keys(sheet.cells);
  if (cellKeys.length === 0) return '';

  let maxRow = 0;
  let maxCol = 0;

  cellKeys.forEach((key) => {
    const [r, c] = key.split(',').map(Number);
    maxRow = Math.max(maxRow, r);
    maxCol = Math.max(maxCol, c);
  });

  const lines: string[] = [];
  for (let r = 0; r <= maxRow; r++) {
    const rowValues: string[] = [];
    for (let c = 0; c <= maxCol; c++) {
      const key = `${r},${c}`;
      const cell = sheet.cells[key];
      let val = '';
      if (cell) {
        if (cell.formula) {
          const evalRes = evaluateFormula(cell.formula, sheet.cells);
          val = String(evalRes ?? '');
        } else {
          val = String(cell.value ?? '');
        }
      }
      // Escape CSV values containing commas or quotes
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      rowValues.push(val);
    }
    lines.push(rowValues.join(','));
  }

  return lines.join('\n');
}

/**
 * Trigger browser file download for exported CSV
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
