/**
 * AnalyticsRise SQL Workspace MVP — Unit & Integration Test Suite
 * 
 * Verifies CSV parsing, type inference, profiling, table synthesis,
 * SQL execution on user data, limits, export, and persistence.
 */

import { parseCsvText, parseCsvLine, detectDelimiter, sanitizeColumnIdentifier } from '../lib/sql/workspace/csvParser';
import { inferValueType, inferColumnType, castValueToEngineType } from '../lib/sql/workspace/typeInference';
import { profileDataset } from '../lib/sql/workspace/dataProfiler';
import { generateSqlTable, sanitizeTableName } from '../lib/sql/workspace/tableGenerator';
import { validateFileSize, validateDatasetDimensions, validateProjectLimit, WORKSPACE_LIMITS } from '../lib/sql/workspace/limits';
import { formatQueryResultAsCsv } from '../lib/sql/workspace/exporter';
import { saveProject, loadProject, listProjects, deleteProject } from '../lib/sql/workspace/projectStorage';
import { executeSql } from '../lib/sql/engine';
import { AnalyticsService } from '../lib/services/analytics';


describe('SQL Workspace Engine & Pipeline', () => {
  // 1. CSV Parser & Delimiter Detection
  describe('1. CSV Parsing & Normalization', () => {
    test('parses simple comma-separated CSV with standard headers', () => {
      const csv = `id,name,age\n1,Alice,30\n2,Bob,25`;
      const result = parseCsvText(csv);
      expect(result.headers).toEqual(['id', 'name', 'age']);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual(['1', 'Alice', '30']);
      expect(result.rows[1]).toEqual(['2', 'Bob', '25']);
    });

    test('handles quoted fields with commas and escaped quotes', () => {
      const csv = `product_id,description,price\n101,"Widget, Super ""Deluxe""",99.99\n102,"Standard Gadget",49.50`;
      const result = parseCsvText(csv);
      expect(result.rows[0][1]).toBe('Widget, Super "Deluxe"');
      expect(result.rows[1][1]).toBe('Standard Gadget');
    });

    test('detects tab delimiter correctly', () => {
      const tsv = `order_id\tcustomer\ttotal\n1001\tAcme Corp\t5000\n1002\tGlobex\t7500`;
      const delimiter = detectDelimiter(tsv);
      expect(delimiter).toBe('\t');
      const result = parseCsvText(tsv);
      expect(result.headers).toEqual(['order_id', 'customer', 'total']);
      expect(result.rows).toHaveLength(2);
    });

    test('handles empty CSV input safely', () => {
      const result = parseCsvText('');
      expect(result.headers).toHaveLength(0);
      expect(result.rows).toHaveLength(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('sanitizes special characters in column names and deduplicates', () => {
      const csv = `Customer ID,Total ($),Date,Customer ID\n1,100,2024-01-01,1`;
      const result = parseCsvText(csv);
      expect(result.headers[0]).toBe('customer_id');
      expect(result.headers[1]).toBe('total');
      expect(result.headers[2]).toBe('date');
      expect(result.headers[3]).toBe('customer_id_2');
      expect(result.duplicateHeaders).toContain('Customer ID');
    });

    test('normalizes ragged rows with missing trailing columns', () => {
      const csv = `a,b,c\n1,2\n3,4,5`;
      const result = parseCsvText(csv);
      expect(result.rows[0]).toEqual(['1', '2', '']);
      expect(result.rows[1]).toEqual(['3', '4', '5']);
    });
  });

  // 2. Type Inference Engine
  describe('2. Conservative Type Inference', () => {
    test('infers INTEGER for purely numeric integer columns', () => {
      const values = ['10', '-5', '42', '1000', ''];
      const { inferredType, engineType, isMixed } = inferColumnType(values);
      expect(inferredType).toBe('INTEGER');
      expect(engineType).toBe('INTEGER');
      expect(isMixed).toBe(false);
    });

    test('infers DECIMAL for float / currency columns', () => {
      const values = ['19.99', '100.50', '-4.25', '0.00'];
      const { inferredType, engineType } = inferColumnType(values);
      expect(inferredType).toBe('DECIMAL');
      expect(engineType).toBe('DECIMAL');
    });

    test('infers BOOLEAN for boolean string values', () => {
      const values = ['true', 'false', 'True', 'False', 'yes', 'no'];
      const { inferredType, engineType } = inferColumnType(values);
      expect(inferredType).toBe('BOOLEAN');
      expect(engineType).toBe('BOOLEAN');
    });

    test('infers DATE for ISO date formatted strings', () => {
      const values = ['2024-01-15', '2024-02-20', '2024-03-01'];
      const { inferredType } = inferColumnType(values);
      expect(inferredType).toBe('DATE');
    });

    test('falls back conservatively to TEXT when types are mixed', () => {
      const values = ['100', 'Active', '200', 'N/A'];
      const { inferredType, engineType, isMixed } = inferColumnType(values);
      expect(inferredType).toBe('TEXT');
      expect(engineType).toBe('TEXT');
      expect(isMixed).toBe(true);
    });

    test('casts values properly to engine runtime representations', () => {
      expect(castValueToEngineType('42', 'INTEGER')).toBe(42);
      expect(castValueToEngineType('19.95', 'DECIMAL')).toBe(19.95);
      expect(castValueToEngineType('true', 'BOOLEAN')).toBe(true);
      expect(castValueToEngineType('false', 'BOOLEAN')).toBe(false);
      expect(castValueToEngineType('null', 'INTEGER')).toBeNull();
      expect(castValueToEngineType('', 'TEXT')).toBeNull();
    });
  });

  // 3. Data Profiling & Table Synthesis
  describe('3. Profiling & In-Memory Table Generation', () => {
    test('profiles columns and computes stats for numeric columns', () => {
      const csv = `id,name,score\n1,Alpha,80\n2,Beta,90\n3,Gamma,70`;
      const raw = parseCsvText(csv);
      const { profiles, qualityReport } = profileDataset(raw, 'test_data.csv', 100);

      expect(profiles).toHaveLength(3);
      expect(profiles[2].name).toBe('score');
      expect(profiles[2].numericStats).toBeDefined();
      expect(profiles[2].numericStats?.min).toBe(70);
      expect(profiles[2].numericStats?.max).toBe(90);
      expect(profiles[2].numericStats?.avg).toBe(80);
      expect(qualityReport.rowCount).toBe(3);
      expect(qualityReport.columnCount).toBe(3);
    });

    test('generates valid in-memory SQL Database structure', () => {
      const csv = `customer_id,city,revenue\n101,London,500\n102,Tokyo,1200\n103,Paris,800`;
      const raw = parseCsvText(csv);
      const { profiles, qualityReport } = profileDataset(raw, 'customers_q1.csv', 150);
      const parsed = generateSqlTable(raw, profiles, qualityReport, 'customers_q1.csv', 150);

      expect(parsed.tableName).toBe('customers_q1');
      expect(parsed.database.tables['customers_q1']).toBeDefined();
      expect(parsed.database.tables['customers_q1'].columns).toHaveLength(3);
      expect(parsed.database.tables['customers_q1'].rows).toHaveLength(3);
      expect(parsed.database.tables['customers_q1'].rows[0].revenue).toBe(500);
    });
  });

  // 4. End-to-End SQL Query Execution on Uploaded Dataset
  describe('4. In-Browser SQL Execution on User Dataset', () => {
    const csv = `employee_id,dept,salary,active\n1,Engineering,120000,true\n2,Marketing,85000,true\n3,Engineering,140000,true\n4,Sales,95000,false\n5,Marketing,90000,true`;
    const raw = parseCsvText(csv);
    const { profiles, qualityReport } = profileDataset(raw, 'employees.csv', 200);
    const parsed = generateSqlTable(raw, profiles, qualityReport, 'employees.csv', 200);

    test('executes SELECT * with LIMIT on user table', () => {
      const sql = `SELECT * FROM employees LIMIT 2;`;
      const res = executeSql(sql, parsed.database);

      expect(res.rowCount).toBe(2);
      expect(res.columns).toContain('employee_id');
      expect(res.columns).toContain('dept');
      expect(res.columns).toContain('salary');
    });

    test('executes filtering with WHERE conditions', () => {
      const sql = `SELECT employee_id, salary FROM employees WHERE salary > 100000;`;
      const res = executeSql(sql, parsed.database);

      expect(res.rowCount).toBe(2);
      expect(res.rows[0][1]).toBe(120000);
      expect(res.rows[1][1]).toBe(140000);
    });

    test('executes GROUP BY aggregations (COUNT, AVG, SUM)', () => {
      const sql = `SELECT dept, COUNT(*) AS emp_count, AVG(salary) AS avg_sal\nFROM employees\nGROUP BY dept\nORDER BY avg_sal DESC;`;
      const res = executeSql(sql, parsed.database);

      expect(res.rowCount).toBe(3);
      expect(res.rows[0][0]).toBe('Engineering');
      expect(res.rows[0][1]).toBe(2);
      expect(res.rows[0][2]).toBe(130000);
    });

    test('returns descriptive error on invalid column query', () => {
      const sql = `SELECT non_existent_column FROM employees;`;
      expect(() => executeSql(sql, parsed.database)).toThrow();
    });

  });

  // 5. Limits & FinOps Validation
  describe('5. Dataset & Project Limits', () => {
    test('enforces free file size limit (2 MB)', () => {
      const validSize = 1.5 * 1024 * 1024;
      const oversized = 3.5 * 1024 * 1024;

      expect(validateFileSize(validSize, 'free').valid).toBe(true);
      const invalidRes = validateFileSize(oversized, 'free');
      expect(invalidRes.valid).toBe(false);
      expect(invalidRes.requiresUpgrade).toBe(true);
    });

    test('enforces free row count limit (25,000 rows)', () => {
      expect(validateDatasetDimensions(1000, 10, 'free').valid).toBe(true);
      const overflow = validateDatasetDimensions(30000, 10, 'free');
      expect(overflow.valid).toBe(false);
      expect(overflow.limitExceeded?.type).toBe('ROW_COUNT');
    });

    test('enforces free project limit (1 saved project)', () => {
      expect(validateProjectLimit(0, 'free').valid).toBe(true);
      const projectLimitRes = validateProjectLimit(1, 'free');
      expect(projectLimitRes.valid).toBe(false);
      expect(projectLimitRes.requiresUpgrade).toBe(true);
    });
  });

  // 6. CSV Result Export
  describe('6. Safe Result Exporting', () => {
    test('formats QueryResult to CSV with properly escaped commas and headers', () => {
      const result = {
        columns: ['id', 'company_name', 'valuation'],
        rows: [
          [1, 'Acme, Inc.', 1000000],
          [2, 'Globex "Worldwide"', 2500000],
        ],
        rowObjects: [],
        rowCount: 2,
        executionMs: 1.5,
        warnings: [],
      };

      const csv = formatQueryResultAsCsv(result, 1000);
      expect(csv).toContain('id,company_name,valuation');
      expect(csv).toContain('1,"Acme, Inc.",1000000');
      expect(csv).toContain('2,"Globex ""Worldwide""",2500000');
    });
  });

  // 7. Project Persistence & Isolation
  describe('7. Local Storage Project Persistence', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('saves, lists, loads, and deletes user-scoped project', () => {
      const project = {
        projectId: 'proj_test_1',
        projectName: 'Sales Q3 Analysis',
        tableName: 'sales_q3',
        rawFileName: 'sales.csv',
        fileSizeBytes: 1024,
        schema: [],
        savedQuery: 'SELECT * FROM sales_q3;',
        createdAt: 1000,
        updatedAt: 1000,
        version: 1,
      };

      // 1. Save
      const saved = saveProject(project, 'user_123');
      expect(saved).toBe(true);

      // 2. List
      const list = listProjects('user_123');
      expect(list).toHaveLength(1);
      expect(list[0].projectName).toBe('Sales Q3 Analysis');

      // 3. User isolation check: different user has empty list
      expect(listProjects('user_456')).toHaveLength(0);

      // 4. Load
      const loaded = loadProject('proj_test_1', 'user_123');
      expect(loaded).toBeDefined();
      expect(loaded?.savedQuery).toBe('SELECT * FROM sales_q3;');

      // 5. Delete
      const deleted = deleteProject('proj_test_1', 'user_123');
      expect(deleted).toBe(true);
      expect(listProjects('user_123')).toHaveLength(0);
    });
  });

  // 8. Analytics Lifecycle Events
  describe('8. Telemetry & Analytics Events', () => {
    test('AnalyticsService includes workspace event methods without throwing', () => {
      expect(() => AnalyticsService.logWorkspaceOpened()).not.toThrow();
      expect(() => AnalyticsService.logWorkspaceUploadStarted(5000)).not.toThrow();
      expect(() => AnalyticsService.logWorkspaceUploadCompleted('data.csv', 100, 5)).not.toThrow();
      expect(() => AnalyticsService.logWorkspaceQueryRun(10, 2.5)).not.toThrow();
      expect(() => AnalyticsService.logWorkspaceProjectSaved('proj_1')).not.toThrow();
      expect(() => AnalyticsService.logWorkspaceExported(10)).not.toThrow();
    });
  });

  // 9. Complete 15-Case CSV Upload Test Matrix (Mission 05B)
  describe('9. Complete CSV Upload Test Matrix (Cases A - O)', () => {
    test('Case A: Valid CSV', () => {
      const res = parseCsvText('id,name,age\n1,Alice,30\n2,Bob,25');
      expect(res.headers).toEqual(['id', 'name', 'age']);
      expect(res.rows).toHaveLength(2);
    });

    test('Case B: Valid TSV', () => {
      const res = parseCsvText('id\tname\tage\n1\tAlice\t30\n2\tBob\t25');
      expect(res.delimiter).toBe('\t');
      expect(res.headers).toEqual(['id', 'name', 'age']);
    });

    test('Case C: Semicolon-delimited file', () => {
      const res = parseCsvText('id;name;age\n1;Alice;30\n2;Bob;25');
      expect(res.delimiter).toBe(';');
      expect(res.headers).toEqual(['id', 'name', 'age']);
    });

    test('Case D: Pipe-delimited file', () => {
      const res = parseCsvText('id|name|age\n1|Alice|30\n2|Bob|25');
      expect(res.delimiter).toBe('|');
      expect(res.headers).toEqual(['id', 'name', 'age']);
    });

    test('Case E: Quoted values containing commas', () => {
      const res = parseCsvText('id,address\n1,"London, UK"\n2,"Paris, FR"');
      expect(res.rows[0][1]).toBe('London, UK');
      expect(res.rows[1][1]).toBe('Paris, FR');
    });

    test('Case F: Embedded quotes', () => {
      const res = parseCsvText('id,quote\n1,"He said ""Hello!"""');
      expect(res.rows[0][1]).toBe('He said "Hello!"');
    });

    test('Case G: Empty CSV', () => {
      const res = parseCsvText('');
      expect(res.headers).toHaveLength(0);
      expect(res.rows).toHaveLength(0);
    });

    test('Case H: Missing headers', () => {
      const res = parseCsvText(',,price\n1,Alpha,100');
      expect(res.headers).toEqual(['column_1', 'column_2', 'price']);
    });

    test('Case I: Duplicate headers', () => {
      const res = parseCsvText('id,val,id\n1,10,1');
      expect(res.headers).toEqual(['id', 'val', 'id_2']);
      expect(res.duplicateHeaders).toContain('id');
    });

    test('Case J: Mixed data types', () => {
      const { inferredType, isMixed } = inferColumnType(['100', 'Active', '200']);
      expect(inferredType).toBe('TEXT');
      expect(isMixed).toBe(true);
    });

    test('Case K: Null-heavy column', () => {
      const { inferredType, engineType } = inferColumnType(['100', '', 'null', 'nan']);
      expect(inferredType).toBe('INTEGER');
      expect(engineType).toBe('INTEGER');
    });

    test('Case L: Invalid / malformed ragged rows', () => {
      const res = parseCsvText('a,b,c\n1,2\n3,4,5,6,7');
      expect(res.rows[0]).toHaveLength(3);
      expect(res.rows[1]).toHaveLength(3);
    });

    test('Case M: File > 2 MB', () => {
      const res = validateFileSize(3 * 1024 * 1024, 'free');
      expect(res.valid).toBe(false);
      expect(res.requiresUpgrade).toBe(true);
    });

    test('Case N: File > 25,000 rows', () => {
      const res = validateDatasetDimensions(26000, 10, 'free');
      expect(res.valid).toBe(false);
      expect(res.limitExceeded?.type).toBe('ROW_COUNT');
    });

    test('Case O: File > 50 columns', () => {
      const res = validateDatasetDimensions(100, 55, 'free');
      expect(res.valid).toBe(false);
      expect(res.limitExceeded?.type).toBe('COLUMN_COUNT');
    });
  });

  // 10. Performance Benchmarks on Scaled Datasets (1k, 10k, 25k)
  describe('10. Scaled Performance Benchmarks', () => {
    const scales = [1000, 10000, 25000];

    scales.forEach((n) => {
      test(`Benchmarks dataset with ${n.toLocaleString()} rows`, () => {
        const lines = ['id,category,amount,active,date'];
        const categories = ['Electronics', 'Home', 'Apparel', 'Automotive', 'Books'];
        for (let i = 1; i <= n; i++) {
          const cat = categories[i % categories.length];
          const amt = (10 + (i % 500) * 1.25).toFixed(2);
          const act = i % 3 === 0 ? 'false' : 'true';
          lines.push(`${i},${cat},${amt},${act},2024-01-${String((i % 28) + 1).padStart(2, '0')}`);
        }
        const rawData = lines.join('\n');

        // 1. Parse
        const t0 = performance.now();
        const parsed = parseCsvText(rawData);
        const parseMs = performance.now() - t0;
        expect(parsed.rows.length).toBe(n);

        // 2. Profile
        const t1 = performance.now();
        const { profiles, qualityReport } = profileDataset(parsed, `test_${n}.csv`, rawData.length);
        const profileMs = performance.now() - t1;
        expect(profiles.length).toBe(5);

        // 3. Table Generation
        const t2 = performance.now();
        const tableData = generateSqlTable(parsed, profiles, qualityReport, `test_${n}.csv`, rawData.length);
        const tableMs = performance.now() - t2;
        expect(tableData.rows.length).toBe(n);

        // 4. Query
        const t3 = performance.now();
        const qRes = executeSql(`SELECT category, COUNT(*) AS total_items, AVG(amount) AS avg_price FROM ${tableData.tableName} GROUP BY category ORDER BY avg_price DESC;`, tableData.database);
        const queryMs = performance.now() - t3;
        expect(qRes.rowCount).toBe(5);

        // 5. Export
        const t4 = performance.now();
        const csvExp = formatQueryResultAsCsv(qRes, 1000);
        const exportMs = performance.now() - t4;
        expect(csvExp.length).toBeGreaterThan(0);

        // Ensure reasonable browser performance thresholds (< 2500ms even on 25,000 rows under parallel runner load)
        expect(parseMs + profileMs + tableMs + queryMs).toBeLessThan(2500);

      });
    });
  });
});
