'use client';

export interface VerifiedCompany {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  techStack: string[];
  benefits: string[];
  hiringStats: {
    totalHiredThisYear: number;
    avgSalary: string;
    remotePercentage: number;
  };
  openPositionsCount: number;
  isVerified: boolean;
  overview: string;
  employeeTestimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

export const VERIFIED_COMPANIES: VerifiedCompany[] = [
  {
    id: 'snowflake',
    name: 'Snowflake',
    logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150',
    industry: 'Cloud Data Data Warehouse',
    techStack: ['Snowflake', 'SQL', 'dbt', 'Python', 'Power BI'],
    benefits: ['100% Remote Option', '401k 6% Match', '$3,000 Learning Stipend', 'Health/Dental/Vision'],
    hiringStats: {
      totalHiredThisYear: 48,
      avgSalary: '$145,000',
      remotePercentage: 90,
    },
    openPositionsCount: 5,
    isVerified: true,
    overview: 'Snowflake enables every organization to mobilize their data with Snowflake Data Cloud.',
    employeeTestimonial: {
      quote: 'The data engineering culture at Snowflake is world-class. Candidates verified through AnalyticsRise onboarding jump right into active queries.',
      author: 'Sarah Jenkins',
      role: 'Head of Data Engineering',
    },
  },
  {
    id: 'databricks',
    name: 'Databricks',
    logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150',
    industry: 'Data & AI Lakehouse',
    techStack: ['Apache Spark', 'Python', 'SQL', 'Delta Lake', 'MLflow'],
    benefits: ['Equity Grants', 'Flexible PTO', 'Wellness Allowance', 'Parental Leave'],
    hiringStats: {
      totalHiredThisYear: 62,
      avgSalary: '$155,000',
      remotePercentage: 85,
    },
    openPositionsCount: 8,
    isVerified: true,
    overview: 'Databricks combines data warehouses and data lakes into a unified lakehouse architecture.',
    employeeTestimonial: {
      quote: 'AnalyticsRise candidates stand out because their SQL and Python simulator scores prove real hands-on proficiency.',
      author: 'Michael Chen',
      role: 'Senior Analytics Recruiter',
    },
  },
];

export class CompanyService {
  static getCompanies(): VerifiedCompany[] {
    return VERIFIED_COMPANIES;
  }

  static getCompanyById(id: string): VerifiedCompany | undefined {
    return VERIFIED_COMPANIES.find((c) => c.id === id) || VERIFIED_COMPANIES[0];
  }
}
