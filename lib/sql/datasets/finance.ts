import { Database, Table } from '../types';
import { DatasetDefinition, TableRelationship, ExampleQueryFixture } from './types';
import { DeterministicRNG } from './seed';

export function createFinanceDataset(): DatasetDefinition {
  const rng = new DeterministicRNG(404);

  // 1. Transaction Categories
  const categoryRows = [
    { category_id: 1, category_code: 'GROC', category_name: 'Groceries & Supermarkets', risk_level: 'Low' },
    { category_id: 2, category_code: 'REST', category_name: 'Dining & Restaurants', risk_level: 'Low' },
    { category_id: 3, category_code: 'AIRL', category_name: 'Airlines & Travel', risk_level: 'Medium' },
    { category_id: 4, category_code: 'ECOM', category_name: 'Online Digital Retail', risk_level: 'Medium' },
    { category_id: 5, category_code: 'LUXY', category_name: 'Luxury Goods & Jewelry', risk_level: 'High' },
    { category_id: 6, category_code: 'CRYP', category_name: 'Crypto & Digital Assets', risk_level: 'High' },
    { category_id: 7, category_code: 'UTIL', category_name: 'Utilities & Telecom', risk_level: 'Low' },
  ];

  const categoriesTable: Table = {
    name: 'categories',
    columns: [
      { name: 'category_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique category identifier' },
      { name: 'category_code', type: 'TEXT', description: 'Industry MCC standard short code' },
      { name: 'category_name', type: 'TEXT', description: 'Merchant industry classification' },
      { name: 'risk_level', type: 'TEXT', description: 'Compliance underwriting risk tier: Low, Medium, High' },
    ],
    rows: categoryRows,
  };

  // 2. Merchants (25 synthetic merchants)
  const merchantNames = [
    { name: 'Whole Foods Market', category_id: 1, country: 'USA', is_high_risk: false },
    { name: 'Tesco Express', category_id: 1, country: 'UK', is_high_risk: false },
    { name: 'Starbucks Coffee', category_id: 2, country: 'USA', is_high_risk: false },
    { name: 'Chipotle Mexican Grill', category_id: 2, country: 'USA', is_high_risk: false },
    { name: 'Delta Air Lines', category_id: 3, country: 'USA', is_high_risk: false },
    { name: 'British Airways', category_id: 3, country: 'UK', is_high_risk: false },
    { name: 'Amazon Marketplace', category_id: 4, country: 'USA', is_high_risk: false },
    { name: 'Shopify Storefront', category_id: 4, country: 'Canada', is_high_risk: false },
    { name: 'Cartier Boutiques', category_id: 5, country: 'France', is_high_risk: true },
    { name: 'Rolex Official Center', category_id: 5, country: 'Switzerland', is_high_risk: true },
    { name: 'CoinBridge Exchange', category_id: 6, country: 'Singapore', is_high_risk: true },
    { name: 'BitSafe Payments', category_id: 6, country: 'Estonia', is_high_risk: true },
    { name: 'ConEdison Electric', category_id: 7, country: 'USA', is_high_risk: false },
    { name: 'Vodafone Telecom', category_id: 7, country: 'UK', is_high_risk: false },
  ];

  const merchantRows = merchantNames.map((m, idx) => ({
    merchant_id: idx + 1,
    name: m.name,
    category_id: m.category_id,
    country: m.country,
    terminal_type: m.category_id === 4 || m.category_id === 6 ? 'Online/E-Commerce' : 'POS/In-Store',
    is_high_risk: m.is_high_risk,
  }));

  const merchantsTable: Table = {
    name: 'merchants',
    columns: [
      { name: 'merchant_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique merchant business ID' },
      { name: 'name', type: 'TEXT', description: 'Commercial merchant name' },
      { name: 'category_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'categories', foreignColumn: 'category_id', description: 'Industry classification reference' },
      { name: 'country', type: 'TEXT', description: 'Merchant operating domicile' },
      { name: 'terminal_type', type: 'TEXT', description: 'Transaction capture channel: Online or POS' },
      { name: 'is_high_risk', type: 'BOOLEAN', description: 'High-risk fraud flag' },
    ],
    rows: merchantRows,
  };

  // 3. Customers & Accounts (70 customers, 90 accounts)
  const customerNames = [
    'Alexander Wright', 'Beatrice Thorne', 'Charles Montgomery', 'Danielle Vance', 'Edward Foster',
    'Fiona Gallagher', 'George Harrison', 'Helena Bonham', 'Ian Malcolm', 'Jessica Pearson',
    'Kevin Spacey', 'Laura Croft', 'Michael Scott', 'Nina Williams', 'Oscar Martinez',
  ];

  const customerRows: any[] = [];
  const accountRows: any[] = [];

  for (let cId = 1; cId <= 70; cId++) {
    const baseName = customerNames[cId % customerNames.length];
    const fullName = cId <= customerNames.length ? baseName : `${baseName} ${Math.floor(cId / customerNames.length) + 1}`;
    const riskTier = rng.choice(['Low', 'Low', 'Low', 'Medium', 'High']);
    const creditScore = rng.intBetween(580, 840);

    customerRows.push({
      customer_id: cId,
      full_name: fullName,
      risk_tier: riskTier,
      credit_score: creditScore,
      country: rng.choice(['USA', 'USA', 'UK', 'Canada', 'Australia']),
    });

    // Each customer has 1 or 2 accounts
    const numAccounts = rng.choice([1, 1, 2]);
    for (let accIdx = 0; accIdx < numAccounts; accIdx++) {
      const accId = accountRows.length + 1;
      const accType = accIdx === 0 ? 'Checking' : 'Savings';
      const balance = rng.floatBetween(500, 45000, 2);

      accountRows.push({
        account_id: accId,
        customer_id: cId,
        account_number: `ACC-1000${accId}`,
        account_type: accType,
        account_status: cId <= 3 ? 'Suspended' : 'Active',
        current_balance: balance,
        currency: 'USD',
      });
    }
  }

  const customersTable: Table = {
    name: 'customers',
    columns: [
      { name: 'customer_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique banking client ID' },
      { name: 'full_name', type: 'TEXT', description: 'Account holder legal name' },
      { name: 'risk_tier', type: 'TEXT', description: 'KYC / AML compliance risk tier' },
      { name: 'credit_score', type: 'INTEGER', description: 'Credit bureau score rating (300-850)' },
      { name: 'country', type: 'TEXT', description: 'Tax residency country' },
    ],
    rows: customerRows,
  };

  const accountsTable: Table = {
    name: 'accounts',
    columns: [
      { name: 'account_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique financial account number identifier' },
      { name: 'customer_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'customers', foreignColumn: 'customer_id', description: 'Account holder customer ID' },
      { name: 'account_number', type: 'TEXT', description: 'Masked bank account string' },
      { name: 'account_type', type: 'TEXT', description: 'Product account type: Checking, Savings, Credit' },
      { name: 'account_status', type: 'TEXT', description: 'Account status: Active, Suspended, Closed' },
      { name: 'current_balance', type: 'DECIMAL', description: 'Available ledger balance in USD' },
      { name: 'currency', type: 'TEXT', description: 'Base account currency denomination' },
    ],
    rows: accountRows,
  };

  // 4. Transactions (450 synthetic transactions)
  const transactionRows: any[] = [];

  for (let txnId = 1; txnId <= 450; txnId++) {
    const account = rng.choice(accountRows);
    const merchant = rng.choice(merchantRows);
    const txnDate = rng.dateBetween('2026-01-01', '2026-07-31');
    const isCryptoOrLuxury = merchant.category_id === 5 || merchant.category_id === 6;

    const baseAmount = isCryptoOrLuxury ? rng.floatBetween(1200, 8500, 2) : rng.floatBetween(8.5, 420.0, 2);
    const isSuspicious = (isCryptoOrLuxury && baseAmount > 5000) || account.account_status === 'Suspended';
    const isFlagged = isSuspicious || rng.next() < 0.04;
    const approvalStatus = isFlagged ? (rng.next() < 0.6 ? 'Declined' : 'Under Review') : 'Approved';

    transactionRows.push({
      txn_id: txnId,
      account_id: account.account_id,
      merchant_id: merchant.merchant_id,
      amount: baseAmount,
      txn_type: baseAmount > 500 ? 'Wire / Transfer' : 'Debit Purchase',
      txn_date: txnDate,
      is_flagged: isFlagged,
      approval_status: approvalStatus,
    });
  }

  const transactionsTable: Table = {
    name: 'transactions',
    columns: [
      { name: 'txn_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique transaction ledger reference' },
      { name: 'account_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'accounts', foreignColumn: 'account_id', description: 'Debited account reference' },
      { name: 'merchant_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'merchants', foreignColumn: 'merchant_id', description: 'Recipient merchant reference' },
      { name: 'amount', type: 'DECIMAL', description: 'Transaction amount value in USD' },
      { name: 'txn_type', type: 'TEXT', description: 'Channel mechanism: Debit Purchase, Wire / Transfer' },
      { name: 'txn_date', type: 'DATE', description: 'Transaction execution timestamp' },
      { name: 'is_flagged', type: 'BOOLEAN', description: 'Automated AML/fraud rules alert trigger' },
      { name: 'approval_status', type: 'TEXT', description: 'Settlement state: Approved, Declined, Under Review' },
    ],
    rows: transactionRows,
  };

  const database: Database = {
    name: 'finance_db',
    tables: {
      categories: categoriesTable,
      merchants: merchantsTable,
      customers: customersTable,
      accounts: accountsTable,
      transactions: transactionsTable,
    },
  };

  const relationships: TableRelationship[] = [
    {
      id: 'rel_cat_merch',
      fromTable: 'categories',
      fromColumn: 'category_id',
      toTable: 'merchants',
      toColumn: 'category_id',
      type: 'ONE_TO_MANY',
      description: 'Each merchant is assigned an industry category classification.',
    },
    {
      id: 'rel_cust_acc',
      fromTable: 'customers',
      fromColumn: 'customer_id',
      toTable: 'accounts',
      toColumn: 'customer_id',
      type: 'ONE_TO_MANY',
      description: 'A customer can maintain multiple bank accounts.',
    },
    {
      id: 'rel_acc_txn',
      fromTable: 'accounts',
      fromColumn: 'account_id',
      toTable: 'transactions',
      toColumn: 'account_id',
      type: 'ONE_TO_MANY',
      description: 'An account generates debit and transfer transactions.',
    },
    {
      id: 'rel_merch_txn',
      fromTable: 'merchants',
      fromColumn: 'merchant_id',
      toTable: 'transactions',
      toColumn: 'merchant_id',
      type: 'ONE_TO_MANY',
      description: 'A merchant receives transactions from various customer accounts.',
    },
  ];

  const exampleQueries: ExampleQueryFixture[] = [
    {
      id: 'q_fin_category_volume',
      title: 'Gross Transaction Volume by Merchant Category',
      description: 'Aggregate cleared transactions by category to determine aggregate spending distribution.',
      difficulty: 'Intermediate',
      sql: `SELECT cat.category_name, cat.risk_level,
              COUNT(t.txn_id) AS transaction_count,
              ROUND(SUM(t.amount), 2) AS total_volume,
              ROUND(AVG(t.amount), 2) AS avg_ticket_size
            FROM categories cat
            INNER JOIN merchants m ON cat.category_id = m.category_id
            INNER JOIN transactions t ON m.merchant_id = t.merchant_id
            WHERE t.approval_status = 'Approved'
            GROUP BY cat.category_name, cat.risk_level
            ORDER BY total_volume DESC;`,
      expectedColumns: ['category_name', 'risk_level', 'transaction_count', 'total_volume', 'avg_ticket_size'],
      minimumExpectedRows: 5,
    },
    {
      id: 'q_fin_flagged_fraud',
      title: 'High Risk Flagged Transactions Audit',
      description: 'Isolate flagged transactions, linking customer credit score and merchant risk attributes.',
      difficulty: 'Advanced',
      sql: `SELECT c.full_name, c.risk_tier, a.account_number, m.name AS merchant_name,
              t.amount, t.approval_status
            FROM customers c
            INNER JOIN accounts a ON c.customer_id = a.customer_id
            INNER JOIN transactions t ON a.account_id = t.account_id
            INNER JOIN merchants m ON t.merchant_id = m.merchant_id
            WHERE t.is_flagged = TRUE
            ORDER BY t.amount DESC;`,
      expectedColumns: ['full_name', 'risk_tier', 'account_number', 'merchant_name', 'amount', 'approval_status'],
      minimumExpectedRows: 10,
    },
  ];

  return {
    id: 'finance',
    name: 'Banking Transactions & Financial Fraud Analytics',
    description: 'Relational data for a digital commercial bank analyzing account balances, merchant transaction volumes, high-risk flags, and fraud detection rules.',
    category: 'Finance & Banking',
    difficulty: 'Advanced',
    database,
    relationships,
    learningObjectives: [
      'Query transaction ledgers and aggregate cross-merchant payment volumes',
      'Join customer risk ratings with transaction approval states for compliance auditing',
      'Calculate average ticket size and volume distribution across merchant categories',
    ],
    estimatedRows: 7 + 14 + 70 + accountRows.length + 450,
    tags: ['Finance', 'Banking', 'Transactions', 'Fraud Detection', 'Risk Analytics', 'AML'],
    exampleQueries,
  };
}
