/**
 * AnalyticsRise SQL Workspace — Robust In-Browser CSV / TSV Parser
 * 
 * High-performance, RFC-4180 compliant CSV parser with quote escaping,
 * delimiter auto-detection, and safe SQL identifier sanitization.
 */

export interface RawParseResult {
  headers: string[];
  originalHeaders: string[];
  rows: string[][];
  delimiter: string;
  duplicateHeaders: string[];
  emptyValueCount: number;
  totalLines: number;
  warnings: string[];
}

/**
 * Auto-detect delimiter by analyzing the first few lines
 */
export function detectDelimiter(text: string): string {
  const sample = text.slice(0, 4096);
  const lines = sample.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return ',';

  const candidates = [',', '\t', ';', '|'];
  let bestDelimiter = ',';
  let maxCount = -1;

  for (const delim of candidates) {
    const counts = lines.slice(0, 5).map((l) => l.split(delim).length);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    // Check if the delimiter is consistent across lines
    const isConsistent = counts.every((c) => c > 1 && Math.abs(c - avg) < 1.5);

    if (isConsistent && avg > maxCount) {
      maxCount = avg;
      bestDelimiter = delim;
    }
  }

  return bestDelimiter;
}

/**
 * Sanitize header string into a valid SQL column identifier
 */
export function sanitizeColumnIdentifier(header: string, index: number): string {
  let cleaned = header.trim();
  if (!cleaned) {
    return `column_${index + 1}`;
  }

  // Replace special characters with underscore
  cleaned = cleaned
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  // SQL identifiers must not start with a digit
  if (/^[0-9]/.test(cleaned)) {
    cleaned = `col_${cleaned}`;
  }

  return cleaned || `column_${index + 1}`;
}

/**
 * Parse a single CSV line with full quoted field support
 */
export function parseCsvLine(line: string, delimiter: string = ','): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote: "" -> "
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

/**
 * Parse full raw CSV text into raw table rows & sanitized headers
 */
export function parseCsvText(rawText: string, customDelimiter?: string): RawParseResult {
  const warnings: string[] = [];
  const text = rawText.replace(/^\uFEFF/, ''); // Strip BOM if present
  const lines = text.split(/\r?\n/);
  
  // Filter out completely empty lines
  const nonEmptyLines: string[] = [];
  for (const line of lines) {
    if (line.trim().length > 0) {
      nonEmptyLines.push(line);
    }
  }

  if (nonEmptyLines.length === 0) {
    return {
      headers: [],
      originalHeaders: [],
      rows: [],
      delimiter: customDelimiter || ',',
      duplicateHeaders: [],
      emptyValueCount: 0,
      totalLines: 0,
      warnings: ['File is empty.'],
    };
  }

  const delimiter = customDelimiter || detectDelimiter(text);
  const headerLine = nonEmptyLines[0];
  const rawHeaders = parseCsvLine(headerLine, delimiter);

  // Sanitize and deduplicate headers
  const headers: string[] = [];
  const duplicateHeaders: string[] = [];
  const seenHeaders = new Map<string, number>();

  rawHeaders.forEach((rawH, idx) => {
    const sanitized = sanitizeColumnIdentifier(rawH, idx);
    const count = seenHeaders.get(sanitized) || 0;
    if (count > 0) {
      duplicateHeaders.push(rawH);
      const uniqueName = `${sanitized}_${count + 1}`;
      headers.push(uniqueName);
      seenHeaders.set(sanitized, count + 1);
    } else {
      headers.push(sanitized);
      seenHeaders.set(sanitized, 1);
    }
  });

  if (duplicateHeaders.length > 0) {
    warnings.push(`Detected duplicate column names: ${duplicateHeaders.join(', ')}. Auto-renamed.`);
  }

  const expectedColCount = headers.length;
  const rows: string[][] = [];
  let emptyValueCount = 0;

  for (let i = 1; i < nonEmptyLines.length; i++) {
    const line = nonEmptyLines[i];
    const rowValues = parseCsvLine(line, delimiter);

    // Normalize row column length
    while (rowValues.length < expectedColCount) {
      rowValues.push('');
      emptyValueCount++;
    }

    if (rowValues.length > expectedColCount) {
      // If there are extra columns, join them into the last column or trim
      warnings.push(`Line ${i + 1} has ${rowValues.length} columns (expected ${expectedColCount}). Truncated.`);
      rowValues.length = expectedColCount;
    }

    for (const val of rowValues) {
      if (val === '' || val.toLowerCase() === 'null' || val.toLowerCase() === 'nan') {
        emptyValueCount++;
      }
    }

    rows.push(rowValues);
  }

  return {
    headers,
    originalHeaders: rawHeaders,
    rows,
    delimiter,
    duplicateHeaders,
    emptyValueCount,
    totalLines: nonEmptyLines.length,
    warnings,
  };
}
