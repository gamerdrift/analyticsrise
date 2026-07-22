'use client';

/**
 * Portfolio Service (Module B)
 * Handles learner public portfolio generation, theme customization, and privacy visibility.
 */

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'SQL' | 'Excel' | 'Power BI' | 'Tableau' | 'Python';
  description: string;
  previewImage?: string;
  codeSnippet?: string;
  metrics?: { label: string; value: string }[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface PortfolioData {
  username: string;
  fullName: string;
  headline: string;
  bio: string;
  avatarUrl?: string;
  theme: 'cyber-neon' | 'slate-executive' | 'midnight-dark' | 'pure-light';
  privacy: 'public' | 'unlisted' | 'private';
  contactEmail: string;
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  skills: { name: string; category: string; rating: number }[]; // 0 - 100
  certifications: {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    hash: string;
    badgeUrl?: string;
  }[];
  projects: PortfolioProject[];
}

export const MOCK_PORTFOLIOS: Record<string, PortfolioData> = {
  'alex-rivera': {
    username: 'alex-rivera',
    fullName: 'Alex Rivera',
    headline: 'Data Analyst & BI Solutions Specialist',
    bio: 'Passionate about turning raw database transactions into clear business storytelling. Specialized in SQL query optimization, Power BI DAX modeling, and automated Excel forecast models.',
    theme: 'cyber-neon',
    privacy: 'public',
    contactEmail: 'alex.rivera@analyticsrise.com',
    socials: {
      linkedin: 'https://linkedin.com/in/alex-rivera-data',
      github: 'https://github.com/alexrivera-data',
    },
    skills: [
      { name: 'SQL Databases', category: 'Database', rating: 90 },
      { name: 'Microsoft Excel', category: 'Spreadsheet', rating: 95 },
      { name: 'Power BI', category: 'BI & Vis', rating: 85 },
      { name: 'Tableau', category: 'BI & Vis', rating: 75 },
      { name: 'Python (Pandas)', category: 'Programming', rating: 70 },
    ],
    certifications: [
      {
        id: 'cert-sql-01',
        title: 'Relational Database SQL Specialist',
        issuer: 'AnalyticsRise Academy',
        issueDate: '2026-07-20',
        hash: 'sha256-8a3b218f26a117b9b7a38b55c689d12',
      },
      {
        id: 'cert-pbi-02',
        title: 'Power BI Data Analyst Associate (PL-300)',
        issuer: 'Microsoft',
        issueDate: '2026-06-15',
        hash: 'sha256-3c2d184a9012f11c88a91b229f381c19',
      },
    ],
    projects: [
      {
        id: 'proj-sql-101',
        title: 'E-Commerce Churn Alert SQL Engine',
        category: 'SQL',
        description: 'Analyzed 1.4M billing records to identify customers showing low login frequency and high payment delays.',
        codeSnippet: `SELECT customer_id, COUNT(order_id) AS total_orders, SUM(revenue) AS lifetime_val\nFROM billing_transactions\nWHERE transaction_date >= '2026-01-01'\nGROUP BY customer_id\nHAVING DATEDIFF(day, MAX(transaction_date), CURRENT_DATE) > 45;`,
        metrics: [
          { label: 'Records Processed', value: '1.4M+' },
          { label: 'Churn Accuracy', value: '91.4%' },
        ],
        demoUrl: '/simulators/sql',
      },
      {
        id: 'proj-excel-102',
        title: 'SaaS Monthly Recurring Revenue (MRR) Forecast',
        category: 'Excel',
        description: 'Built dynamic Excel financial model utilizing XLOOKUP and Pivot Tables to project quarterly ARR growth.',
        metrics: [
          { label: 'Turnaround Saved', value: '12 hrs/wk' },
          { label: 'Variance Margin', value: '< 2.1%' },
        ],
        demoUrl: '/simulators/excel',
      },
    ],
  },
};

class PortfolioService {
  public async getPortfolio(username: string): Promise<PortfolioData | null> {
    await new Promise((r) => setTimeout(r, 200));
    const cleanUser = username.toLowerCase().trim();
    if (MOCK_PORTFOLIOS[cleanUser]) {
      return MOCK_PORTFOLIOS[cleanUser];
    }
    // Default fallback portfolio
    return {
      ...MOCK_PORTFOLIOS['alex-rivera'],
      username: cleanUser,
      fullName: cleanUser.replace(/-/g, ' ').toUpperCase(),
    };
  }
}

export const portfolioService = new PortfolioService();
