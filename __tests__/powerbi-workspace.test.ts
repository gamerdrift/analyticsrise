import {
  parseDatasetFile,
  detectDelimiter,
  parseDelimitedText,
  sanitizeHeaders,
} from '../lib/powerbi/workspace/csvParser';
import {
  inferCellType,
  inferColumnType,
  isValueEmpty,
} from '../lib/powerbi/workspace/typeInference';
import {
  profileDataset,
  profileAllDatasets,
} from '../lib/powerbi/workspace/profiler';
import {
  findRelationshipCandidates,
  normalizeKeyName,
} from '../lib/powerbi/workspace/modelHeuristics';
import {
  validateDatasetUpload,
  validateDatasetDimensions,
  POWERBI_WORKSPACE_LIMITS,
} from '../lib/powerbi/workspace/limits';
import {
  savePowerBIProject,
  listPowerBIProjects,
  loadPowerBIProject,
  deletePowerBIProject,
} from '../lib/powerbi/workspace/projectStorage';
import {
  getStarterDatasets,
  STARTER_CUSTOMERS_CSV,
  STARTER_ORDERS_CSV,
} from '../lib/powerbi/workspace/starterData';
import {
  adaptPowerBIWorkspaceContext,
} from '../lib/powerbi/workspace/contextAdapter';
import { PowerBIWorkspaceProject } from '../lib/powerbi/workspace/types';

describe('Power BI Workspace Foundation Suite (Mission 10A)', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('1. Dataset Ingestion & Delimited Text Parser', () => {
    test('detects CSV, TSV, and Semicolon delimiters accurately', () => {
      const csv = 'id,name,val\n1,Alpha,10\n2,Beta,20';
      const tsv = 'id\tname\tval\n1\tAlpha\t10\n2\tBeta\t20';
      const semi = 'id;name;val\n1;Alpha;10\n2;Beta;20';

      expect(detectDelimiter(csv)).toBe(',');
      expect(detectDelimiter(tsv)).toBe('\t');
      expect(detectDelimiter(semi)).toBe(';');
    });

    test('parses quoted values and escaped quotes in CSV', () => {
      const csv = 'id,company,notes\n1,"Acme, Inc.","Hello ""World"""\n2,"Beta LLC","Simple"';
      const rows = parseDelimitedText(csv);

      expect(rows.length).toBe(3);
      expect(rows[1][1]).toBe('Acme, Inc.');
      expect(rows[1][2]).toBe('Hello "World"');
      expect(rows[2][1]).toBe('Beta LLC');
    });

    test('sanitizes and deduplicates column headers', () => {
      const raw = ['Region', 'Region', '  ', 'Revenue'];
      const headers = sanitizeHeaders(raw);

      expect(headers[0]).toBe('Region');
      expect(headers[1]).toBe('Region_2');
      expect(headers[2]).toBe('Column_3');
      expect(headers[3]).toBe('Revenue');
    });

    test('creates structured Dataset object with normalized rows and columns', () => {
      const csv = 'customer_id,name,balance,active\nC-01,Elena,1500.50,true\nC-02,Marcus,2400.00,false';
      const ds = parseDatasetFile(csv, 'customers.csv', 1024, 'ds_1', 'Customers');

      expect(ds.id).toBe('ds_1');
      expect(ds.name).toBe('Customers');
      expect(ds.rowCount).toBe(2);
      expect(ds.colCount).toBe(4);
      expect(ds.columns.length).toBe(4);
      expect(ds.rows[0][0]).toBe('C-01');
      expect(ds.rows[0][2]).toBe(1500.5);
      expect(ds.rows[0][3]).toBe(true);
    });

    test('handles empty dataset gracefully', () => {
      const ds = parseDatasetFile('', 'empty.csv', 0);
      expect(ds.rowCount).toBe(0);
      expect(ds.colCount).toBe(1);
      expect(ds.headers).toEqual(['Column_1']);
    });
  });

  describe('2. Deterministic Type Inference Engine', () => {
    test('identifies empty and null cell representations', () => {
      expect(isValueEmpty(null)).toBe(true);
      expect(isValueEmpty(undefined)).toBe(true);
      expect(isValueEmpty('')).toBe(true);
      expect(isValueEmpty('null')).toBe(true);
      expect(isValueEmpty('N/A')).toBe(true);
      expect(isValueEmpty('None')).toBe(true);
      expect(isValueEmpty('Valid Text')).toBe(false);
      expect(isValueEmpty(0)).toBe(false);
    });

    test('infers cell types accurately', () => {
      expect(inferCellType('123')).toBe('INTEGER');
      expect(inferCellType('-450')).toBe('INTEGER');
      expect(inferCellType('123.45')).toBe('DECIMAL');
      expect(inferCellType('$1,250.00')).toBe('DECIMAL');
      expect(inferCellType('15.5%')).toBe('DECIMAL');
      expect(inferCellType('true')).toBe('BOOLEAN');
      expect(inferCellType('false')).toBe('BOOLEAN');
      expect(inferCellType('2026-01-15')).toBe('DATE');
      expect(inferCellType('2026-01-15T14:30:00Z')).toBe('DATETIME');
      expect(inferCellType('Hello World')).toBe('TEXT');
    });

    test('infers column types across homogenous and mixed columns', () => {
      expect(inferColumnType(['10', '20', '30', null])).toBe('INTEGER');
      expect(inferColumnType(['10.5', '20', '30.2'])).toBe('DECIMAL');
      expect(inferColumnType(['true', 'false', 'true'])).toBe('BOOLEAN');
      expect(inferColumnType(['2026-01-01', '2026-01-02'])).toBe('DATE');
      expect(inferColumnType(['10', '20', 'invalid_string'])).toBe('TEXT'); // Fallback to TEXT
      expect(inferColumnType([null, undefined, ''])).toBe('EMPTY');
    });
  });

  describe('3. Dataset Profiler & Quality Warnings', () => {
    test('computes complete column distribution metrics', () => {
      const csv = `product_id,product_name,unit_price,in_stock
P-1,Laptop,1200.00,true
P-2,Mouse,25.50,true
P-3,Keyboard,75.00,false
P-4,Monitor,300.00,true`;
      const ds = parseDatasetFile(csv, 'products.csv', 100);
      const profile = profileDataset(ds);

      expect(profile.rowCount).toBe(4);
      expect(profile.colCount).toBe(4);

      const priceCol = profile.columns.find((c) => c.name === 'unit_price');
      expect(priceCol).toBeDefined();
      expect(priceCol?.inferredType).toBe('DECIMAL');
      expect(priceCol?.min).toBe(25.5);
      expect(priceCol?.max).toBe(1200);
      expect(priceCol?.nullCount).toBe(0);

      const keyCol = profile.columns.find((c) => c.name === 'product_id');
      expect(keyCol?.isPotentialKey).toBe(true);
      expect(profile.potentialKeys).toContain('product_id');
    });

    test('generates educational warnings for missing values and keys', () => {
      const csv = `id,name,missing_field
1,Alpha,null
2,Beta,
3,Gamma,
4,Delta,val`;
      const ds = parseDatasetFile(csv, 'test.csv', 100);
      const profile = profileDataset(ds);

      expect(profile.qualityWarnings.some((w) => w.includes('missing_field'))).toBe(true);
      expect(profile.qualityWarnings.some((w) => w.includes('primary key candidate'))).toBe(true);
    });
  });

  describe('4. Semantic Model Heuristics & Relationship Candidates', () => {
    test('normalizes key names for fuzzy matching', () => {
      expect(normalizeKeyName('Customer ID')).toBe('customerid');
      expect(normalizeKeyName('customer_id')).toBe('customerid');
      expect(normalizeKeyName('customerId')).toBe('customerid');
    });

    test('discovers 1:N relationship candidates across Customers and Orders', () => {
      const starter = getStarterDatasets();
      const candidates = findRelationshipCandidates(starter);

      expect(candidates.length).toBeGreaterThanOrEqual(2);

      // Relationship: Customers -> Orders via customer_id
      const custRel = candidates.find(
        (c) =>
          (c.fromDatasetName === 'Customers' && c.toDatasetName === 'Orders') ||
          (c.fromDatasetName === 'Orders' && c.toDatasetName === 'Customers')
      );
      expect(custRel).toBeDefined();
      expect(custRel?.fromColumn).toContain('customer_id');
      expect(custRel?.confidence).toBeGreaterThanOrEqual(0.85);

      // Relationship: Products -> Orders via product_id
      const prodRel = candidates.find(
        (c) =>
          (c.fromDatasetName === 'Products' && c.toDatasetName === 'Orders') ||
          (c.fromDatasetName === 'Orders' && c.toDatasetName === 'Products')
      );
      expect(prodRel).toBeDefined();
      expect(prodRel?.fromColumn).toContain('product_id');
    });
  });

  describe('5. Limits & Governance Validation', () => {
    test('enforces Free tier file size limit (5 MB)', () => {
      const valid = validateDatasetUpload(4 * 1024 * 1024, 0, 'free');
      expect(valid.valid).toBe(true);

      const invalid = validateDatasetUpload(6 * 1024 * 1024, 0, 'free');
      expect(invalid.valid).toBe(false);
      expect(invalid.requiresUpgrade).toBe(true);
    });

    test('enforces Free tier dataset count limit (3 datasets)', () => {
      const valid = validateDatasetUpload(1000, 2, 'free');
      expect(valid.valid).toBe(true);

      const invalid = validateDatasetUpload(1000, 3, 'free');
      expect(invalid.valid).toBe(false);
      expect(invalid.limitExceeded?.type).toBe('DATASET_COUNT');
    });

    test('enforces row and column limits', () => {
      const valid = validateDatasetDimensions(1000, 20, 'free');
      expect(valid.valid).toBe(true);

      const invalidRows = validateDatasetDimensions(30000, 20, 'free');
      expect(invalidRows.valid).toBe(false);
      expect(invalidRows.limitExceeded?.type).toBe('ROW_COUNT');

      const invalidCols = validateDatasetDimensions(1000, 150, 'free');
      expect(invalidCols.valid).toBe(false);
      expect(invalidCols.limitExceeded?.type).toBe('COLUMN_COUNT');
    });
  });

  describe('6. Project Persistence & Local Storage', () => {
    const mockProject: PowerBIWorkspaceProject = {
      projectId: 'proj_test_1',
      projectName: 'E-commerce Revenue Model',
      datasets: getStarterDatasets(),
      relationships: [],
      measures: [],
      visuals: [],
      createdAt: 1700000000000,
      updatedAt: 1700000000000,
      version: 1,
    };

    test('saves and lists projects in user-scoped storage', () => {
      const saved = savePowerBIProject(mockProject, 'user_123');
      expect(saved).toBe(true);

      const list = listPowerBIProjects('user_123');
      expect(list.length).toBe(1);
      expect(list[0].projectName).toBe('E-commerce Revenue Model');
      expect(list[0].datasetCount).toBe(3);
    });

    test('loads a saved project by ID with future collection defaults', () => {
      savePowerBIProject(mockProject, 'user_123');
      const loaded = loadPowerBIProject('proj_test_1', 'user_123');

      expect(loaded).toBeDefined();
      expect(loaded?.projectName).toBe('E-commerce Revenue Model');
      expect(loaded?.datasets.length).toBe(3);
      expect(Array.isArray(loaded?.relationships)).toBe(true);
      expect(Array.isArray(loaded?.measures)).toBe(true);
      expect(Array.isArray(loaded?.visuals)).toBe(true);
    });

    test('deletes a saved project', () => {
      savePowerBIProject(mockProject, 'user_123');
      const deleted = deletePowerBIProject('proj_test_1', 'user_123');
      expect(deleted).toBe(true);

      const list = listPowerBIProjects('user_123');
      expect(list.length).toBe(0);
    });
  });

  describe('7. Privacy & AI-EVA Context Adapter', () => {
    test('produces schema-only metadata without raw dataset rows', () => {
      const starter = getStarterDatasets();
      const context = adaptPowerBIWorkspaceContext(starter, 'ds_customers');

      expect(context.workspaceType).toBe('powerbi_workspace');
      expect(context.datasetCount).toBe(3);
      expect(context.privacyLevel).toBe('metadata');
      expect(context.datasets.length).toBe(3);

      // Verify that no raw data rows are attached
      for (const ds of context.datasets) {
        expect((ds as any).rows).toBeUndefined();
        expect(ds.columns.length).toBeGreaterThan(0);
        expect(ds.columns[0].sampleValues?.length).toBeLessThanOrEqual(3);
      }

      expect(context.suggestedRelationships.length).toBeGreaterThan(0);
      expect(context.qualityWarnings).toBeDefined();
    });
  });
});
