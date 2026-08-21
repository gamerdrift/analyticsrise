/**
 * AnalyticsRise — Power BI Workspace Dataset File Parser
 * High-performance, RFC 4180 compliant delimited text parser for CSV, TSV, and TXT datasets.
 */

import { Dataset, DatasetColumn } from './types';
import { inferColumnType, isValueEmpty } from './typeInference';

/**
 * Detects the delimiter from the first few lines of text
 */
export function detectDelimiter(text: string): string {
  const sample = text.slice(0, 4096);
  const lines = sample.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0).slice(0, 5);

  if (lines.length === 0) return ',';

  const delimiters = [',', '\t', ';', '|'];
  let bestDelimiter = ',';
  let maxConsistentCount = 0;

  for (const delim of delimiters) {
    const counts = lines.map((line) => line.split(delim).length - 1);
    const firstCount = counts[0];
    const isConsistent = counts.every((c) => c === firstCount && c > 0);

    if (isConsistent && firstCount > maxConsistentCount) {
      maxConsistentCount = firstCount;
      bestDelimiter = delim;
    }
  }

  return bestDelimiter;
}

/**
 * Parses delimited text into raw 2D string matrix
 */
export function parseDelimitedText(text: string, customDelimiter?: string): string[][] {
  const delimiter = customDelimiter || detectDelimiter(text);
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in CRLF
      }
      currentRow.push(currentCell);
      if (currentRow.some((cell) => cell.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some((cell) => cell.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Sanitizes and deduplicates header names
 */
export function sanitizeHeaders(rawHeaders: string[]): string[] {
  const headerCounts: Record<string, number> = {};
  return rawHeaders.map((header, idx) => {
    let clean = header.trim();
    if (!clean) {
      clean = `Column_${idx + 1}`;
    }

    if (headerCounts[clean] !== undefined) {
      headerCounts[clean]++;
      return `${clean}_${headerCounts[clean]}`;
    } else {
      headerCounts[clean] = 1;
      return clean;
    }
  });
}

/**
 * Parses a dataset file into an AnalyticsRise Dataset model
 */
export function parseDatasetFile(
  content: string,
  fileName: string,
  fileSizeBytes: number,
  datasetId?: string,
  datasetName?: string
): Dataset {
  const rawRows = parseDelimitedText(content);

  if (rawRows.length === 0) {
    const defaultHeaders = ['Column_1'];
    return {
      id: datasetId || `ds_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: datasetName || fileName.replace(/\.[^/.]+$/, ''),
      sourceFileName: fileName,
      sourceSizeBytes: fileSizeBytes,
      rowCount: 0,
      colCount: 1,
      headers: defaultHeaders,
      rows: [],
      columns: [
        {
          id: 'col_0',
          name: defaultHeaders[0],
          inferredType: 'EMPTY',
          nullCount: 0,
          nullRatio: 0,
          distinctCount: 0,
          sampleValues: [],
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  const rawHeaders = rawRows[0];
  const headers = sanitizeHeaders(rawHeaders);
  const dataRows = rawRows.slice(1);

  // Normalize row lengths and convert cell types
  const parsedRows: (string | number | boolean | null)[][] = dataRows.map((row) => {
    const normalized: (string | number | boolean | null)[] = [];
    for (let c = 0; c < headers.length; c++) {
      const rawVal = row[c];
      if (isValueEmpty(rawVal)) {
        normalized.push(null);
      } else {
        const strVal = String(rawVal).trim();
        const numVal = Number(strVal.replace(/[\$,%]/g, ''));
        if (!isNaN(numVal) && strVal !== '') {
          normalized.push(numVal);
        } else if (strVal.toLowerCase() === 'true') {
          normalized.push(true);
        } else if (strVal.toLowerCase() === 'false') {
          normalized.push(false);
        } else {
          normalized.push(strVal);
        }
      }
    }
    return normalized;
  });

  // Calculate preliminary column definitions
  const columns: DatasetColumn[] = headers.map((header, colIdx) => {
    const colValues = parsedRows.map((r) => r[colIdx]);
    const inferredType = inferColumnType(colValues);
    const nonEmpties = colValues.filter((v) => !isValueEmpty(v));
    const nullCount = colValues.length - nonEmpties.length;
    const nullRatio = colValues.length > 0 ? nullCount / colValues.length : 0;
    const distinctSet = new Set(nonEmpties.map((v) => String(v)));
    const distinctCount = distinctSet.size;
    const sampleValues = Array.from(distinctSet).slice(0, 3);

    const isNumeric = inferredType === 'INTEGER' || inferredType === 'DECIMAL';
    let min: number | undefined = undefined;
    let max: number | undefined = undefined;
    let avg: number | undefined = undefined;
    let sum: number | undefined = undefined;

    if (isNumeric && nonEmpties.length > 0) {
      const nums = nonEmpties.filter((v): v is number => typeof v === 'number');
      if (nums.length > 0) {
        min = Math.min(...nums);
        max = Math.max(...nums);
        sum = nums.reduce((acc, curr) => acc + curr, 0);
        avg = sum / nums.length;
      }
    }

    const isPotentialKey =
      colValues.length > 0 &&
      nullCount === 0 &&
      distinctCount === colValues.length &&
      (header.toLowerCase().includes('id') ||
        header.toLowerCase().includes('key') ||
        header.toLowerCase().includes('code') ||
        distinctCount === colValues.length);

    return {
      id: `col_${colIdx}`,
      name: header,
      inferredType,
      nullCount,
      nullRatio,
      distinctCount,
      sampleValues,
      min,
      max,
      avg: avg !== undefined ? Math.round(avg * 100) / 100 : undefined,
      sum: sum !== undefined ? Math.round(sum * 100) / 100 : undefined,
      isPotentialKey,
    };
  });

  return {
    id: datasetId || `ds_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: datasetName || fileName.replace(/\.[^/.]+$/, ''),
    sourceFileName: fileName,
    sourceSizeBytes: fileSizeBytes,
    rowCount: parsedRows.length,
    colCount: headers.length,
    headers,
    rows: parsedRows,
    columns,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
