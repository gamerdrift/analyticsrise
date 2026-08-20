import { Database, Table } from '../types';
import { DatasetDefinition, TableRelationship, ExampleQueryFixture } from './types';
import { DeterministicRNG } from './seed';

export function createSaasDataset(): DatasetDefinition {
  const rng = new DeterministicRNG(202);

  // 1. Subscription Plans
  const plansTable: Table = {
    name: 'plans',
    columns: [
      { name: 'plan_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique subscription plan ID' },
      { name: 'plan_name', type: 'TEXT', description: 'Product plan tier name' },
      { name: 'billing_interval', type: 'TEXT', description: 'Billing frequency: monthly or annual' },
      { name: 'monthly_price_usd', type: 'DECIMAL', description: 'Standard normalized monthly rate' },
      { name: 'seat_limit', type: 'INTEGER', description: 'Maximum allowed team member seats' },
      { name: 'has_dedicated_support', type: 'BOOLEAN', description: 'Includes 24/7 SLA support' },
    ],
    rows: [
      { plan_id: 1, plan_name: 'Starter Monthly', billing_interval: 'monthly', monthly_price_usd: 49.0, seat_limit: 5, has_dedicated_support: false },
      { plan_id: 2, plan_name: 'Starter Annual', billing_interval: 'annual', monthly_price_usd: 39.0, seat_limit: 5, has_dedicated_support: false },
      { plan_id: 3, plan_name: 'Growth Monthly', billing_interval: 'monthly', monthly_price_usd: 199.0, seat_limit: 25, has_dedicated_support: false },
      { plan_id: 4, plan_name: 'Growth Annual', billing_interval: 'annual', monthly_price_usd: 159.0, seat_limit: 25, has_dedicated_support: true },
      { plan_id: 5, plan_name: 'Enterprise Scale', billing_interval: 'annual', monthly_price_usd: 799.0, seat_limit: 100, has_dedicated_support: true },
    ],
  };

  // 2. Companies (60 synthetic B2B accounts)
  const companyNames = [
    'Apex Technologies', 'CloudScale Systems', 'DataPulse Analytics', 'Nova Logistics', 'BioGenix Labs',
    'FinTech Frontier', 'Skyline Media', 'Echo AI Labs', 'OmniCommerce', 'Vanguard Security',
    'Quantum Robotics', 'Hyperion Dynamics', 'Zenith Health', 'Starlight Energy', 'TerraByte Networks',
    'Solstice Software', 'Aura Creative Studio', 'Vector Intelligence', 'Pulse Capital', 'Beacon Global',
  ];

  const industries = ['FinTech', 'HealthTech', 'E-Commerce', 'Cybersecurity', 'EdTech', 'Enterprise IT', 'Media'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const countries = ['USA', 'UK', 'Germany', 'Canada', 'Australia', 'Singapore', 'France'];

  const companyRows = Array.from({ length: 60 }, (_, i) => {
    const baseName = companyNames[i % companyNames.length];
    const name = i < companyNames.length ? baseName : `${baseName} ${Math.floor(i / companyNames.length) + 1}`;
    return {
      company_id: i + 1,
      name,
      domain: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      industry: rng.choice(industries),
      company_size: rng.choice(companySizes),
      country: rng.choice(countries),
      created_at: rng.dateBetween('2024-06-01', '2026-01-15'),
    };
  });

  const companiesTable: Table = {
    name: 'companies',
    columns: [
      { name: 'company_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique B2B company account identifier' },
      { name: 'name', type: 'TEXT', description: 'Registered business name' },
      { name: 'domain', type: 'TEXT', description: 'Primary corporate web domain' },
      { name: 'industry', type: 'TEXT', description: 'Industry vertical sector' },
      { name: 'company_size', type: 'TEXT', description: 'Employee headcount tier' },
      { name: 'country', type: 'TEXT', description: 'Corporate headquarters country' },
      { name: 'created_at', type: 'DATE', description: 'Platform signup date' },
    ],
    rows: companyRows,
  };

  // 3. Subscriptions (Linked to companies & plans)
  const subscriptionRows: any[] = [];
  const invoiceRows: any[] = [];

  let invCounter = 1;

  for (let compId = 1; compId <= 60; compId++) {
    // 5 companies are churned, 5 are trials (no active sub), 50 have active subscriptions
    if (compId > 55) {
      // Trial only / no subscription
      continue;
    }

    const plan = rng.choice(plansTable.rows);
    const isChurned = compId <= 5;
    const status = isChurned ? 'churned' : 'active';
    const startDate = rng.dateBetween('2025-01-01', '2025-10-01');
    const endDate = isChurned ? rng.dateBetween('2025-11-01', '2026-03-01') : null;

    const subId = compId;
    subscriptionRows.push({
      subscription_id: subId,
      company_id: compId,
      plan_id: plan.plan_id,
      status,
      mrr: plan.monthly_price_usd,
      start_date: startDate,
      end_date: endDate,
      auto_renew: !isChurned,
    });

    // Invoices for this subscription
    const invoiceCount = rng.intBetween(2, 6);
    for (let k = 0; k < invoiceCount; k++) {
      const invDate = rng.dateBetween(startDate, '2026-06-30');
      const monthlyPrice = Number(plan.monthly_price_usd ?? 0);
      const invAmount = plan.billing_interval === 'annual' ? monthlyPrice * 12 : monthlyPrice;
      const invStatus = isChurned && k === invoiceCount - 1 ? 'unpaid' : 'paid';

      invoiceRows.push({
        invoice_id: invCounter++,
        subscription_id: subId,
        company_id: compId,
        invoice_date: invDate,
        amount_due: invAmount,
        amount_paid: invStatus === 'paid' ? invAmount : 0,
        status: invStatus,
      });
    }
  }

  const subscriptionsTable: Table = {
    name: 'subscriptions',
    columns: [
      { name: 'subscription_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique subscription record identifier' },
      { name: 'company_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'companies', foreignColumn: 'company_id', description: 'Subscribing organization reference' },
      { name: 'plan_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'plans', foreignColumn: 'plan_id', description: 'Active plan tier reference' },
      { name: 'status', type: 'TEXT', description: 'Subscription state: active, churned, paused' },
      { name: 'mrr', type: 'DECIMAL', description: 'Monthly recurring revenue value in USD' },
      { name: 'start_date', type: 'DATE', description: 'Subscription activation date' },
      { name: 'end_date', type: 'DATE', nullable: true, description: 'Cancellation or termination date if churned' },
      { name: 'auto_renew', type: 'BOOLEAN', description: 'Auto-renewal toggle status' },
    ],
    rows: subscriptionRows,
  };

  const invoicesTable: Table = {
    name: 'invoices',
    columns: [
      { name: 'invoice_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique billing invoice identifier' },
      { name: 'subscription_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'subscriptions', foreignColumn: 'subscription_id', description: 'Associated subscription record' },
      { name: 'company_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'companies', foreignColumn: 'company_id', description: 'Billed company identifier' },
      { name: 'invoice_date', type: 'DATE', description: 'Invoice issue timestamp' },
      { name: 'amount_due', type: 'DECIMAL', description: 'Total amount billed in USD' },
      { name: 'amount_paid', type: 'DECIMAL', description: 'Settled amount received in USD' },
      { name: 'status', type: 'TEXT', description: 'Invoice payment status: paid, unpaid, voided' },
    ],
    rows: invoiceRows,
  };

  // 4. Product Users & Usage Events
  const userRoles = ['Admin', 'Analyst', 'Engineer', 'Viewer', 'Manager'];
  const userRows: any[] = [];
  let userCounter = 1;

  for (let compId = 1; compId <= 60; compId++) {
    const userCount = rng.intBetween(2, 6);
    for (let u = 0; u < userCount; u++) {
      const uId = userCounter++;
      userRows.push({
        user_id: uId,
        company_id: compId,
        name: `User ${uId}`,
        email: `user${uId}@company${compId}.com`,
        role: rng.choice(userRoles),
        is_active: rng.choice([true, true, true, false]),
        last_login_date: rng.dateBetween('2026-01-01', '2026-07-31'),
      });
    }
  }

  const usersTable: Table = {
    name: 'users',
    columns: [
      { name: 'user_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique user member identifier' },
      { name: 'company_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'companies', foreignColumn: 'company_id', description: 'Belonging organization reference' },
      { name: 'name', type: 'TEXT', description: 'User full name' },
      { name: 'email', type: 'TEXT', description: 'Work email address' },
      { name: 'role', type: 'TEXT', description: 'Assigned RBAC role within company' },
      { name: 'is_active', type: 'BOOLEAN', description: 'Active user seat indicator' },
      { name: 'last_login_date', type: 'DATE', description: 'Most recent portal activity timestamp' },
    ],
    rows: userRows,
  };

  // 5. Product Usage Events (Feature adoption telemetry)
  const features = ['SQL Query Exec', 'Dashboard Export', 'Data Pipeline Sync', 'AI Mentor Query', 'API Webhook Call'];
  const usageRows: any[] = [];
  let eventCounter = 1;

  for (let e = 1; e <= 400; e++) {
    const randomUser = rng.choice(userRows);
    usageRows.push({
      event_id: eventCounter++,
      company_id: randomUser.company_id,
      user_id: randomUser.user_id,
      feature_name: rng.choice(features),
      usage_count: rng.intBetween(1, 45),
      event_date: rng.dateBetween('2026-04-01', '2026-07-31'),
    });
  }

  const productUsageTable: Table = {
    name: 'product_usage',
    columns: [
      { name: 'event_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique telemetry event ID' },
      { name: 'company_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'companies', foreignColumn: 'company_id', description: 'Company reference' },
      { name: 'user_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'users', foreignColumn: 'user_id', description: 'Active user reference' },
      { name: 'feature_name', type: 'TEXT', description: 'Platform software feature used' },
      { name: 'usage_count', type: 'INTEGER', description: 'Volume of operations performed' },
      { name: 'event_date', type: 'DATE', description: 'Activity event timestamp' },
    ],
    rows: usageRows,
  };

  const database: Database = {
    name: 'saas_db',
    tables: {
      plans: plansTable,
      companies: companiesTable,
      subscriptions: subscriptionsTable,
      invoices: invoicesTable,
      users: usersTable,
      product_usage: productUsageTable,
    },
  };

  const relationships: TableRelationship[] = [
    {
      id: 'rel_comp_sub',
      fromTable: 'companies',
      fromColumn: 'company_id',
      toTable: 'subscriptions',
      toColumn: 'company_id',
      type: 'ONE_TO_MANY',
      description: 'A company can hold subscriptions and renewal history.',
    },
    {
      id: 'rel_plan_sub',
      fromTable: 'plans',
      fromColumn: 'plan_id',
      toTable: 'subscriptions',
      toColumn: 'plan_id',
      type: 'ONE_TO_MANY',
      description: 'A subscription tier plan applies to multiple customer subscriptions.',
    },
    {
      id: 'rel_sub_inv',
      fromTable: 'subscriptions',
      fromColumn: 'subscription_id',
      toTable: 'invoices',
      toColumn: 'subscription_id',
      type: 'ONE_TO_MANY',
      description: 'A subscription generates periodic recurring billing invoices.',
    },
    {
      id: 'rel_comp_users',
      fromTable: 'companies',
      fromColumn: 'company_id',
      toTable: 'users',
      toColumn: 'company_id',
      type: 'ONE_TO_MANY',
      description: 'A company organization provisions multiple member seats.',
    },
    {
      id: 'rel_user_usage',
      fromTable: 'users',
      fromColumn: 'user_id',
      toTable: 'product_usage',
      toColumn: 'user_id',
      type: 'ONE_TO_MANY',
      description: 'Individual users log feature usage telemetry records.',
    },
  ];

  const exampleQueries: ExampleQueryFixture[] = [
    {
      id: 'q_saas_mrr_by_plan',
      title: 'Active Monthly Recurring Revenue (MRR) by Plan Tier',
      description: 'Calculate active subscription counts and total contracted MRR broken down by product plan.',
      difficulty: 'Intermediate',
      sql: `SELECT p.plan_name, p.billing_interval,
              COUNT(s.subscription_id) AS active_subscriptions,
              ROUND(SUM(s.mrr), 2) AS total_mrr
            FROM plans p
            INNER JOIN subscriptions s ON p.plan_id = s.plan_id
            WHERE s.status = 'active'
            GROUP BY p.plan_name, p.billing_interval
            ORDER BY total_mrr DESC;`,
      expectedColumns: ['plan_name', 'billing_interval', 'active_subscriptions', 'total_mrr'],
      minimumExpectedRows: 5,
    },
    {
      id: 'q_saas_churn_analysis',
      title: 'Company Churn & Attrition Rate by Industry',
      description: 'Compare active versus churned company counts across market sectors.',
      difficulty: 'Intermediate',
      sql: `SELECT c.industry,
              COUNT(DISTINCT c.company_id) AS total_companies,
              COUNT(CASE WHEN s.status = 'active' THEN 1 ELSE NULL END) AS active_accounts,
              COUNT(CASE WHEN s.status = 'churned' THEN 1 ELSE NULL END) AS churned_accounts
            FROM companies c
            LEFT JOIN subscriptions s ON c.company_id = s.company_id
            GROUP BY c.industry
            ORDER BY total_companies DESC;`,
      expectedColumns: ['industry', 'total_companies', 'active_accounts', 'churned_accounts'],
      minimumExpectedRows: 5,
    },
  ];

  return {
    id: 'saas',
    name: 'B2B SaaS Revenue & Subscription Analytics',
    description: 'Relational data for a cloud SaaS application covering recurring subscription revenue (MRR/ARR), customer churn, seat provisioning, and feature adoption.',
    category: 'SaaS',
    difficulty: 'Intermediate',
    database,
    relationships,
    learningObjectives: [
      'Model recurring subscription lifecycles, upgrades, and churn analysis',
      'Compute core SaaS metrics: MRR, ARR, Average Revenue Per Account (ARPA)',
      'Analyze product adoption and feature utilization across company tiers',
    ],
    estimatedRows: 5 + 60 + subscriptionRows.length + invoiceRows.length + userRows.length + usageRows.length,
    tags: ['SaaS', 'MRR', 'ARR', 'Churn', 'Subscriptions', 'B2B'],
    exampleQueries,
  };
}
