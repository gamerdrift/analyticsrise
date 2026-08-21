/**
 * AnalyticsRise — Power BI Workspace Starter Relational Data
 * Built-in multi-table e-commerce data model for instant exploration.
 */

import { Dataset } from './types';
import { parseDatasetFile } from './csvParser';

export const STARTER_CUSTOMERS_CSV = `customer_id,customer_name,email,region,signup_date,status
CUST-001,Elena Rostova,elena@example.com,North America,2025-01-15,Active
CUST-002,Marcus Vance,marcus@example.com,Europe,2025-02-10,Active
CUST-003,Priya Sharma,priya@example.com,Asia Pacific,2025-03-01,Active
CUST-004,Alex Rivera,alex@example.com,North America,2025-03-12,Active
CUST-005,Sophie Dubois,sophie@example.com,Europe,2025-04-05,Inactive
CUST-006,David Kim,david@example.com,Asia Pacific,2025-04-20,Active
CUST-007,Lucas Silva,lucas@example.com,Latin America,2025-05-02,Active
CUST-008,Amara Okafor,amara@example.com,Middle East,2025-05-18,Active
CUST-009,Hannah Schmidt,hannah@example.com,Europe,2025-06-01,Active
CUST-010,Chen Wei,chen@example.com,Asia Pacific,2025-06-15,Active`;

export const STARTER_PRODUCTS_CSV = `product_id,product_name,category,unit_price,cost_price,in_stock
PROD-101,Analytics Pro Annual,Software,999.00,250.00,true
PROD-102,SQL Mastery Certificate,Education,299.00,50.00,true
PROD-103,Power BI Accelerator,Education,399.00,80.00,true
PROD-104,Data Modeling Toolkit,Software,499.00,120.00,true
PROD-105,Executive BI Dashboard,Template,149.00,30.00,true
PROD-106,Enterprise Data Pipeline,Service,2499.00,800.00,false
PROD-107,AI Career Coach Pass,Education,199.00,40.00,true
PROD-108,Financial Modeling Suite,Template,249.00,60.00,true`;

export const STARTER_ORDERS_CSV = `order_id,order_date,customer_id,product_id,quantity,unit_price,total_amount,payment_status
ORD-5001,2026-01-05,CUST-001,PROD-101,1,999.00,999.00,Completed
ORD-5002,2026-01-08,CUST-002,PROD-102,2,299.00,598.00,Completed
ORD-5003,2026-01-12,CUST-003,PROD-103,1,399.00,399.00,Completed
ORD-5004,2026-01-15,CUST-001,PROD-104,1,499.00,499.00,Completed
ORD-5005,2026-01-20,CUST-004,PROD-101,1,999.00,999.00,Completed
ORD-5006,2026-01-25,CUST-006,PROD-102,1,299.00,299.00,Completed
ORD-5007,2026-02-02,CUST-007,PROD-105,3,149.00,447.00,Completed
ORD-5008,2026-02-05,CUST-002,PROD-103,1,399.00,399.00,Completed
ORD-5009,2026-02-10,CUST-008,PROD-107,1,199.00,199.00,Completed
ORD-5010,2026-02-15,CUST-009,PROD-108,1,249.00,249.00,Completed
ORD-5011,2026-02-18,CUST-010,PROD-101,2,999.00,1998.00,Completed
ORD-5012,2026-02-22,CUST-003,PROD-104,1,499.00,499.00,Completed
ORD-5013,2026-02-28,CUST-004,PROD-105,2,149.00,298.00,Completed`;

/**
 * Builds the default starter datasets array for a new workspace
 */
export function getStarterDatasets(): Dataset[] {
  const customers = parseDatasetFile(STARTER_CUSTOMERS_CSV, 'customers.csv', STARTER_CUSTOMERS_CSV.length, 'ds_customers', 'Customers');
  const products = parseDatasetFile(STARTER_PRODUCTS_CSV, 'products.csv', STARTER_PRODUCTS_CSV.length, 'ds_products', 'Products');
  const orders = parseDatasetFile(STARTER_ORDERS_CSV, 'orders.csv', STARTER_ORDERS_CSV.length, 'ds_orders', 'Orders');

  return [customers, products, orders];
}
