import {
  detectDelimiter,
  parseRawDelimitedLines,
  parseCsvToWorkbook,
} from '@/lib/excel/workspace/csvWorkbookParser';
import {
  colLetterToIndex,
  parseCellCoordinate,
  parseSharedStringsXml,
  parseWorkbookXml,
  parseWorksheetXml,
} from '@/lib/excel/workspace/xlsxParser';
import {
  inferTypeFromValues,
  profileWorksheet,
  profileWorkbook,
} from '@/lib/excel/workspace/workbookProfiler';
import {
  validateWorkbookFileSize,
  validateWorkbookDimensions,
  validateExcelProjectLimit,
  EXCEL_WORKSPACE_LIMITS,
} from '@/lib/excel/workspace/limits';
import {
  saveExcelProject,
  listExcelProjects,
  loadExcelProject,
  deleteExcelProject,
} from '@/lib/excel/workspace/projectStorage';
import {
  formatWorksheetAsCsv,
  formatWorksheetAsTsv,
} from '@/lib/excel/workspace/exporter';
import { AnalyticsService } from '@/lib/services/analytics';
import { ParsedWorkbook, ExcelWorkspaceProject } from '@/lib/excel/workspace/types';

describe('Excel Workspace MVP Test Suite', () => {
  // ==========================================================================
  // 1. CSV & Delimited Text Parsing
  // ==========================================================================
  describe('CSV & Delimited Text Ingestion', () => {
    it('detects comma, tab, and semicolon delimiters accurately', () => {
      const commaText = 'name,age,city\nAlice,30,NY\nBob,25,LA';
      const tabText = 'name\tage\tcity\nAlice\t30\tNY\nBob\t25\tLA';
      const semiText = 'name;age;city\nAlice;30;NY\nBob;25;LA';

      expect(detectDelimiter(commaText)).toBe(',');
      expect(detectDelimiter(tabText)).toBe('\t');
      expect(detectDelimiter(semiText)).toBe(';');
    });

    it('parses raw delimited lines handling quotes and newlines', () => {
      const csv = 'item,description,price\nWidget,"High quality, durable",49.99\n"Gadget ""Pro""",Standard,99.00';
      const rows = parseRawDelimitedLines(csv, ',');

      expect(rows.length).toBe(3);
      expect(rows[0]).toEqual(['item', 'description', 'price']);
      expect(rows[1]).toEqual(['Widget', 'High quality, durable', '49.99']);
      expect(rows[2]).toEqual(['Gadget "Pro"', 'Standard', '99.00']);
    });

    it('transforms CSV text into a structured ParsedWorkbook', () => {
      const csv = 'Region,Units,Revenue,Target\nNorth,100,25000,=SUM(B2*250)\nSouth,80,20000,20000';
      const wb = parseCsvToWorkbook(csv, 'sales.csv', csv.length);

      expect(wb.fileName).toBe('sales.csv');
      expect(wb.sheetOrder.length).toBe(1);
      const sheet = wb.sheets[wb.activeSheetId];
      expect(sheet).toBeDefined();
      expect(sheet.headers).toEqual(['Region', 'Units', 'Revenue', 'Target']);

      // Check cell values
      const cell00 = sheet.cells['0,0'];
      expect(cell00.value).toBe('Region');
      expect(cell00.formatting?.bold).toBe(true);

      const cell11 = sheet.cells['1,1'];
      expect(cell11.value).toBe(100);

      const cell13 = sheet.cells['1,3'];
      expect(cell13.formula).toBe('=SUM(B2*250)');
    });
  });

  // ==========================================================================
  // 2. OpenXML XLSX Parsing Subsystems
  // ==========================================================================
  describe('XLSX Parser Subsystems', () => {
    it('converts column letter notations to 0-indexed integers', () => {
      expect(colLetterToIndex('A')).toBe(0);
      expect(colLetterToIndex('B')).toBe(1);
      expect(colLetterToIndex('Z')).toBe(25);
      expect(colLetterToIndex('AA')).toBe(26);
      expect(colLetterToIndex('AB')).toBe(27);
    });

    it('parses cell coordinate strings into row and col coordinates', () => {
      expect(parseCellCoordinate('A1')).toEqual({ row: 0, col: 0 });
      expect(parseCellCoordinate('C10')).toEqual({ row: 9, col: 2 });
      expect(parseCellCoordinate('AA100')).toEqual({ row: 99, col: 26 });
      expect(parseCellCoordinate('invalid')).toBeNull();
    });

    it('parses shared strings XML with entity unescaping', () => {
      const xml = `
        <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="3">
          <si><t>Revenue &amp; Margin</t></si>
          <si><t>&lt;Quarter 1&gt;</t></si>
          <si><r><t>Formatted </t></r><r><t>Run</t></r></si>
        </sst>
      `;
      const strings = parseSharedStringsXml(xml);
      expect(strings.length).toBe(3);
      expect(strings[0]).toBe('Revenue & Margin');
      expect(strings[1]).toBe('<Quarter 1>');
      expect(strings[2]).toBe('Formatted Run');
    });

    it('parses workbook XML sheet metadata', () => {
      const xml = `
        <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
          <sheets>
            <sheet name="Sales Summary" sheetId="1" r:id="rId1"/>
            <sheet name="Customers" sheetId="2" r:id="rId2"/>
          </sheets>
        </workbook>
      `;
      const sheets = parseWorkbookXml(xml);
      expect(sheets.length).toBe(2);
      expect(sheets[0]).toEqual({ name: 'Sales Summary', sheetId: '1', rId: 'rId1' });
      expect(sheets[1]).toEqual({ name: 'Customers', sheetId: '2', rId: 'rId2' });
    });

    it('parses worksheet XML into a WorkspaceSheet model', () => {
      const sharedStrings = ['Sales', 'North', 'South'];
      const sheetXml = `
        <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
          <sheetData>
            <row r="1">
              <c r="A1" t="s"><v>0</v></c>
              <c r="B1"><v>5000</v></c>
            </row>
            <row r="2">
              <c r="A2" t="s"><v>1</v></c>
              <c r="B2"><f>SUM(B1*2)</f><v>10000</v></c>
            </row>
          </sheetData>
        </worksheet>
      `;

      const sheet = parseWorksheetXml(sheetXml, 'sheet_1', 'Summary', sharedStrings);
      expect(sheet.id).toBe('sheet_1');
      expect(sheet.name).toBe('Summary');
      expect(sheet.headers[0]).toBe('Sales');
      expect(sheet.headers[1]).toBe('5000');

      expect(sheet.cells['0,0'].value).toBe('Sales');
      expect(sheet.cells['0,1'].value).toBe(5000);
      expect(sheet.cells['1,0'].value).toBe('North');
      expect(sheet.cells['1,1'].formula).toBe('=SUM(B1*2)');
    });
  });

  // ==========================================================================
  // 3. Statistical Profiling & Data Quality Warnings
  // ==========================================================================
  describe('Statistical Profiling', () => {
    it('infers data types accurately from sample values', () => {
      expect(inferTypeFromValues([1, 2, 3])).toBe('INTEGER');
      expect(inferTypeFromValues([1.5, 2.75, 3.14])).toBe('DECIMAL');
      expect(inferTypeFromValues(['2026-01-01', '2026-02-15'])).toBe('DATE');
      expect(inferTypeFromValues([true, false, true])).toBe('BOOLEAN');
      expect(inferTypeFromValues(['Alpha', 'Beta', 'Gamma'])).toBe('TEXT');
      expect(inferTypeFromValues([])).toBe('EMPTY');
    });

    it('generates worksheet and workbook quality profiles', () => {
      const csv = 'ID,Score,Score,Notes\n1,100,100,Good\n2,200,200,\n3,300,300,';
      const wb = parseCsvToWorkbook(csv, 'test.csv', csv.length);
      const profile = profileWorkbook(wb);

      expect(profile.sheetCount).toBe(1);
      expect(profile.totalCellCount).toBeGreaterThan(0);
      expect(profile.qualityWarnings.some((w) => w.includes('duplicate headers'))).toBe(true);
    });
  });

  // ==========================================================================
  // 4. Centralized Limits & Tier Safety
  // ==========================================================================
  describe('Limits & Tier Safety', () => {
    it('validates file size within Free and Pro tiers', () => {
      const validFree = validateWorkbookFileSize(4 * 1024 * 1024, 'free');
      expect(validFree.valid).toBe(true);

      const invalidFree = validateWorkbookFileSize(6 * 1024 * 1024, 'free');
      expect(invalidFree.valid).toBe(false);
      expect(invalidFree.requiresUpgrade).toBe(true);

      const validPro = validateWorkbookFileSize(20 * 1024 * 1024, 'pro');
      expect(validPro.valid).toBe(true);
    });

    it('validates sheet count and row limits', () => {
      const validDims = validateWorkbookDimensions(2, 5000, 20, 'free');
      expect(validDims.valid).toBe(true);

      const excessSheets = validateWorkbookDimensions(5, 5000, 20, 'free');
      expect(excessSheets.valid).toBe(false);
      expect(excessSheets.limitExceeded?.type).toBe('SHEET_COUNT');

      const excessRows = validateWorkbookDimensions(1, 25000, 20, 'free');
      expect(excessRows.valid).toBe(false);
      expect(excessRows.limitExceeded?.type).toBe('ROW_COUNT');
    });

    it('validates project saved limits', () => {
      expect(validateExcelProjectLimit(0, 'free').valid).toBe(true);
      expect(validateExcelProjectLimit(1, 'free').valid).toBe(false);
      expect(validateExcelProjectLimit(5, 'pro').valid).toBe(true);
    });
  });

  // ==========================================================================
  // 5. Local Storage Project Persistence
  // ==========================================================================
  describe('Project Persistence', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('saves, lists, loads, and deletes projects with user isolation', () => {
      const csv = 'ColA,ColB\n1,2';
      const wb = parseCsvToWorkbook(csv, 'project.csv', csv.length);

      const project: ExcelWorkspaceProject = {
        projectId: 'proj_test_1',
        projectName: 'PROJECT 1',
        fileName: 'project.csv',
        fileSizeBytes: 100,
        workbook: wb,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: 1,
      };

      const saved = saveExcelProject(project, 'user_123');
      expect(saved).toBe(true);

      const list = listExcelProjects('user_123');
      expect(list.length).toBe(1);
      expect(list[0].projectName).toBe('PROJECT 1');

      // Guest isolation check
      expect(listExcelProjects('guest').length).toBe(0);

      const loaded = loadExcelProject('proj_test_1', 'user_123');
      expect(loaded).toBeDefined();
      expect(loaded?.projectName).toBe('PROJECT 1');

      const deleted = deleteExcelProject('proj_test_1', 'user_123');
      expect(deleted).toBe(true);
      expect(listExcelProjects('user_123').length).toBe(0);
    });
  });

  // ==========================================================================
  // 6. Exporter Formatting
  // ==========================================================================
  describe('Exporter Formatting', () => {
    it('formats active sheet cells as standard RFC-4180 CSV with quotes escaping', () => {
      const csv = 'Name,Title,Salary\nJohn Doe,"Senior Analyst, Lead",95000\nJane Doe,Director,130000';
      const wb = parseCsvToWorkbook(csv, 'employees.csv', csv.length);
      const sheet = wb.sheets[wb.activeSheetId];

      const exportedCsv = formatWorksheetAsCsv(sheet);
      expect(exportedCsv).toContain('Name,Title,Salary');
      expect(exportedCsv).toContain('"Senior Analyst, Lead"');
      expect(exportedCsv).toContain('95000');
    });

    it('formats active sheet cells as TSV', () => {
      const csv = 'A,B\n1,2';
      const wb = parseCsvToWorkbook(csv, 'test.csv', csv.length);
      const sheet = wb.sheets[wb.activeSheetId];

      const exportedTsv = formatWorksheetAsTsv(sheet);
      expect(exportedTsv).toContain('A\tB');
      expect(exportedTsv).toContain('1\t2');
    });
  });

  // ==========================================================================
  // 7. Telemetry & Analytics
  // ==========================================================================
  describe('Telemetry & Analytics', () => {
    it('executes all Excel Workspace analytics log methods without throwing', () => {
      expect(() => {
        AnalyticsService.logExcelWorkspaceOpened();
        AnalyticsService.logExcelWorkspaceUploadStarted(1024);
        AnalyticsService.logExcelWorkspaceUploadCompleted('test.xlsx', 1, 100, 10);
        AnalyticsService.logExcelWorkspaceDatasetRejected('file_size_exceeded');
        AnalyticsService.logExcelWorkspaceFormulaEvaluated('=SUM(A1:A10)');
        AnalyticsService.logExcelWorkspaceProjectSaved('proj_1');
        AnalyticsService.logExcelWorkspaceExported('csv', 100);
      }).not.toThrow();
    });
  });
});
