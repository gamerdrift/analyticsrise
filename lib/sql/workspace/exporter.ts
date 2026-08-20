/**
 * AnalyticsRise SQL Workspace — Safe Browser CSV Exporter
 * 
 * Serializes query results to sanitized CSV format with proper quote escaping
 * and downloads via native browser Blob API.
 */

import { QueryResult, SqlValue } from '../types';

function escapeCsvField(val: SqlValue): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Format QueryResult into a clean CSV string
 */
export function formatQueryResultAsCsv(
  result: QueryResult,
  maxRows: number = 10000
): string {
  const { columns, rows } = result;
  if (columns.length === 0) return '';

  const headerLine = columns.map(escapeCsvField).join(',');
  const rowLines: string[] = [headerLine];

  const exportLimit = Math.min(rows.length, maxRows);
  for (let i = 0; i < exportLimit; i++) {
    const row = rows[i];
    const rowLine = row.map(escapeCsvField).join(',');
    rowLines.push(rowLine);
  }

  return rowLines.join('\r\n');
}

/**
 * Trigger browser file download from CSV string
 */
export function downloadCsvFile(
  csvContent: string,
  fileName: string = 'query_results.csv'
): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
