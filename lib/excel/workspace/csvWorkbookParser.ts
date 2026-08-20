/**
 * Excel Workspace — CSV/TSV Workbook Parser
 * Converts delimiter-separated text files into a single-sheet ParsedWorkbook model.
 */

import { ParsedWorkbook, WorkspaceSheet, WorkspaceCell } from './types';

/**
 * Detect delimiter from candidate delimiters
 */
export function detectDelimiter(text: string): string {
  const candidates = [',', '\t', ';', '|'];
  const firstLines = text.split(/\r?\n/).slice(0, 10).filter((l) => l.trim().length > 0);

  if (firstLines.length === 0) return ',';

  let bestDelimiter = ',';
  let bestScore = -1;

  for (const d of candidates) {
    const counts = firstLines.map((line) => {
      let count = 0;
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') inQuotes = !inQuotes;
        else if (c === d && !inQuotes) count++;
      }
      return count;
    });

    const isNonZero = counts.every((c) => c > 0);
    const isConsistent = counts.every((c) => c === counts[0]);

    if (isNonZero && isConsistent && counts[0] > bestScore) {
      bestScore = counts[0];
      bestDelimiter = d;
    } else if (counts.reduce((a, b) => a + b, 0) > bestScore && !isConsistent) {
      bestScore = counts.reduce((a, b) => a + b, 0);
      bestDelimiter = d;
    }
  }

  return bestDelimiter;
}

/**
 * Parse CSV/TSV text into rows of string tokens
 */
export function parseRawDelimitedLines(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentToken = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentToken.trim());
      currentToken = '';

      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentToken += char;
    }
  }

  if (currentToken.length > 0 || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Ingest CSV text and return a ParsedWorkbook
 */
export function parseCsvToWorkbook(
  text: string,
  fileName: string,
  fileSizeBytes: number
): ParsedWorkbook {
  const delimiter = detectDelimiter(text);
  const rawRows = parseRawDelimitedLines(text, delimiter);

  const sheetId = 'sheet_1';
  const sheetName = fileName.replace(/\.[^/.]+$/, '') || 'Data';

  if (rawRows.length === 0) {
    const emptySheet: WorkspaceSheet = {
      id: sheetId,
      name: sheetName,
      rows: 100,
      cols: 26,
      cells: {},
      headers: [],
    };

    return {
      fileName,
      fileSizeBytes,
      sheets: { [sheetId]: emptySheet },
      sheetOrder: [sheetId],
      activeSheetId: sheetId,
      createdAt: Date.now(),
    };
  }

  // Extract headers
  const headerRow = rawRows[0];
  const headers = headerRow.map((h, idx) => (h && h.trim().length > 0 ? h.trim() : `Col_${idx + 1}`));

  const cells: Record<string, WorkspaceCell> = {};
  let maxCols = headers.length;

  rawRows.forEach((row, rowIdx) => {
    maxCols = Math.max(maxCols, row.length);
    row.forEach((val, colIdx) => {
      if (val !== '' && val !== null && val !== undefined) {
        const isFormula = val.startsWith('=');
        const numVal = Number(val);
        const cellValue = isFormula ? '' : !isNaN(numVal) && val !== '' ? numVal : val;

        cells[`${rowIdx},${colIdx}`] = {
          address: { sheetId, row: rowIdx, col: colIdx },
          value: cellValue,
          formula: isFormula ? val : undefined,
          formatting: rowIdx === 0 ? { bold: true } : undefined,
        };
      }
    });
  });

  const sheet: WorkspaceSheet = {
    id: sheetId,
    name: sheetName,
    rows: Math.max(100, rawRows.length + 20),
    cols: Math.max(26, maxCols + 5),
    cells,
    headers,
  };

  return {
    fileName,
    fileSizeBytes,
    sheets: { [sheetId]: sheet },
    sheetOrder: [sheetId],
    activeSheetId: sheetId,
    createdAt: Date.now(),
  };
}
