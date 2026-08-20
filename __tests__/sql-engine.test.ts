import { executeSql, Database, SQLError } from '../lib/sql';

// Test Database Fixture
const testDb: Database = {
  name: 'test_db',
  tables: {
    customers: {
      name: 'customers',
      columns: [
        { name: 'customer_id', type: 'INTEGER', isPrimaryKey: true },
        { name: 'name', type: 'TEXT' },
        { name: 'country', type: 'TEXT' },
        { name: 'segment', type: 'TEXT' },
      ],
      rows: [
        { customer_id: 1, name: 'Alice Smith', country: 'USA', segment: 'Enterprise' },
        { customer_id: 2, name: 'Bob Jones', country: 'UK', segment: 'SMB' },
        { customer_id: 3, name: 'Charlie Brown', country: 'USA', segment: 'SMB' },
        { customer_id: 4, name: 'Diana Prince', country: 'Canada', segment: 'Enterprise' },
        { customer_id: 5, name: 'Evan Wright', country: 'UK', segment: null },
      ],
    },
    orders: {
      name: 'orders',
      columns: [
        { name: 'order_id', type: 'INTEGER', isPrimaryKey: true },
        { name: 'customer_id', type: 'INTEGER', isForeignKey: true },
        { name: 'amount', type: 'DECIMAL' },
        { name: 'order_date', type: 'DATE' },
        { name: 'status', type: 'TEXT' },
      ],
      rows: [
        { order_id: 101, customer_id: 1, amount: 500, order_date: '2026-01-15', status: 'Completed' },
        { order_id: 102, customer_id: 1, amount: 1200, order_date: '2026-02-20', status: 'Completed' },
        { order_id: 103, customer_id: 2, amount: 300, order_date: '2026-02-25', status: 'Pending' },
        { order_id: 104, customer_id: 3, amount: 800, order_date: '2026-03-01', status: 'Completed' },
        { order_id: 105, customer_id: 3, amount: null, order_date: '2026-03-05', status: 'Cancelled' },
        // Notice: customer 4 and 5 have no orders
        // Notice: order 106 has an unlinked customer_id 99
        { order_id: 106, customer_id: 99, amount: 450, order_date: '2026-03-10', status: 'Completed' },
      ],
    },
    order_items: {
      name: 'order_items',
      columns: [
        { name: 'item_id', type: 'INTEGER', isPrimaryKey: true },
        { name: 'order_id', type: 'INTEGER', isForeignKey: true },
        { name: 'quantity', type: 'INTEGER' },
        { name: 'unit_price', type: 'DECIMAL' },
      ],
      rows: [
        { item_id: 1, order_id: 101, quantity: 2, unit_price: 250 },
        { item_id: 2, order_id: 102, quantity: 4, unit_price: 300 },
        { item_id: 3, order_id: 103, quantity: 1, unit_price: 300 },
      ],
    },
  },
};

describe('AnalyticsRise SQL Engine Core', () => {
  describe('Level 1: SELECT, Projection, Aliases, Arithmetic, and DISTINCT', () => {
    test('SELECT * FROM customers returns all columns and rows', () => {
      const res = executeSql('SELECT * FROM customers;', testDb);
      expect(res.rowCount).toBe(5);
      expect(res.columns).toEqual(['customer_id', 'name', 'country', 'segment']);
      expect(res.rowObjects[0].name).toBe('Alice Smith');
    });

    test('SELECT specific columns with column aliases', () => {
      const res = executeSql('SELECT name AS customer_name, country FROM customers;', testDb);
      expect(res.rowCount).toBe(5);
      expect(res.columns).toEqual(['customer_name', 'country']);
      expect(res.rowObjects[0].customer_name).toBe('Alice Smith');
    });

    test('Arithmetic operations in SELECT projection', () => {
      const res = executeSql('SELECT quantity * unit_price AS item_total FROM order_items;', testDb);
      expect(res.rowCount).toBe(3);
      expect(res.rowObjects[0].item_total).toBe(500);
      expect(res.rowObjects[1].item_total).toBe(1200);
      expect(res.rowObjects[2].item_total).toBe(300);
    });

    test('SELECT without FROM clause evaluates expressions', () => {
      const res = executeSql('SELECT 10 + 25 * 2 AS calculation, LOWER(\'HELLO\') AS greeting;', testDb);
      expect(res.rowCount).toBe(1);
      expect(res.rowObjects[0].calculation).toBe(60);
      expect(res.rowObjects[0].greeting).toBe('hello');
    });

    test('SELECT DISTINCT eliminates duplicate values', () => {
      const res = executeSql('SELECT DISTINCT country FROM customers;', testDb);
      expect(res.rowCount).toBe(3); // USA, UK, Canada
      const countries = res.rowObjects.map((r) => r.country);
      expect(countries).toContain('USA');
      expect(countries).toContain('UK');
      expect(countries).toContain('Canada');
    });
  });

  describe('WHERE Filtering and Precedence', () => {
    test('Basic equality and numerical comparisons', () => {
      const res = executeSql('SELECT * FROM orders WHERE amount > 500;', testDb);
      expect(res.rowCount).toBe(2); // amounts 1200 and 800
      expect(res.rowObjects.map((r) => r.amount)).toEqual([1200, 800]);
    });

    test('Logical AND / OR with precedence', () => {
      const res = executeSql(
        "SELECT * FROM customers WHERE (country = 'USA' OR country = 'Canada') AND segment = 'Enterprise';",
        testDb
      );
      expect(res.rowCount).toBe(2); // Alice Smith (USA, Enterprise), Diana Prince (Canada, Enterprise)
    });

    test('IN and NOT IN operator', () => {
      const inRes = executeSql("SELECT * FROM customers WHERE country IN ('Canada', 'UK');", testDb);
      expect(inRes.rowCount).toBe(3); // Bob Jones (UK), Diana Prince (Canada), Evan Wright (UK)

      const notInRes = executeSql("SELECT * FROM customers WHERE country NOT IN ('USA');", testDb);
      expect(notInRes.rowCount).toBe(3);
    });

    test('BETWEEN and NOT BETWEEN operator', () => {
      const res = executeSql('SELECT * FROM orders WHERE amount BETWEEN 400 AND 1000;', testDb);
      expect(res.rowCount).toBe(3); // 500, 800, 450
    });

    test('LIKE wildcard operator (% and _)', () => {
      const resPrefix = executeSql("SELECT * FROM customers WHERE name LIKE 'A%';", testDb);
      expect(resPrefix.rowCount).toBe(1);
      expect(resPrefix.rowObjects[0].name).toBe('Alice Smith');

      const resContains = executeSql("SELECT * FROM customers WHERE name LIKE '%Smith%';", testDb);
      expect(resContains.rowCount).toBe(1);
      expect(resContains.rowObjects[0].name).toBe('Alice Smith');
    });

    test('IS NULL and IS NOT NULL semantics', () => {
      const nullRes = executeSql('SELECT * FROM customers WHERE segment IS NULL;', testDb);
      expect(nullRes.rowCount).toBe(1);
      expect(nullRes.rowObjects[0].name).toBe('Evan Wright');

      const notNullRes = executeSql('SELECT * FROM customers WHERE segment IS NOT NULL;', testDb);
      expect(notNullRes.rowCount).toBe(4);
    });

    test('Strict SQL NULL comparison (= NULL yields no rows)', () => {
      const res = executeSql('SELECT * FROM customers WHERE segment = NULL;', testDb);
      expect(res.rowCount).toBe(0); // in SQL, col = NULL is always false
    });
  });

  describe('ORDER BY, LIMIT, and OFFSET', () => {
    test('ORDER BY ASC and DESC', () => {
      const ascRes = executeSql('SELECT order_id, amount FROM orders WHERE amount IS NOT NULL ORDER BY amount ASC;', testDb);
      expect(ascRes.rowObjects[0].amount).toBe(300);
      expect(ascRes.rowObjects[ascRes.rowCount - 1].amount).toBe(1200);

      const descRes = executeSql('SELECT order_id, amount FROM orders WHERE amount IS NOT NULL ORDER BY amount DESC;', testDb);
      expect(descRes.rowObjects[0].amount).toBe(1200);
      expect(descRes.rowObjects[descRes.rowCount - 1].amount).toBe(300);
    });

    test('Multi-column ORDER BY', () => {
      const res = executeSql('SELECT name, country FROM customers ORDER BY country ASC, name DESC;', testDb);
      expect(res.rowObjects[0].country).toBe('Canada');
      expect(res.rowObjects[1].country).toBe('UK');
      expect(res.rowObjects[1].name).toBe('Evan Wright');
      expect(res.rowObjects[2].country).toBe('UK');
      expect(res.rowObjects[2].name).toBe('Bob Jones');
    });

    test('LIMIT and OFFSET pagination', () => {
      const limitRes = executeSql('SELECT * FROM customers ORDER BY customer_id ASC LIMIT 2;', testDb);
      expect(limitRes.rowCount).toBe(2);
      expect(limitRes.rowObjects[0].customer_id).toBe(1);
      expect(limitRes.rowObjects[1].customer_id).toBe(2);

      const offsetRes = executeSql('SELECT * FROM customers ORDER BY customer_id ASC LIMIT 2 OFFSET 2;', testDb);
      expect(offsetRes.rowCount).toBe(2);
      expect(offsetRes.rowObjects[0].customer_id).toBe(3);
      expect(offsetRes.rowObjects[1].customer_id).toBe(4);
    });
  });

  describe('Aggregations, GROUP BY, and HAVING', () => {
    test('COUNT(*), SUM, AVG, MIN, MAX over all rows', () => {
      const res = executeSql(
        'SELECT COUNT(*) AS total_orders, SUM(amount) AS total_revenue, AVG(amount) AS avg_revenue, MIN(amount) AS min_val, MAX(amount) AS max_val FROM orders;',
        testDb
      );
      expect(res.rowCount).toBe(1);
      expect(res.rowObjects[0].total_orders).toBe(6);
      expect(res.rowObjects[0].total_revenue).toBe(3250); // 500+1200+300+800+450 (null skipped)
      expect(res.rowObjects[0].avg_revenue).toBe(650); // 3250 / 5 non-null rows
      expect(res.rowObjects[0].min_val).toBe(300);
      expect(res.rowObjects[0].max_val).toBe(1200);
    });

    test('COUNT(col) vs COUNT(*)', () => {
      const res = executeSql('SELECT COUNT(*) AS total_rows, COUNT(segment) AS non_null_segments FROM customers;', testDb);
      expect(res.rowObjects[0].total_rows).toBe(5);
      expect(res.rowObjects[0].non_null_segments).toBe(4); // Evan Wright has NULL segment
    });

    test('COUNT(DISTINCT col)', () => {
      const res = executeSql('SELECT COUNT(DISTINCT country) AS unique_countries FROM customers;', testDb);
      expect(res.rowObjects[0].unique_countries).toBe(3);
    });

    test('GROUP BY single column', () => {
      const res = executeSql(
        'SELECT country, COUNT(*) AS count_cust FROM customers GROUP BY country ORDER BY country ASC;',
        testDb
      );
      expect(res.rowCount).toBe(3);
      expect(res.rowObjects[0].country).toBe('Canada');
      expect(res.rowObjects[0].count_cust).toBe(1);
      expect(res.rowObjects[1].country).toBe('UK');
      expect(res.rowObjects[1].count_cust).toBe(2);
      expect(res.rowObjects[2].country).toBe('USA');
      expect(res.rowObjects[2].count_cust).toBe(2);
    });

    test('GROUP BY with HAVING filter', () => {
      const res = executeSql(
        'SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id HAVING SUM(amount) >= 800 ORDER BY total_spent DESC;',
        testDb
      );
      expect(res.rowCount).toBe(2);
      expect(res.rowObjects[0].customer_id).toBe(1);
      expect(res.rowObjects[0].total_spent).toBe(1700); // 500 + 1200
      expect(res.rowObjects[1].customer_id).toBe(3);
      expect(res.rowObjects[1].total_spent).toBe(800);
    });
  });

  describe('Relational Multi-Table JOINs', () => {
    test('INNER JOIN between customers and orders', () => {
      const res = executeSql(
        'SELECT c.name, o.order_id, o.amount FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id ORDER BY o.order_id ASC;',
        testDb
      );
      expect(res.rowCount).toBe(5);
      expect(res.rowObjects[0].name).toBe('Alice Smith');
      expect(res.rowObjects[0].order_id).toBe(101);
      expect(res.rowObjects[1].order_id).toBe(102);
      // Order 106 has customer_id 99 (not in customers), so not included in INNER JOIN
    });

    test('LEFT JOIN preserves unmatched left table records with NULLs', () => {
      const res = executeSql(
        'SELECT c.name, o.order_id, o.amount FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id ORDER BY c.customer_id ASC, o.order_id ASC;',
        testDb
      );
      // Alice (2 orders), Bob (1 order), Charlie (2 orders), Diana (0 orders -> null), Evan (0 orders -> null)
      expect(res.rowCount).toBe(7);

      const dianaRow = res.rowObjects.find((r) => r.name === 'Diana Prince');
      expect(dianaRow).toBeDefined();
      expect(dianaRow!.order_id).toBeNull();
      expect(dianaRow!.amount).toBeNull();
    });

    test('Three-table JOIN (customers + orders + order_items)', () => {
      const res = executeSql(
        `SELECT c.name, o.order_id, oi.item_id, oi.quantity, oi.unit_price
         FROM customers c
         INNER JOIN orders o ON c.customer_id = o.customer_id
         INNER JOIN order_items oi ON o.order_id = oi.order_id
         ORDER BY oi.item_id ASC;`,
        testDb
      );
      expect(res.rowCount).toBe(3);
      expect(res.rowObjects[0].name).toBe('Alice Smith');
      expect(res.rowObjects[0].item_id).toBe(1);
      expect(res.rowObjects[0].unit_price).toBe(250);
    });
  });

  describe('CASE Expressions, String Functions, and Date Functions', () => {
    test('CASE expression in SELECT projection', () => {
      const res = executeSql(
        `SELECT order_id, amount,
          CASE
            WHEN amount >= 1000 THEN 'Tier 1'
            WHEN amount >= 500 THEN 'Tier 2'
            ELSE 'Tier 3'
          END AS spending_tier
         FROM orders
         WHERE amount IS NOT NULL
         ORDER BY order_id ASC;`,
        testDb
      );
      expect(res.rowCount).toBe(5);
      expect(res.rowObjects[0].spending_tier).toBe('Tier 2'); // 500
      expect(res.rowObjects[1].spending_tier).toBe('Tier 1'); // 1200
      expect(res.rowObjects[2].spending_tier).toBe('Tier 3'); // 300
    });

    test('String manipulation functions: LOWER, UPPER, CONCAT, LENGTH, TRIM, SUBSTRING', () => {
      const res = executeSql(
        `SELECT
          LOWER(name) AS lower_name,
          UPPER(country) AS upper_country,
          CONCAT(name, ' (', country, ')') AS full_desc,
          LENGTH(name) AS name_len,
          SUBSTRING(name, 1, 5) AS first_five
         FROM customers
         WHERE customer_id = 1;`,
        testDb
      );
      expect(res.rowObjects[0].lower_name).toBe('alice smith');
      expect(res.rowObjects[0].upper_country).toBe('USA');
      expect(res.rowObjects[0].full_desc).toBe('Alice Smith (USA)');
      expect(res.rowObjects[0].name_len).toBe(11);
      expect(res.rowObjects[0].first_five).toBe('Alice');
    });

    test('Date functions: YEAR, MONTH, DAY, DATE', () => {
      const res = executeSql(
        `SELECT order_id, order_date,
          YEAR(order_date) AS ord_year,
          MONTH(order_date) AS ord_month,
          DAY(order_date) AS ord_day
         FROM orders
         WHERE order_id = 101;`,
        testDb
      );
      expect(res.rowObjects[0].ord_year).toBe(2026);
      expect(res.rowObjects[0].ord_month).toBe(1);
      expect(res.rowObjects[0].ord_day).toBe(15);
    });

    test('General functions: COALESCE, NULLIF, ROUND', () => {
      const res = executeSql(
        `SELECT
          COALESCE(segment, 'Unassigned') AS safe_segment,
          ROUND(123.4567, 2) AS rounded_val
         FROM customers
         WHERE customer_id = 5;`,
        testDb
      );
      expect(res.rowObjects[0].safe_segment).toBe('Unassigned');
      expect(res.rowObjects[0].rounded_val).toBe(123.46);
    });
  });

  describe('Negative Tests & Structured Error Reporting', () => {
    test('Rejects unsupported DML (UPDATE, DELETE, INSERT) with clean pedagogical hint', () => {
      expect(() => {
        executeSql('UPDATE customers SET name = "Hacked";', testDb);
      }).toThrow(SQLError);

      try {
        executeSql('DROP TABLE customers;', testDb);
      } catch (err: any) {
        expect(err.code).toBe('UNSUPPORTED_FEATURE');
        expect(err.message).toContain('is not supported in AnalyticsRise SQL Studio');
      }
    });

    test('Reports TABLE_NOT_FOUND when querying nonexistent table', () => {
      try {
        executeSql('SELECT * FROM nonexistent_table;', testDb);
      } catch (err: any) {
        expect(err.code).toBe('TABLE_NOT_FOUND');
        expect(err.message).toContain("'nonexistent_table' does not exist");
      }
    });

    test('Reports COLUMN_NOT_FOUND when selecting nonexistent column', () => {
      try {
        executeSql('SELECT nonexistent_col FROM customers;', testDb);
      } catch (err: any) {
        expect(err.code).toBe('COLUMN_NOT_FOUND');
        expect(err.message).toContain("'nonexistent_col' does not exist");
      }
    });

    test('Reports SYNTAX_ERROR on malformed query', () => {
      try {
        executeSql('SELECT FROM WHERE;', testDb);
      } catch (err: any) {
        expect(err.code).toBe('SYNTAX_ERROR');
      }
    });
  });

  describe('Performance Benchmark Sanity Check', () => {
    test('Executes queries against 1,000 in-memory rows in < 50ms', () => {
      const bigRows = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        category: i % 5 === 0 ? 'Electronics' : i % 3 === 0 ? 'Clothing' : 'Home',
        price: (i * 17) % 500,
      }));

      const benchDb: Database = {
        name: 'bench_db',
        tables: {
          products: {
            name: 'products',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'category', type: 'TEXT' },
              { name: 'price', type: 'DECIMAL' },
            ],
            rows: bigRows,
          },
        },
      };

      const start = performance.now();
      const res = executeSql(
        `SELECT category, COUNT(*) AS count_items, AVG(price) AS avg_price
         FROM products
         WHERE price > 50
         GROUP BY category
         HAVING COUNT(*) > 100
         ORDER BY avg_price DESC;`,
        benchDb
      );
      const elapsed = performance.now() - start;

      expect(res.rowCount).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(50); // fast in-memory execution < 50ms
    });

    test('Executes queries against 10,000 in-memory rows in < 250ms', () => {
      const largeRows = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        dept: `Dept_${i % 10}`,
        salary: 30000 + ((i * 31) % 90000),
      }));

      const largeDb: Database = {
        name: 'large_db',
        tables: {
          salaries: {
            name: 'salaries',
            columns: [
              { name: 'id', type: 'INTEGER' },
              { name: 'dept', type: 'TEXT' },
              { name: 'salary', type: 'INTEGER' },
            ],
            rows: largeRows,
          },
        },
      };

      const start = performance.now();
      const res = executeSql(
        `SELECT dept, COUNT(*) AS num_emps, SUM(salary) AS total_payroll, AVG(salary) AS avg_sal
         FROM salaries
         WHERE salary > 40000
         GROUP BY dept
         ORDER BY total_payroll DESC;`,
        largeDb
      );
      const elapsed = performance.now() - start;

      expect(res.rowCount).toBe(10);
      expect(elapsed).toBeLessThan(250);
    });
  });
});
