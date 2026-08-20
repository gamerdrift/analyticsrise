import { Database, Table } from '../types';
import { DatasetDefinition, TableRelationship, ExampleQueryFixture } from './types';
import { DeterministicRNG } from './seed';

export function createEcommerceDataset(): DatasetDefinition {
  const rng = new DeterministicRNG(101);

  // 1. Categories
  const categoryDefs = [
    { category_id: 1, category_name: 'Electronics', department: 'Technology', description: 'Computers, audio, and personal devices' },
    { category_id: 2, category_name: 'Home & Kitchen', department: 'Home', description: 'Cookware, appliances, and home decor' },
    { category_id: 3, category_name: 'Apparel & Footwear', department: 'Fashion', description: 'Clothing, athletic wear, and shoes' },
    { category_id: 4, category_name: 'Books & Media', department: 'Entertainment', description: 'Technical textbooks, audiobooks, and media' },
    { category_id: 5, category_name: 'Sports & Outdoors', department: 'Fitness', description: 'Gym equipment, camping gear, and accessories' },
    { category_id: 6, category_name: 'Office Supplies', department: 'Business', description: 'Desks, stationery, and organizational tools' },
  ];

  const categoriesTable: Table = {
    name: 'categories',
    columns: [
      { name: 'category_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique category identifier' },
      { name: 'category_name', type: 'TEXT', description: 'Name of the product category' },
      { name: 'department', type: 'TEXT', description: 'High-level business department' },
      { name: 'description', type: 'TEXT', description: 'Category product summary' },
    ],
    rows: categoryDefs,
  };

  // 2. Products (30 realistic products)
  const productTemplates = [
    { name: 'UltraHD 27-inch 4K Monitor', category_id: 1, price: 399.99, cost_price: 240.0, stock_quantity: 45 },
    { name: 'Mechanical RGB Gaming Keyboard', category_id: 1, price: 129.99, cost_price: 65.0, stock_quantity: 120 },
    { name: 'Wireless Ergonomic Mouse', category_id: 1, price: 79.99, cost_price: 32.0, stock_quantity: 210 },
    { name: 'Noise-Canceling Bluetooth Headphones', category_id: 1, price: 249.99, cost_price: 110.0, stock_quantity: 80 },
    { name: 'USB-C Multiport Hub Adapter', category_id: 1, price: 49.99, cost_price: 18.0, stock_quantity: 350 },
    { name: 'Stainless Steel Espresso Machine', category_id: 2, price: 299.99, cost_price: 150.0, stock_quantity: 35 },
    { name: 'Cast Iron Dutch Oven (6 Qt)', category_id: 2, price: 89.99, cost_price: 40.0, stock_quantity: 65 },
    { name: 'Non-Stick Ceramic Cookware Set', category_id: 2, price: 159.99, cost_price: 75.0, stock_quantity: 40 },
    { name: 'High-Speed Countertop Blender', category_id: 2, price: 119.99, cost_price: 52.0, stock_quantity: 90 },
    { name: 'Merino Wool Athletic Hoodie', category_id: 3, price: 95.0, cost_price: 38.0, stock_quantity: 140 },
    { name: 'Waterproof Trail Running Shoes', category_id: 3, price: 135.0, cost_price: 55.0, stock_quantity: 95 },
    { name: 'Breathable Training T-Shirt (3-Pack)', category_id: 3, price: 45.0, cost_price: 14.0, stock_quantity: 250 },
    { name: 'Designing Data-Intensive Applications', category_id: 4, price: 48.0, cost_price: 22.0, stock_quantity: 300 },
    { name: 'Python for Data Analysis (3rd Edition)', category_id: 4, price: 54.99, cost_price: 25.0, stock_quantity: 220 },
    { name: 'Storytelling with Data Handbook', category_id: 4, price: 38.5, cost_price: 16.0, stock_quantity: 180 },
    { name: 'Adjustable Dumbbell Set (50 lbs)', category_id: 5, price: 289.0, cost_price: 140.0, stock_quantity: 50 },
    { name: 'High-Density Non-Slip Yoga Mat', category_id: 5, price: 35.0, cost_price: 12.0, stock_quantity: 180 },
    { name: 'Insulated Stainless Water Bottle (32oz)', category_id: 5, price: 28.0, cost_price: 9.0, stock_quantity: 400 },
    { name: 'Motorized Standing Desk Frame', category_id: 6, price: 450.0, cost_price: 230.0, stock_quantity: 25 },
    { name: 'Ergonomic Mesh Task Chair', category_id: 6, price: 225.0, cost_price: 95.0, stock_quantity: 60 },
  ];

  const productRows = productTemplates.map((p, idx) => ({
    product_id: idx + 1,
    category_id: p.category_id,
    name: p.name,
    price: p.price,
    cost_price: p.cost_price,
    stock_quantity: p.stock_quantity,
    rating: rng.choiceOrNull([4.2, 4.5, 4.8, 4.9, 3.8, 4.0, 5.0], 0.05),
  }));

  const productsTable: Table = {
    name: 'products',
    columns: [
      { name: 'product_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique product identifier' },
      { name: 'category_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'categories', foreignColumn: 'category_id', description: 'Foreign key referencing categories' },
      { name: 'name', type: 'TEXT', description: 'Product title' },
      { name: 'price', type: 'DECIMAL', description: 'Retail selling price in USD' },
      { name: 'cost_price', type: 'DECIMAL', description: 'Wholesale acquisition cost in USD' },
      { name: 'stock_quantity', type: 'INTEGER', description: 'Current in-stock inventory count' },
      { name: 'rating', type: 'DECIMAL', nullable: true, description: 'Customer average review rating (1-5)' },
    ],
    rows: productRows,
  };

  // 3. Customers (80 synthetic customers across regions)
  const firstNames = ['James', 'Emma', 'Oliver', 'Sophia', 'Liam', 'Isabella', 'William', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Daniel', 'Abigail', 'Matthew', 'Emily'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const cities = [
    { city: 'New York', country: 'USA', segment: 'Enterprise' },
    { city: 'San Francisco', country: 'USA', segment: 'Enterprise' },
    { city: 'Austin', country: 'USA', segment: 'SMB' },
    { city: 'Chicago', country: 'USA', segment: 'Consumer' },
    { city: 'London', country: 'UK', segment: 'Enterprise' },
    { city: 'Manchester', country: 'UK', segment: 'SMB' },
    { city: 'Toronto', country: 'Canada', segment: 'SMB' },
    { city: 'Vancouver', country: 'Canada', segment: 'Consumer' },
    { city: 'Sydney', country: 'Australia', segment: 'Enterprise' },
    { city: 'Berlin', country: 'Germany', segment: 'SMB' },
  ];

  const customerRows = Array.from({ length: 80 }, (_, i) => {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3 + 7) % lastNames.length];
    const geo = cities[i % cities.length];
    return {
      customer_id: i + 1,
      first_name: fn,
      last_name: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@example.com`,
      city: geo.city,
      country: geo.country,
      segment: rng.choiceOrNull(['Enterprise', 'SMB', 'Consumer'], 0.05), // occasional null segment
      created_at: rng.dateBetween('2025-01-01', '2026-03-01'),
    };
  });

  const customersTable: Table = {
    name: 'customers',
    columns: [
      { name: 'customer_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique customer identifier' },
      { name: 'first_name', type: 'TEXT', description: 'Customer first name' },
      { name: 'last_name', type: 'TEXT', description: 'Customer last name' },
      { name: 'email', type: 'TEXT', description: 'Customer contact email' },
      { name: 'city', type: 'TEXT', description: 'Residential or billing city' },
      { name: 'country', type: 'TEXT', description: 'Customer geographical country' },
      { name: 'segment', type: 'TEXT', nullable: true, description: 'Market segment: Enterprise, SMB, or Consumer' },
      { name: 'created_at', type: 'DATE', description: 'Account creation date' },
    ],
    rows: customerRows,
  };

  // 4. Orders & Order Items (300 orders, intentional distribution where some customers have 0 orders)
  const orderRows: any[] = [];
  const orderItemRows: any[] = [];
  const paymentRows: any[] = [];

  let itemCounter = 1;
  let paymentCounter = 1;

  for (let ordId = 1; ordId <= 300; ordId++) {
    // Only assign orders to customers 1 through 65 (customers 66-80 have 0 orders for LEFT JOIN test cases)
    const custId = rng.intBetween(1, 65);
    const orderDate = rng.dateBetween('2025-03-01', '2026-07-31');
    const status = rng.choice(['Completed', 'Completed', 'Completed', 'Processing', 'Cancelled', 'Refunded']);
    const paymentMethod = rng.choice(['Credit Card', 'Credit Card', 'PayPal', 'Wire Transfer', 'Razorpay']);

    const numItems = rng.intBetween(1, 4);
    let orderTotal = 0;

    for (let k = 0; k < numItems; k++) {
      const product = rng.choice(productRows);
      const qty = rng.intBetween(1, 3);
      const unitPrice = product.price;
      orderTotal += qty * unitPrice;

      orderItemRows.push({
        item_id: itemCounter++,
        order_id: ordId,
        product_id: product.product_id,
        quantity: qty,
        unit_price: unitPrice,
      });
    }

    const shippingFee = orderTotal > 150 ? 0 : 9.99;
    const finalAmount = Math.round((orderTotal + shippingFee) * 100) / 100;

    orderRows.push({
      order_id: ordId,
      customer_id: custId,
      order_date: orderDate,
      status,
      total_amount: finalAmount,
      shipping_fee: shippingFee,
      payment_method: paymentMethod,
    });

    // Payment record
    const paymentStatus = status === 'Cancelled' ? 'Failed' : status === 'Refunded' ? 'Refunded' : 'Success';
    paymentRows.push({
      payment_id: paymentCounter++,
      order_id: ordId,
      payment_date: orderDate,
      amount: finalAmount,
      payment_status: paymentStatus,
      provider: paymentMethod,
    });
  }

  const ordersTable: Table = {
    name: 'orders',
    columns: [
      { name: 'order_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique order transaction ID' },
      { name: 'customer_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'customers', foreignColumn: 'customer_id', description: 'Purchasing customer identifier' },
      { name: 'order_date', type: 'DATE', description: 'Order placement timestamp' },
      { name: 'status', type: 'TEXT', description: 'Order status: Completed, Processing, Cancelled, Refunded' },
      { name: 'total_amount', type: 'DECIMAL', description: 'Gross order invoice value in USD' },
      { name: 'shipping_fee', type: 'DECIMAL', description: 'Shipping charge applied' },
      { name: 'payment_method', type: 'TEXT', description: 'Payment tender type' },
    ],
    rows: orderRows,
  };

  const orderItemsTable: Table = {
    name: 'order_items',
    columns: [
      { name: 'item_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique line item identifier' },
      { name: 'order_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'orders', foreignColumn: 'order_id', description: 'Associated order reference' },
      { name: 'product_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'products', foreignColumn: 'product_id', description: 'Purchased product reference' },
      { name: 'quantity', type: 'INTEGER', description: 'Units purchased' },
      { name: 'unit_price', type: 'DECIMAL', description: 'Unit retail price captured at checkout' },
    ],
    rows: orderItemRows,
  };

  const paymentsTable: Table = {
    name: 'payments',
    columns: [
      { name: 'payment_id', type: 'INTEGER', isPrimaryKey: true, description: 'Payment settlement transaction ID' },
      { name: 'order_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'orders', foreignColumn: 'order_id', description: 'Associated order reference' },
      { name: 'payment_date', type: 'DATE', description: 'Payment gateway capture date' },
      { name: 'amount', type: 'DECIMAL', description: 'Amount charged in USD' },
      { name: 'payment_status', type: 'TEXT', description: 'Settlement state: Success, Failed, Refunded' },
      { name: 'provider', type: 'TEXT', description: 'Payment method / gateway used' },
    ],
    rows: paymentRows,
  };

  const database: Database = {
    name: 'ecommerce_db',
    tables: {
      categories: categoriesTable,
      products: productsTable,
      customers: customersTable,
      orders: ordersTable,
      order_items: orderItemsTable,
      payments: paymentsTable,
    },
  };

  const relationships: TableRelationship[] = [
    {
      id: 'rel_cat_prod',
      fromTable: 'categories',
      fromColumn: 'category_id',
      toTable: 'products',
      toColumn: 'category_id',
      type: 'ONE_TO_MANY',
      description: 'One product category contains multiple catalog products.',
    },
    {
      id: 'rel_cust_ord',
      fromTable: 'customers',
      fromColumn: 'customer_id',
      toTable: 'orders',
      toColumn: 'customer_id',
      type: 'ONE_TO_MANY',
      description: 'One customer can place multiple orders over their lifetime.',
    },
    {
      id: 'rel_ord_items',
      fromTable: 'orders',
      fromColumn: 'order_id',
      toTable: 'order_items',
      toColumn: 'order_id',
      type: 'ONE_TO_MANY',
      description: 'One order consists of one or more purchased line items.',
    },
    {
      id: 'rel_prod_items',
      fromTable: 'products',
      fromColumn: 'product_id',
      toTable: 'order_items',
      toColumn: 'product_id',
      type: 'ONE_TO_MANY',
      description: 'A product can be purchased across multiple order line items.',
    },
    {
      id: 'rel_ord_pay',
      fromTable: 'orders',
      fromColumn: 'order_id',
      toTable: 'payments',
      toColumn: 'order_id',
      type: 'ONE_TO_ONE',
      description: 'Each order is associated with a payment settlement record.',
    },
  ];

  const exampleQueries: ExampleQueryFixture[] = [
    {
      id: 'q_ecom_top_customers',
      title: 'Top 10 Customers by Lifetime Spend',
      description: 'Aggregate completed order revenue by customer to find top VIP spenders.',
      difficulty: 'Intermediate',
      sql: `SELECT c.customer_id, c.first_name, c.last_name, c.country,
              COUNT(o.order_id) AS total_orders,
              ROUND(SUM(o.total_amount), 2) AS lifetime_spend
            FROM customers c
            INNER JOIN orders o ON c.customer_id = o.customer_id
            WHERE o.status = 'Completed'
            GROUP BY c.customer_id, c.first_name, c.last_name, c.country
            ORDER BY lifetime_spend DESC
            LIMIT 10;`,
      expectedColumns: ['customer_id', 'first_name', 'last_name', 'country', 'total_orders', 'lifetime_spend'],
      minimumExpectedRows: 10,
    },
    {
      id: 'q_ecom_category_revenue',
      title: 'Gross Revenue by Product Category',
      description: 'Join categories, products, and order_items to analyze sales breakdown.',
      difficulty: 'Intermediate',
      sql: `SELECT cat.category_name, cat.department,
              COUNT(DISTINCT p.product_id) AS active_products,
              SUM(oi.quantity) AS units_sold,
              ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_revenue
            FROM categories cat
            INNER JOIN products p ON cat.category_id = p.category_id
            INNER JOIN order_items oi ON p.product_id = oi.product_id
            GROUP BY cat.category_name, cat.department
            ORDER BY gross_revenue DESC;`,
      expectedColumns: ['category_name', 'department', 'active_products', 'units_sold', 'gross_revenue'],
      minimumExpectedRows: 6,
    },
    {
      id: 'q_ecom_unmatched_customers',
      title: 'Inactive Customers with Zero Purchases',
      description: 'Identify prospective registered accounts that have never placed an order using LEFT JOIN.',
      difficulty: 'Beginner',
      sql: `SELECT c.customer_id, c.first_name, c.last_name, c.email, c.created_at
            FROM customers c
            LEFT JOIN orders o ON c.customer_id = o.customer_id
            WHERE o.order_id IS NULL
            ORDER BY c.created_at DESC;`,
      expectedColumns: ['customer_id', 'first_name', 'last_name', 'email', 'created_at'],
      minimumExpectedRows: 10,
    },
  ];

  return {
    id: 'ecommerce',
    name: 'Global E-Commerce Retail Store',
    description: 'Relational data for an online retail marketplace tracking customer journeys, product inventory, multi-item baskets, and payment settlements.',
    category: 'E-Commerce',
    difficulty: 'Beginner',
    database,
    relationships,
    learningObjectives: [
      'Understand one-to-many relationship modeling (Customers -> Orders -> Items)',
      'Calculate financial KPIs: Gross Merchandise Value (GMV), AOV, and Lifetime Value',
      'Detect inactive accounts using LEFT JOIN and IS NULL filters',
      'Evaluate category profitability and inventory turnover',
    ],
    estimatedRows: 6 + 20 + 80 + 300 + orderItemRows.length + 300,
    tags: ['B2C', 'Retail', 'Sales', 'Inventory', 'Multi-Table Joins', 'Aggregations'],
    exampleQueries,
  };
}
