'use client';

/**
 * Career Intelligence Service (Module C)
 * AI-powered recommendation engine supporting 10 target analytics roles.
 */

export interface RoleSkillRequirement {
  skillName: string;
  category: string;
  requiredRating: number; // 0 - 100
  currentRating: number;  // 0 - 100
  isGap: boolean;
}

export interface CareerRoleProfile {
  id: string;
  title: string;
  category: string;
  description: string;
  salaryRange: {
    entry: string;
    mid: string;
    senior: string;
  };
  demandRating: 'High' | 'Very High' | 'Critical';
  skillsRequired: RoleSkillRequirement[];
  suggestedCertifications: string[];
}

export const SUPPORTED_ROLES: CareerRoleProfile[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Core Analytics',
    description: 'Transform business queries into SQL joins, spreadsheet models, and executive data dashboards.',
    salaryRange: { entry: '$65,000', mid: '$92,000', senior: '$125,000' },
    demandRating: 'Very High',
    skillsRequired: [
      { skillName: 'SQL Databases', category: 'Database', requiredRating: 85, currentRating: 80, isGap: false },
      { skillName: 'Microsoft Excel', category: 'Spreadsheet', requiredRating: 90, currentRating: 90, isGap: false },
      { skillName: 'Power BI / Tableau', category: 'BI', requiredRating: 80, currentRating: 70, isGap: true },
      { skillName: 'Data Storytelling', category: 'Soft Skills', requiredRating: 75, currentRating: 75, isGap: false },
    ],
    suggestedCertifications: ['AnalyticsRise Relational SQL Specialist', 'Microsoft PL-300 Power BI Data Analyst'],
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    category: 'Core Analytics',
    description: 'Bridge business strategy and IT data systems through requirements analysis and financial modeling.',
    salaryRange: { entry: '$68,000', mid: '$95,000', senior: '$130,000' },
    demandRating: 'High',
    skillsRequired: [
      { skillName: 'Business Process Modeling', category: 'Strategy', requiredRating: 85, currentRating: 70, isGap: true },
      { skillName: 'Excel Financial Modeling', category: 'Spreadsheet', requiredRating: 90, currentRating: 85, isGap: false },
      { skillName: 'SQL Querying', category: 'Database', requiredRating: 70, currentRating: 80, isGap: false },
    ],
    suggestedCertifications: ['ECBA Entry Certificate in Business Analysis', 'AnalyticsRise Excel Financial Architect'],
  },
  {
    id: 'bi-developer',
    title: 'BI Developer',
    category: 'Business Intelligence',
    description: 'Engineer enterprise semantic data layers, star schemas, DAX measures, and multi-dashboard books.',
    salaryRange: { entry: '$72,000', mid: '$105,000', senior: '$140,000' },
    demandRating: 'Very High',
    skillsRequired: [
      { skillName: 'Power BI DAX Modeling', category: 'BI', requiredRating: 90, currentRating: 65, isGap: true },
      { skillName: 'Tableau LOD Calculations', category: 'BI', requiredRating: 85, currentRating: 60, isGap: true },
      { skillName: 'Star Schema Architecture', category: 'Data Warehousing', requiredRating: 85, currentRating: 70, isGap: true },
    ],
    suggestedCertifications: ['Microsoft Certified: Power BI Data Analyst', 'Tableau Certified Data Analyst'],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Advanced AI & Data',
    description: 'Develop statistical ML models, predictive algorithms, and exploratory Python Pandas pipelines.',
    salaryRange: { entry: '$85,000', mid: '$125,000', senior: '$170,000' },
    demandRating: 'Critical',
    skillsRequired: [
      { skillName: 'Python (Pandas, NumPy)', category: 'Programming', requiredRating: 90, currentRating: 60, isGap: true },
      { skillName: 'Scikit-Learn ML', category: 'Machine Learning', requiredRating: 85, currentRating: 40, isGap: true },
      { skillName: 'SQL & Database Querying', category: 'Database', requiredRating: 80, currentRating: 80, isGap: false },
    ],
    suggestedCertifications: ['AWS Certified Data Engineer', 'AnalyticsRise Python Data Scientist'],
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    category: 'Data Infrastructure',
    description: 'Construct scalable data warehouse ingestion pipelines in Snowflake, Databricks, and Spark.',
    salaryRange: { entry: '$88,000', mid: '$130,000', senior: '$180,000' },
    demandRating: 'Critical',
    skillsRequired: [
      { skillName: 'Snowflake / Databricks', category: 'Cloud DWH', requiredRating: 90, currentRating: 50, isGap: true },
      { skillName: 'Advanced SQL Querying', category: 'Database', requiredRating: 95, currentRating: 80, isGap: true },
      { skillName: 'Spark ETL Pipelines', category: 'Data Pipeline', requiredRating: 85, currentRating: 30, isGap: true },
    ],
    suggestedCertifications: ['Snowflake SnowPro Core Certified', 'Databricks Certified Data Engineer'],
  },
  {
    id: 'analytics-engineer',
    title: 'Analytics Engineer',
    category: 'Business Intelligence',
    description: 'Apply software engineering best practices (dbt, Git, SQL) to clean and structure warehouse models.',
    salaryRange: { entry: '$80,000', mid: '$115,000', senior: '$155,000' },
    demandRating: 'Very High',
    skillsRequired: [
      { skillName: 'dbt Data Modeling', category: 'Analytics Engineering', requiredRating: 90, currentRating: 45, isGap: true },
      { skillName: 'SQL Database Tuning', category: 'Database', requiredRating: 90, currentRating: 80, isGap: true },
    ],
    suggestedCertifications: ['dbt Analytics Engineering Certification'],
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'Advanced AI & Data',
    description: 'Deploy AI models to cloud microservices and monitor MLOps inference pipelines.',
    salaryRange: { entry: '$95,000', mid: '$140,000', senior: '$195,000' },
    demandRating: 'Critical',
    skillsRequired: [
      { skillName: 'Python MLOps', category: 'AI', requiredRating: 95, currentRating: 40, isGap: true },
      { skillName: 'Docker & Kubernetes', category: 'Infrastructure', requiredRating: 85, currentRating: 30, isGap: true },
    ],
    suggestedCertifications: ['TensorFlow Developer Certificate'],
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'Advanced AI & Data',
    description: 'Harness LLMs, RAG vector databases, and AI agent frameworks to automate corporate workflows.',
    salaryRange: { entry: '$100,000', mid: '$150,000', senior: '$210,000' },
    demandRating: 'Critical',
    skillsRequired: [
      { skillName: 'LLM Orchestration (LangChain)', category: 'AI', requiredRating: 90, currentRating: 50, isGap: true },
      { skillName: 'Vector Databases', category: 'Database', requiredRating: 85, currentRating: 40, isGap: true },
    ],
    suggestedCertifications: ['Google Cloud Professional Machine Learning Engineer'],
  },
  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    category: 'Finance & Strategy',
    description: 'Construct corporate valuation, discounted cash flow (DCF), and budget forecasting models.',
    salaryRange: { entry: '$70,000', mid: '$100,000', senior: '$145,000' },
    demandRating: 'High',
    skillsRequired: [
      { skillName: 'Excel Financial Statements', category: 'Finance', requiredRating: 95, currentRating: 85, isGap: true },
      { skillName: 'SQL Data Extraction', category: 'Database', requiredRating: 75, currentRating: 80, isGap: false },
    ],
    suggestedCertifications: ['CFA Level 1', 'AnalyticsRise Excel Financial Architect'],
  },
  {
    id: 'product-analyst',
    title: 'Product Analyst',
    category: 'Core Analytics',
    description: 'Evaluate user onboarding funnels, feature A/B tests, and retention cohorts.',
    salaryRange: { entry: '$75,000', mid: '$110,000', senior: '$150,000' },
    demandRating: 'Very High',
    skillsRequired: [
      { skillName: 'Cohort Analysis', category: 'Analytics', requiredRating: 90, currentRating: 75, isGap: true },
      { skillName: 'SQL Window Functions', category: 'Database', requiredRating: 85, currentRating: 80, isGap: false },
    ],
    suggestedCertifications: ['Reforge Product Analytics Certification'],
  },
];

class CareerIntelligenceService {
  public getRoleProfile(roleId: string): CareerRoleProfile {
    return SUPPORTED_ROLES.find((r) => r.id === roleId) || SUPPORTED_ROLES[0];
  }

  public calculateReadinessScore(roleId: string): number {
    const role = this.getRoleProfile(roleId);
    if (!role.skillsRequired.length) return 75;

    const totalRequired = role.skillsRequired.reduce((sum, s) => sum + s.requiredRating, 0);
    const totalCurrent = role.skillsRequired.reduce(
      (sum, s) => sum + Math.min(s.requiredRating, s.currentRating),
      0
    );

    return Math.round((totalCurrent / totalRequired) * 100);
  }
}

export const careerIntelligenceService = new CareerIntelligenceService();
