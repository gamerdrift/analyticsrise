import {
  adaptExcelWorkspaceContext,
  colToLetter,
  toCellCoordinate,
  detectFormulaError,
} from '../lib/ai/eva/context/excelWorkspace';
import { applyPrivacyShield, sanitizeCellValue } from '../lib/ai/eva/context/privacy';
import { sanitizeExcelWorkspaceContext } from '../lib/ai/eva/context/sanitizer';
import { buildExcelWorkspaceSystemPrompt } from '../lib/ai/eva/prompts/excelWorkspace';
import { IntelligentFallbackProvider } from '../lib/ai/eva/providers/intelligentFallback';
import { AiEvaClient } from '../lib/ai/eva/aiEvaClient';
import { ExcelWorkspaceState } from '../app/excel-workspace/contexts/ExcelWorkspaceContext';
import { ParsedWorkbook } from '../lib/excel/workspace/types';
import { AI_EVA_LIMITS } from '../lib/ai/eva/limits';

describe('AI-EVA Excel Workspace Intelligence Suite (Mission 09)', () => {
  const mockWorkbook: ParsedWorkbook = {
    fileName: 'sales_q1_2026.xlsx',
    fileSizeBytes: 24000,
    sheets: {
      sheet_1: {
        id: 'sheet_1',
        name: 'Q1 Performance',
        rows: 100,
        cols: 6,
        headers: ['Region', 'Rep', 'Date', 'Revenue', 'Cost', 'Status'],
        cells: {
          '0,0': { address: { sheetId: 'sheet_1', row: 0, col: 0 }, value: 'North' },
          '1,3': { address: { sheetId: 'sheet_1', row: 1, col: 3 }, value: 45000 },
          '2,3': { address: { sheetId: 'sheet_1', row: 2, col: 3 }, value: '#VALUE!', formula: '=SUM(Revenue, "invalid")' },
        },
      },
    },
    sheetOrder: ['sheet_1'],
    activeSheetId: 'sheet_1',
    createdAt: Date.now(),
  };

  const mockState: Partial<ExcelWorkspaceState> = {
    workbook: mockWorkbook,
    activeSheetId: 'sheet_1',
    selectedCell: { sheetId: 'sheet_1', row: 2, col: 3 },
    profile: {
      fileName: 'sales_q1_2026.xlsx',
      fileSizeBytes: 24000,
      sheetCount: 1,
      totalCellCount: 600,
      totalFormulaCount: 1,
      sheetProfiles: {
        sheet_1: {
          sheetId: 'sheet_1',
          sheetName: 'Q1 Performance',
          rowCount: 100,
          colCount: 6,
          populatedCellCount: 595,
          formulaCount: 1,
          estimatedMemoryBytes: 15000,
          duplicateHeaders: [],
          blankColumns: [],
          columns: [
            { colIndex: 0, header: 'Region', inferredType: 'TEXT', nonEmptyCount: 100, nullCount: 0, nullRatio: 0, uniqueCount: 4, sampleValues: ['North', 'South'] },
            { colIndex: 1, header: 'Rep', inferredType: 'TEXT', nonEmptyCount: 100, nullCount: 0, nullRatio: 0, uniqueCount: 12, sampleValues: ['Elena', 'Marcus'] },
            { colIndex: 2, header: 'Date', inferredType: 'DATE', nonEmptyCount: 100, nullCount: 0, nullRatio: 0, uniqueCount: 90, sampleValues: ['2026-01-01'] },
            { colIndex: 3, header: 'Revenue', inferredType: 'DECIMAL', nonEmptyCount: 95, nullCount: 5, nullRatio: 0.05, uniqueCount: 80, sampleValues: ['45000', '32000'] },
            { colIndex: 4, header: 'Cost', inferredType: 'DECIMAL', nonEmptyCount: 100, nullCount: 0, nullRatio: 0, uniqueCount: 75, sampleValues: ['20000', '15000'] },
            { colIndex: 5, header: 'Status', inferredType: 'TEXT', nonEmptyCount: 100, nullCount: 0, nullRatio: 0, uniqueCount: 2, sampleValues: ['Active', 'Closed'] },
          ],
        },
      },
      qualityWarnings: ['Column "Revenue" contains 5 missing values (5.0%).'],
    },
    isSampleShared: false,
  };


  describe('1. Cell Coordinates & Error Detection Utilities', () => {
    test('converts column indices to letters accurately', () => {
      expect(colToLetter(0)).toBe('A');
      expect(colToLetter(25)).toBe('Z');
      expect(colToLetter(26)).toBe('AA');
      expect(colToLetter(27)).toBe('AB');
    });

    test('generates standard cell coordinates', () => {
      expect(toCellCoordinate(0, 0)).toBe('A1');
      expect(toCellCoordinate(11, 6)).toBe('G12');
      expect(toCellCoordinate(99, 25)).toBe('Z100');
    });

    test('detects all standard Excel error signatures', () => {
      expect(detectFormulaError('#VALUE!')).toBe('#VALUE!');
      expect(detectFormulaError('#REF!')).toBe('#REF!');
      expect(detectFormulaError('#DIV/0!')).toBe('#DIV/0!');
      expect(detectFormulaError('#NAME?')).toBe('#NAME?');
      expect(detectFormulaError('#N/A')).toBe('#N/A');
      expect(detectFormulaError(12345)).toBeUndefined();
      expect(detectFormulaError('Valid Text')).toBeUndefined();
    });
  });

  describe('2. Context Privacy & Level Boundaries', () => {
    test('Level 1 (Metadata): Does NOT contain raw row dataset records', () => {
      const context = adaptExcelWorkspaceContext(mockState);
      expect(context).toBeDefined();
      expect(context?.workbookName).toBe('sales_q1_2026.xlsx');
      expect(context?.activeSheetName).toBe('Q1 Performance');
      expect(context?.rowCount).toBe(100);
      expect(context?.colCount).toBe(6);
      expect(context?.privacyLevel).toBe('formula'); // Selected cell has formula
      expect(context?.approvedSample).toBeUndefined(); // No sample approved
    });

    test('Level 2 (Approved Sample): Excluded when user has not approved sharing', () => {
      const unapprovedContext = applyPrivacyShield({
        workbookName: 'test.xlsx',
        sheetCount: 1,
        sheetNames: ['Sheet1'],
        activeSheetName: 'Sheet1',
        rowCount: 50,
        colCount: 4,
        columns: [],
        privacyLevel: 'metadata',
        approvedSample: {
          cellRange: 'A1:B2',
          rowCount: 2,
          colCount: 2,
          headers: ['A', 'B'],
          rows: [['val1', 'val2']],
          userApproved: false, // Not approved!
          timestamp: '2026-08-21T00:00:00Z',
        },
      });

      expect(unapprovedContext.approvedSample).toBeUndefined();
      expect(unapprovedContext.privacyLevel).toBe('metadata');
    });

    test('Level 2 (Approved Sample): Bounds row/column dimensions and redacts credentials', () => {
      const largeRows = Array.from({ length: 50 }, (_, i) => [
        `row_${i}`,
        `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jV_6P_wEw5Y`,
        `password = secret123`,
        45000,
      ]);

      const approvedContext = applyPrivacyShield({
        workbookName: 'secure.xlsx',
        sheetCount: 1,
        sheetNames: ['Sheet1'],
        activeSheetName: 'Sheet1',
        rowCount: 50,
        colCount: 4,
        columns: [],
        privacyLevel: 'approved_sample',
        approvedSample: {
          cellRange: 'A1:D50',
          rowCount: 50,
          colCount: 4,
          headers: ['Name', 'Token', 'Password', 'Amount'],
          rows: largeRows,
          userApproved: true,
          timestamp: '2026-08-21T00:00:00Z',
        },
      });

      expect(approvedContext.approvedSample).toBeDefined();
      expect(approvedContext.approvedSample?.rows.length).toBeLessThanOrEqual(AI_EVA_LIMITS.MAX_APPROVED_SAMPLE_ROWS);
      expect(approvedContext.approvedSample?.rows[0][1]).toBe('[REDACTED_CREDENTIAL]');
      expect(approvedContext.approvedSample?.rows[0][2]).toBe('[REDACTED_CREDENTIAL]');
      expect(approvedContext.privacyLevel).toBe('approved_sample');
    });

    test('Level 3 (Formula Context): Extracts cell address and error safely', () => {
      const context = adaptExcelWorkspaceContext(mockState);
      expect(context?.activeFormula).toBeDefined();
      expect(context?.activeFormula?.cellAddress).toBe('D3'); // row 2, col 3 -> D3
      expect(context?.activeFormula?.errorState).toBe('#VALUE!');
    });
  });

  describe('3. Prompt Generator & Untrusted Content Demarcation', () => {
    test('builds structured prompt with Excel persona and safe metadata', () => {
      const context = adaptExcelWorkspaceContext(mockState);
      const prompt = buildExcelWorkspaceSystemPrompt(context);

      expect(prompt).toContain('ENVIRONMENT: EXCEL WORKSPACE');
      expect(prompt).toContain('sales_q1_2026.xlsx');
      expect(prompt).toContain('Q1 Performance');
      expect(prompt).toContain('`Region` (Type: TEXT)');
      expect(prompt).toContain('`Revenue` (Type: DECIMAL');
      expect(prompt).toContain('Column "Revenue" contains 5 missing values');
      expect(prompt).toContain('ACTIVE FORMULA IN CELL D3:');
      expect(prompt).toContain('#VALUE!');

    });
  });

  describe('4. Intelligent In-Browser Fallback Engine for Excel', () => {
    const provider = new IntelligentFallbackProvider();

    test('diagnoses #VALUE! formula error accurately', async () => {
      const context = adaptExcelWorkspaceContext(mockState);
      const response = await provider.generateResponse({
        userQuestion: 'Why am I getting #VALUE! in this cell?',
        messages: [],
        context: {
          product: 'excel-workspace',
          excelContext: context,
        },
      });

      expect(response.content).toContain('Diagnosing `#VALUE!`');
      expect(response.content).toContain('data type mismatch');
      expect(response.codeSnippet).toBeDefined();
    });

    test('explains XLOOKUP formula concept and syntax', async () => {
      const response = await provider.generateResponse({
        userQuestion: 'How does XLOOKUP work?',
        messages: [],
        context: {
          product: 'excel-workspace',
        },
      });

      expect(response.content).toContain('Understanding `XLOOKUP`');
      expect(response.content).toContain('lookup_value');
      expect(response.codeSnippet).toContain('XLOOKUP');
    });

    test('provides data cleaning guidance from profiler warnings', async () => {
      const context = adaptExcelWorkspaceContext(mockState);
      const response = await provider.generateResponse({
        userQuestion: 'Check data quality for this sheet',
        messages: [],
        context: {
          product: 'excel-workspace',
          excelContext: context,
        },
      });

      expect(response.content).toContain('Data Quality Profile');
      expect(response.content).toContain('missing values');
      expect(response.content).toContain('Recommended Cleaning Actions');
    });

    test('generates analytical insights tailored to sheet columns', async () => {
      const context = adaptExcelWorkspaceContext(mockState);
      const response = await provider.generateResponse({
        userQuestion: 'What can I analyze with this data?',
        messages: [],
        context: {
          product: 'excel-workspace',
          excelContext: context,
        },
      });

      expect(response.content).toContain('Analytical Opportunities');
      expect(response.content).toContain('Time Series Trend');
      expect(response.content).toContain('Segment Performance');
    });

    test('recommends chart types based on column types (Date + Revenue -> Line Chart)', async () => {
      const context = adaptExcelWorkspaceContext(mockState);
      const response = await provider.generateResponse({
        userQuestion: 'Suggest a chart for this sheet',
        messages: [],
        context: {
          product: 'excel-workspace',
          excelContext: context,
        },
      });

      expect(response.content).toContain('Visualization Recommendations');
      expect(response.content).toContain('Line Chart');
      expect(response.content).toContain('Bar / Column Chart');
    });
  });

  describe('5. Client Proxy Integration', () => {
    test('AiEvaClient dispatches Excel Workspace requests smoothly', async () => {
      const client = new AiEvaClient();
      client.setForceFallbackMode(true);

      const context = adaptExcelWorkspaceContext(mockState);
      const response = await client.sendMessage(
        'What can I analyze?',
        [],
        {
          product: 'excel-workspace',
          workspaceType: 'excel_workspace',
          excelContext: context,
        },
        false
      );

      expect(response).toBeDefined();
      expect(response.content).toContain('Analytical Opportunities');
      expect(response.id).toContain('eva_excel_');
    });
  });

  describe('6. Regression: SQL Studio AI-EVA Unaffected', () => {
    const provider = new IntelligentFallbackProvider();

    test('SQL Studio requests continue to receive SQL specialized assistance', async () => {
      const response = await provider.generateResponse({
        userQuestion: 'What is the difference between LEFT JOIN and INNER JOIN?',
        messages: [],
        context: {
          product: 'sql-studio',
          activeSchema: 'ecommerce',
        },
      });

      expect(response.content).toContain('Understanding SQL JOINs');
      expect(response.content).toContain('INNER JOIN');
      expect(response.codeSnippet).toContain('LEFT JOIN');
    });
  });
});
