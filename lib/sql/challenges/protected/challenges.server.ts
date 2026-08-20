import { ProtectedChallengeData } from '../types';

/**
 * Server-Authoritative Protected Challenge Definitions
 * Contains canonical solutions and hidden grading/validation rules.
 * 
 * SECURITY BOUNDARY:
 * This module is isolated to internal/server execution and must NEVER be imported
 * by client-facing UI components or public barrel exports.
 */
export const PROTECTED_CHALLENGES: Record<string, ProtectedChallengeData> = {
  'sql.select.001': {
    id: 'sql.select.001',
    canonicalSolutionSql: 'SELECT name, category_id, price FROM products;',
    hiddenValidationRules: [
      {
        type: 'COLUMN_MATCH',
        expectedColumns: ['name', 'category_id', 'price'],
        gradingRubric: 'Output must include exactly name, category_id, and price columns from products table.',
      },
      {
        type: 'MIN_ROW_COUNT',
        minimumRowCount: 20,
        gradingRubric: 'Output must retrieve all products without truncation or unrequested filtering.',
      },
    ],
    internalNotes: 'Tests simple projection across 3 columns on ecommerce products table.',
  },

  'sql.select.002': {
    id: 'sql.select.002',
    canonicalSolutionSql: 'SELECT customer_id, first_name, last_name, email, city, country FROM customers;',
    hiddenValidationRules: [
      {
        type: 'COLUMN_MATCH',
        expectedColumns: ['customer_id', 'first_name', 'last_name', 'email', 'city', 'country'],
        gradingRubric: 'Output must project all 6 requested customer directory columns in exact sequence.',
      },
      {
        type: 'EXACT_ROW_COUNT',
        expectedRowCount: 80,
        gradingRubric: 'Query must return all 80 registered customers.',
      },
    ],
    internalNotes: 'Multi-column projection on ecommerce customers table.',
  },

  'sql.where.001': {
    id: 'sql.where.001',
    canonicalSolutionSql: "SELECT subscription_id, company_id, plan_id, mrr FROM subscriptions WHERE plan_id = 5 AND status = 'active';",
    hiddenValidationRules: [
      {
        type: 'COLUMN_MATCH',
        expectedColumns: ['subscription_id', 'company_id', 'plan_id', 'mrr'],
        gradingRubric: 'Output must contain subscription identifier, company, plan, and MRR metrics.',
      },
      {
        type: 'MIN_ROW_COUNT',
        minimumRowCount: 1,
        gradingRubric: 'Query must return active enterprise subscriptions (plan_id = 5) only.',
      },
      {
        type: 'VALUE_CHECK',
        gradingRubric: 'All returned rows must have plan_id = 5 and status = active.',
      },
    ],
    internalNotes: 'Compound WHERE filtering with AND logic on SaaS subscriptions with plan_id = 5.',
  },

  'sql.where.002': {
    id: 'sql.where.002',
    canonicalSolutionSql: "SELECT customer_id, first_name, last_name, email, city FROM customers WHERE segment = 'Enterprise' AND country = 'USA';",
    hiddenValidationRules: [
      {
        type: 'COLUMN_MATCH',
        expectedColumns: ['customer_id', 'first_name', 'last_name', 'email', 'city'],
        gradingRubric: 'Output columns must match customer contact profile.',
      },
      {
        type: 'MIN_ROW_COUNT',
        minimumRowCount: 1,
        gradingRubric: 'Filtered rows must represent enterprise segment customers in the USA.',
      },
    ],
    internalNotes: 'Compound WHERE filtering on customer segment and geographic country.',
  },

  'sql.orderby.001': {
    id: 'sql.orderby.001',
    canonicalSolutionSql: 'SELECT product_id, name, category_id, price FROM products ORDER BY price DESC LIMIT 5;',
    hiddenValidationRules: [
      {
        type: 'COLUMN_MATCH',
        expectedColumns: ['product_id', 'name', 'category_id', 'price'],
        gradingRubric: 'Output must project product identifier, name, category, and price.',
      },
      {
        type: 'EXACT_ROW_COUNT',
        expectedRowCount: 5,
        gradingRubric: 'Result set must be limited to exactly 5 rows.',
      },
      {
        type: 'ORDER_MATCH',
        requireOrdering: true,
        orderByColumn: 'price',
        gradingRubric: 'Results must be sorted descending by price.',
      },
    ],
    internalNotes: 'ORDER BY DESC + LIMIT 5 on product catalog.',
  },

  'sql.orderby.002': {
    id: 'sql.orderby.002',
    canonicalSolutionSql: "SELECT employee_id, first_name, last_name, department_id, hire_date FROM employees WHERE employment_status = 'Active' ORDER BY department_id ASC, hire_date ASC LIMIT 10;",
    hiddenValidationRules: [
      {
        type: 'COLUMN_MATCH',
        expectedColumns: ['employee_id', 'first_name', 'last_name', 'department_id', 'hire_date'],
        gradingRubric: 'Output columns must match employee tenure report specification.',
      },
      {
        type: 'EXACT_ROW_COUNT',
        expectedRowCount: 10,
        gradingRubric: 'Result set must be constrained to 10 rows.',
      },
      {
        type: 'ORDER_MATCH',
        requireOrdering: true,
        orderByColumn: 'department_id',
        gradingRubric: 'Results must be ordered by department_id ASC then hire_date ASC.',
      },
    ],
    internalNotes: 'Compound WHERE + multi-column ORDER BY + LIMIT 10 on HR employees dataset.',
  },
};
