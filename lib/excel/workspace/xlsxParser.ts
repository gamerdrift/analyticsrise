/**
 * Excel Workspace — Native In-Browser XLSX Parser
 * Pure TypeScript OpenXML (.xlsx) extractor using native DecompressionStream.
 * Extracts workbook sheets, shared strings table, cell values, and formulas.
 */

import { ParsedWorkbook, WorkspaceSheet, WorkspaceCell } from './types';

/**
 * Converts Excel column string reference (e.g. "A", "Z", "AA") to 0-indexed column number
 */
export function colLetterToIndex(colStr: string): number {
  let index = 0;
  for (let i = 0; i < colStr.length; i++) {
    index = index * 26 + (colStr.charCodeAt(i) - 64);
  }
  return index - 1;
}

/**
 * Parses coordinate string like "A1" or "BC123" into 0-indexed { row, col }
 */
export function parseCellCoordinate(cellRef: string): { row: number; col: number } | null {
  const match = cellRef.match(/^([A-Z]+)([0-9]+)$/i);
  if (!match) return null;
  const colLetter = match[1].toUpperCase();
  const rowNumber = parseInt(match[2], 10);
  return {
    row: rowNumber - 1, // 0-indexed
    col: colLetterToIndex(colLetter),
  };
}

/**
 * Unzips an ArrayBuffer into a map of filename -> Uint8Array
 */
export async function unzipEntries(buffer: ArrayBuffer): Promise<Record<string, Uint8Array>> {
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);
  const files: Record<string, Uint8Array> = {};

  let offset = 0;
  const len = buffer.byteLength;

  while (offset + 30 <= len) {
    const sig = view.getUint32(offset, true);
    if (sig !== 0x04034b50) {
      // Not a local file header; break or advance to central directory
      break;
    }

    const method = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const uncompressedSize = view.getUint32(offset + 22, true);
    const fileNameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);

    const fileNameBytes = uint8.subarray(offset + 30, offset + 30 + fileNameLen);
    const fileName = new TextDecoder('utf-8').decode(fileNameBytes);

    const dataStart = offset + 30 + fileNameLen + extraLen;
    const dataEnd = dataStart + compressedSize;

    if (dataEnd > len) break;

    const compressedData = uint8.subarray(dataStart, dataEnd);

    if (method === 0) {
      // Stored (no compression)
      files[fileName] = compressedData;
    } else if (method === 8) {
      // Deflated compression
      try {
        if (typeof DecompressionStream !== 'undefined') {
          const ds = new DecompressionStream('deflate-raw');
          const writer = ds.writable.getWriter();
          // Write compressed slice
          writer.write(compressedData as any);
          writer.close();
          const reader = ds.readable.getReader();
          const chunks: Uint8Array[] = [];
          let totalBytes = 0;
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              totalBytes += value.length;
            }
          }
          const uncompressed = new Uint8Array(totalBytes);
          let pos = 0;
          for (const chunk of chunks) {
            uncompressed.set(chunk, pos);
            pos += chunk.length;
          }
          files[fileName] = uncompressed;
        } else {
          console.warn('DecompressionStream not supported in this environment');
        }
      } catch (err) {
        console.warn(`Failed to decompress file ${fileName}:`, err);
      }
    }

    offset = dataEnd;
  }

  return files;
}

/**
 * Extract shared strings from xl/sharedStrings.xml
 */
export function parseSharedStringsXml(xmlText: string): string[] {
  const strings: string[] = [];
  // Match each <si> ... </si> block
  const siRegex = /<si\b[^>]*>([\s\S]*?)<\/si>/gi;
  let siMatch;

  while ((siMatch = siRegex.exec(xmlText)) !== null) {
    const siContent = siMatch[1];
    // Extract all text inside <t>...</t> tags (including multi-run formatted text)
    const tRegex = /<t\b[^>]*>([\s\S]*?)<\/t>/gi;
    let tMatch;
    let fullText = '';

    while ((tMatch = tRegex.exec(siContent)) !== null) {
      // Replace XML entities
      const unescaped = tMatch[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      fullText += unescaped;
    }

    strings.push(fullText);
  }

  return strings;
}

/**
 * Extract sheet metadata from xl/workbook.xml
 */
export function parseWorkbookXml(xmlText: string): Array<{ name: string; sheetId: string; rId: string }> {
  const sheets: Array<{ name: string; sheetId: string; rId: string }> = [];
  const sheetTagRegex = /<sheet\b([^>]*)\/?>/gi;
  let match;

  while ((match = sheetTagRegex.exec(xmlText)) !== null) {
    const attrs = match[1];
    const nameMatch = attrs.match(/name="([^"]+)"/i);
    const sheetIdMatch = attrs.match(/sheetId="([^"]+)"/i);
    const rIdMatch = attrs.match(/r:id="([^"]+)"/i);

    const name = nameMatch ? nameMatch[1] : `Sheet${sheets.length + 1}`;
    const sheetId = sheetIdMatch ? sheetIdMatch[1] : String(sheets.length + 1);
    const rId = rIdMatch ? rIdMatch[1] : `rId${sheets.length + 1}`;

    sheets.push({ name, sheetId, rId });
  }

  return sheets;
}

/**
 * Parse worksheet XML (e.g. xl/worksheets/sheet1.xml) into a WorkspaceSheet model
 */
export function parseWorksheetXml(
  sheetXmlText: string,
  sheetId: string,
  sheetName: string,
  sharedStrings: string[]
): WorkspaceSheet {
  const cells: Record<string, WorkspaceCell> = {};
  let maxRow = 0;
  let maxCol = 0;

  // Match cell tags: <c r="A1" t="s"><f>...</f><v>0</v></c>
  const cellRegex = /<c\b([^>]*)>([\s\S]*?)<\/c>|<c\b([^>]*)\/>/gi;
  let match;

  while ((match = cellRegex.exec(sheetXmlText)) !== null) {
    const attrs = match[1] || match[3] || '';
    const body = match[2] || '';

    const refMatch = attrs.match(/r="([A-Z0-9]+)"/i);
    if (!refMatch) continue;

    const coord = parseCellCoordinate(refMatch[1]);
    if (!coord) continue;

    const { row, col } = coord;
    maxRow = Math.max(maxRow, row);
    maxCol = Math.max(maxCol, col);

    const typeMatch = attrs.match(/t="([a-z]+)"/i);
    const type = typeMatch ? typeMatch[1] : 'n'; // 's'=shared string, 'b'=boolean, 'str'=inline string, 'n'=numeric

    // Extract formula
    const fMatch = body.match(/<f\b[^>]*>([\s\S]*?)<\/f>/i);
    const formula = fMatch ? `=${fMatch[1]}` : undefined;

    // Extract value
    let cellValue: string | number | boolean | null = null;
    const vMatch = body.match(/<v\b[^>]*>([\s\S]*?)<\/v>/i);

    if (vMatch) {
      const rawVal = vMatch[1].trim();

      if (type === 's') {
        const strIdx = parseInt(rawVal, 10);
        cellValue = sharedStrings[strIdx] ?? '';
      } else if (type === 'b') {
        cellValue = rawVal === '1';
      } else if (type === 'str' || type === 'inlineStr') {
        cellValue = rawVal;
      } else {
        const num = Number(rawVal);
        cellValue = !isNaN(num) ? num : rawVal;
      }
    } else if (body.includes('<is>')) {
      const isMatch = body.match(/<t\b[^>]*>([\s\S]*?)<\/t>/i);
      cellValue = isMatch ? isMatch[1] : '';
    }

    if (cellValue !== null || formula) {
      cells[`${row},${col}`] = {
        address: { sheetId, row, col },
        value: cellValue,
        formula,
        formatting: row === 0 ? { bold: true } : undefined,
      };
    }
  }

  // Derive header names from row 0
  const headers: string[] = [];
  for (let c = 0; c <= maxCol; c++) {
    const headerCell = cells[`0,${c}`];
    const val = headerCell?.value;
    headers.push(val !== null && val !== undefined && String(val).trim().length > 0 ? String(val).trim() : `Col_${c + 1}`);
  }

  return {
    id: sheetId,
    name: sheetName,
    rows: Math.max(100, maxRow + 20),
    cols: Math.max(26, maxCol + 5),
    cells,
    headers,
  };
}

/**
 * Main parser entrypoint: Parses raw XLSX ArrayBuffer into a ParsedWorkbook
 */
export async function parseXlsxToWorkbook(
  buffer: ArrayBuffer,
  fileName: string,
  fileSizeBytes: number
): Promise<ParsedWorkbook> {
  const entries = await unzipEntries(buffer);
  const textDecoder = new TextDecoder('utf-8');

  // 1. Shared Strings
  let sharedStrings: string[] = [];
  if (entries['xl/sharedStrings.xml']) {
    const xml = textDecoder.decode(entries['xl/sharedStrings.xml']);
    sharedStrings = parseSharedStringsXml(xml);
  }

  // 2. Workbook sheet metadata
  let sheetMeta: Array<{ name: string; sheetId: string; rId: string }> = [];
  if (entries['xl/workbook.xml']) {
    const xml = textDecoder.decode(entries['xl/workbook.xml']);
    sheetMeta = parseWorkbookXml(xml);
  }

  // Fallback if workbook.xml is missing or empty
  if (sheetMeta.length === 0) {
    sheetMeta = [{ name: 'Sheet1', sheetId: '1', rId: 'rId1' }];
  }

  const sheets: Record<string, WorkspaceSheet> = {};
  const sheetOrder: string[] = [];

  // 3. Parse individual worksheets
  for (let i = 0; i < sheetMeta.length; i++) {
    const meta = sheetMeta[i];
    const sheetId = `sheet_${meta.sheetId}`;
    sheetOrder.push(sheetId);

    // Try canonical paths
    const sheetPath = `xl/worksheets/sheet${meta.sheetId}.xml`;
    const fallbackPath = `xl/worksheets/sheet${i + 1}.xml`;
    const sheetBytes = entries[sheetPath] || entries[fallbackPath];

    if (sheetBytes) {
      const xml = textDecoder.decode(sheetBytes);
      sheets[sheetId] = parseWorksheetXml(xml, sheetId, meta.name, sharedStrings);
    } else {
      // Empty placeholder sheet if xml not found
      sheets[sheetId] = {
        id: sheetId,
        name: meta.name,
        rows: 100,
        cols: 26,
        cells: {},
        headers: [],
      };
    }
  }

  const activeSheetId = sheetOrder[0] || 'sheet_1';

  return {
    fileName,
    fileSizeBytes,
    sheets,
    sheetOrder,
    activeSheetId,
    createdAt: Date.now(),
  };
}
