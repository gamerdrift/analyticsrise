import {
  getDataset,
  listDatasets,
  getDatasetSchema,
  clearDatasetCache,
  createEcommerceDataset,
  createSaasDataset,
  createHrDataset,
  createFinanceDataset,
} from '../lib/sql/datasets';
import { executeSql, Database } from '../lib/sql';

describe('AnalyticsRise SQL Dataset & Schema Foundation', () => {
  beforeEach(() => {
    clearDatasetCache();
  });

  describe('1. Dataset Registry & Metadata Exploration', () => {
    test('listDatasets() lists all 4 core business datasets with metadata', () => {
      const datasets = listDatasets();
      expect(datasets.length).toBe(4);

      const ids = datasets.map((d) => d.id);
      expect(ids).toContain('ecommerce');
      expect(ids).toContain('saas');
      expect(ids).toContain('hr');
      expect(ids).toContain('finance');

      datasets.forEach((d) => {
        expect(d.name).toBeTruthy();
        expect(d.description).toBeTruthy();
        expect(d.tableCount).toBeGreaterThanOrEqual(4);
        expect(d.totalRows).toBeGreaterThan(100);
        expect(d.learningObjectives.length).toBeGreaterThan(0);
        expect(d.tags.length).toBeGreaterThan(0);
      });
    });

    test('getDataset() returns complete DatasetDefinition with tables and relationships', () => {
      const ecom = getDataset('ecommerce');
      expect(ecom).toBeDefined();
      expect(ecom!.database.name).toBe('ecommerce_db');
      expect(Object.keys(ecom!.database.tables)).toEqual([
        'categories',
        'products',
        'customers',
        'orders',
        'order_items',
        'payments',
      ]);
      expect(ecom!.relationships.length).toBe(5);

      const saas = getDataset('saas');
      expect(saas).toBeDefined();
      expect(Object.keys(saas!.database.tables)).toEqual([
        'plans',
        'companies',
        'subscriptions',
        'invoices',
        'users',
        'product_usage',
      ]);

      const hr = getDataset('hr');
      expect(hr).toBeDefined();
      expect(Object.keys(hr!.database.tables)).toEqual([
        'locations',
        'departments',
        'job_roles',
        'employees',
        'salaries',
        'performance_reviews',
      ]);

      const finance = getDataset('finance');
      expect(finance).toBeDefined();
      expect(Object.keys(finance!.database.tables)).toEqual([
        'categories',
        'merchants',
        'customers',
        'accounts',
        'transactions',
      ]);
    });

    test('getDatasetSchema() returns structured table schemas and relationships', () => {
      const schema = getDatasetSchema('ecommerce');
      expect(schema).toBeDefined();
      expect(schema!.tables.customers).toBeDefined();
      expect(schema!.tables.customers.columns.length).toBe(8);

      const pkCol = schema!.tables.customers.columns.find((c) => c.isPrimaryKey);
      expect(pkCol?.name).toBe('customer_id');

      const fkCol = schema!.tables.orders.columns.find((c) => c.isForeignKey);
      expect(fkCol?.foreignTable).toBe('customers');
    });

    test('getDataset() returns undefined on invalid ID', () => {
      expect(getDataset('nonexistent_id')).toBeUndefined();
      expect(getDatasetSchema('nonexistent_id')).toBeUndefined();
    });
  });

  describe('2. Deterministic Generation & Data Integrity', () => {
    test('E-Commerce dataset is 100% deterministic between runs', () => {
      const run1 = createEcommerceDataset();
      const run2 = createEcommerceDataset();

      expect(JSON.stringify(run1.database)).toBe(JSON.stringify(run2.database));
      expect(run1.database.tables.orders.rows.length).toBe(run2.database.tables.orders.rows.length);
      expect(run1.database.tables.orders.rows[0]).toEqual(run2.database.tables.orders.rows[0]);
    });

    test('SaaS dataset is 100% deterministic between runs', () => {
      const run1 = createSaasDataset();
      const run2 = createSaasDataset();

      expect(JSON.stringify(run1.database)).toBe(JSON.stringify(run2.database));
      expect(run1.database.tables.subscriptions.rows[0]).toEqual(run2.database.tables.subscriptions.rows[0]);
    });

    test('HR dataset is 100% deterministic between runs', () => {
      const run1 = createHrDataset();
      const run2 = createHrDataset();

      expect(JSON.stringify(run1.database)).toBe(JSON.stringify(run2.database));
      expect(run1.database.tables.employees.rows[0]).toEqual(run2.database.tables.employees.rows[0]);
    });

    test('Finance dataset is 100% deterministic between runs', () => {
      const run1 = createFinanceDataset();
      const run2 = createFinanceDataset();

      expect(JSON.stringify(run1.database)).toBe(JSON.stringify(run2.database));
      expect(run1.database.tables.transactions.rows[0]).toEqual(run2.database.tables.transactions.rows[0]);
    });

    test('Primary Keys are unique across all tables in all datasets', () => {
      const allDatasets = [
        createEcommerceDataset(),
        createSaasDataset(),
        createHrDataset(),
        createFinanceDataset(),
      ];

      allDatasets.forEach((ds) => {
        Object.values(ds.database.tables).forEach((table) => {
          const pkCol = table.columns.find((c) => c.isPrimaryKey);
          if (pkCol) {
            const keys = table.rows.map((r) => r[pkCol.name]);
            const uniqueKeys = new Set(keys);
            expect(uniqueKeys.size).toBe(table.rows.length);
          }
        });
      });
    });
  });

  describe('3. Engine Compatibility & Educational Query Fixtures Execution', () => {
    test('Executes all E-Commerce educational example queries against Stage 2A engine', () => {
      const ecom = getDataset('ecommerce')!;

      ecom.exampleQueries.forEach((fixture) => {
        const result = executeSql(fixture.sql, ecom.database);
        expect(result.rowCount).toBeGreaterThanOrEqual(fixture.minimumExpectedRows);
        fixture.expectedColumns.forEach((expectedCol) => {
          expect(result.columns).toContain(expectedCol);
        });
      });
    });

    test('Executes all SaaS educational example queries against Stage 2A engine', () => {
      const saas = getDataset('saas')!;

      saas.exampleQueries.forEach((fixture) => {
        const result = executeSql(fixture.sql, saas.database);
        expect(result.rowCount).toBeGreaterThanOrEqual(fixture.minimumExpectedRows);
        fixture.expectedColumns.forEach((expectedCol) => {
          expect(result.columns).toContain(expectedCol);
        });
      });
    });

    test('Executes all HR educational example queries against Stage 2A engine', () => {
      const hr = getDataset('hr')!;

      hr.exampleQueries.forEach((fixture) => {
        const result = executeSql(fixture.sql, hr.database);
        expect(result.rowCount).toBeGreaterThanOrEqual(fixture.minimumExpectedRows);
        fixture.expectedColumns.forEach((expectedCol) => {
          expect(result.columns).toContain(expectedCol);
        });
      });
    });

    test('Executes all Finance educational example queries against Stage 2A engine', () => {
      const finance = getDataset('finance')!;

      finance.exampleQueries.forEach((fixture) => {
        const result = executeSql(fixture.sql, finance.database);
        expect(result.rowCount).toBeGreaterThanOrEqual(fixture.minimumExpectedRows);
        fixture.expectedColumns.forEach((expectedCol) => {
          expect(result.columns).toContain(expectedCol);
        });
      });
    });
  });

  describe('4. Performance Benchmarks & 50K-Row Scalability Test', () => {
    test('Dataset instantiation and first query runs in < 20ms', () => {
      const startInit = performance.now();
      const dataset = getDataset('ecommerce')!;
      const initMs = performance.now() - startInit;
      expect(initMs).toBeLessThan(20);

      const startQuery = performance.now();
      const res = executeSql(
        `SELECT country, COUNT(*) AS count_cust
         FROM customers
         GROUP BY country
         ORDER BY count_cust DESC;`,
        dataset.database
      );
      const queryMs = performance.now() - startQuery;

      expect(res.rowCount).toBeGreaterThan(0);
      expect(queryMs).toBeLessThan(25);
    });

    test('50,000-Row Engine Scalability Benchmark executes in < 750ms', () => {
      // Construct 50,000 synthetic transaction records
      const rowCount = 50000;
      const rows: any[] = new Array(rowCount);

      for (let i = 0; i < rowCount; i++) {
        rows[i] = {
          id: i + 1,
          account_id: (i % 500) + 1,
          category: i % 4 === 0 ? 'Travel' : i % 3 === 0 ? 'Dining' : 'Retail',
          amount: (i * 13) % 2500 + 5.5,
          is_fraud: i % 200 === 0,
        };
      }

      const benchDb: Database = {
        name: 'bench_50k_db',
        tables: {
          transactions_50k: {
            name: 'transactions_50k',
            columns: [
              { name: 'id', type: 'INTEGER', isPrimaryKey: true },
              { name: 'account_id', type: 'INTEGER' },
              { name: 'category', type: 'TEXT' },
              { name: 'amount', type: 'DECIMAL' },
              { name: 'is_fraud', type: 'BOOLEAN' },
            ],
            rows,
          },
        },
      };

      const start = performance.now();
      const result = executeSql(
        `SELECT category,
            COUNT(*) AS total_txns,
            ROUND(SUM(amount), 2) AS gross_volume,
            ROUND(AVG(amount), 2) AS avg_ticket
         FROM transactions_50k
         WHERE amount > 50.0 AND is_fraud = FALSE
         GROUP BY category
         ORDER BY gross_volume DESC;`,
        benchDb
      );
      const elapsedMs = performance.now() - start;

      expect(result.rowCount).toBe(3);
      expect(result.rowObjects[0].category).toBeDefined();
      expect(result.rowObjects[0].gross_volume).toBeGreaterThan(100000);
      expect(elapsedMs).toBeLessThan(750); // High-throughput in-memory execution on 50,000 rows
    });
  });
});
