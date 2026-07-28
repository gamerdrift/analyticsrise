// lib/services/careerService.ts

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  location: string;
  country: string;
  workType: 'Remote' | 'Hybrid' | 'Onsite';
  experience: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  openings: number;
  postedDate: string;
  description: string;
  requiredSkills: string[];
  department: string;
  applyUrl: string;
  isFeatured?: boolean;
  matchScore?: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  headquarters: string;
  country: string;
  size: string;
  website: string;
  hiringStatus: 'Active Hiring' | 'High Demand' | 'Selective';
  totalOpenJobs: number;
  technologies: string[];
  benefits: string[];
}

export interface SavedJob {
  jobId: string;
  savedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: 'Applied' | 'Screening' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected';
  notes?: string;
}

export interface CareerFilter {
  query?: string;
  country?: string;
  workType?: string;
  experience?: string;
  skill?: string;
}

// Sample Enterprise Analytics Jobs Dataset
export const MOCK_JOBS: Job[] = [
  {
    id: 'job-101',
    companyId: 'comp-google',
    companyName: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80',
    title: 'Senior Data Analyst, Business Intelligence',
    location: 'Mountain View, CA',
    country: 'United States',
    workType: 'Hybrid',
    experience: 'Senior',
    salaryMin: 145000,
    salaryMax: 185000,
    currency: 'USD',
    openings: 3,
    postedDate: '2026-07-27',
    description: 'Lead business intelligence reporting, SQL data modeling, and executive dashboard delivery across cloud operations.',
    requiredSkills: ['SQL', 'Excel', 'Python', 'Tableau', 'BigQuery'],
    department: 'Business Intelligence',
    applyUrl: 'https://careers.google.com',
    isFeatured: true,
    matchScore: 95,
  },
  {
    id: 'job-102',
    companyId: 'comp-[#00E5FF]',
    companyName: 'Snowflake',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    title: 'Analytics Engineer, Data Warehouse Architecture',
    location: 'Remote - US',
    country: 'United States',
    workType: 'Remote',
    experience: 'Mid',
    salaryMin: 130000,
    salaryMax: 160000,
    currency: 'USD',
    openings: 5,
    postedDate: '2026-07-28',
    description: 'Design and optimize data transformation models using SQL, dbt, and Snowflake data warehouses.',
    requiredSkills: ['SQL', 'Snowflake', 'Python', 'dbt', 'AWS'],
    department: 'Data Engineering',
    applyUrl: 'https://snowflake.com/careers',
    isFeatured: true,
    matchScore: 92,
  },
  {
    id: 'job-103',
    companyId: 'comp-microsoft',
    companyName: 'Microsoft',
    companyLogo: 'https://images.unsplash.com/photo-1642132652806-695029a1a6f3?w=100&auto=format&fit=crop&q=80',
    title: 'Power BI & Financial Analytics Lead',
    location: 'Redmond, WA',
    country: 'United States',
    workType: 'Hybrid',
    experience: 'Senior',
    salaryMin: 140000,
    salaryMax: 175000,
    currency: 'USD',
    openings: 2,
    postedDate: '2026-07-26',
    description: 'Build enterprise Power BI financial models, DAX measures, and interactive sales reporting suites.',
    requiredSkills: ['Power BI', 'Excel', 'SQL', 'DAX', 'Azure'],
    department: 'Finance Analytics',
    applyUrl: 'https://careers.microsoft.com',
    isFeatured: true,
    matchScore: 89,
  },
  {
    id: 'job-104',
    companyId: 'comp-[#00E5FF]-databricks',
    companyName: 'Databricks',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    title: 'Data Scientist, Machine Learning Solutions',
    location: 'London',
    country: 'United Kingdom',
    workType: 'Hybrid',
    experience: 'Mid',
    salaryMin: 85000,
    salaryMax: 110000,
    currency: 'GBP',
    openings: 4,
    postedDate: '2026-07-25',
    description: 'Deploy PySpark ML models, predictive customer churn algorithms, and real-time data pipelines.',
    requiredSkills: ['Python', 'Databricks', 'SQL', 'Machine Learning', 'PySpark'],
    department: 'AI & Data Science',
    applyUrl: 'https://databricks.com/careers',
    matchScore: 91,
  },
  {
    id: 'job-105',
    companyId: 'comp-stripe',
    companyName: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67e0e7a2b9?w=100&auto=format&fit=crop&q=80',
    title: 'Financial Data Analyst, Risk & Fraud',
    location: 'Remote - Worldwide',
    country: 'Remote',
    workType: 'Remote',
    experience: 'Entry',
    salaryMin: 95000,
    salaryMax: 120000,
    currency: 'USD',
    openings: 6,
    postedDate: '2026-07-28',
    description: 'Analyze payment transaction flows using SQL queries, Python data analysis scripts, and risk anomaly detection.',
    requiredSkills: ['SQL', 'Excel', 'Python', 'Tableau'],
    department: 'Risk & Compliance',
    applyUrl: 'https://stripe.com/jobs',
    matchScore: 88,
  },
  {
    id: 'job-106',
    companyId: 'comp-amazon',
    companyName: 'Amazon',
    companyLogo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&auto=format&fit=crop&q=80',
    title: 'Supply Chain Business Intelligence Engineer',
    location: 'Bengaluru',
    country: 'India',
    workType: 'Onsite',
    experience: 'Mid',
    salaryMin: 2400000,
    salaryMax: 3200000,
    currency: 'INR',
    openings: 8,
    postedDate: '2026-07-27',
    description: 'Optimize fulfillment center operations using QuickSight dashboards, Redshift SQL queries, and Python scripting.',
    requiredSkills: ['SQL', 'Excel', 'Python', 'AWS', 'Redshift'],
    department: 'Supply Chain Analytics',
    applyUrl: 'https://amazon.jobs',
    matchScore: 87,
  },
  {
    id: 'job-107',
    companyId: 'comp-jpmorgan',
    companyName: 'JPMorgan Chase',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&auto=format&fit=crop&q=80',
    title: 'Quantitative Risk Analyst',
    location: 'New York, NY',
    country: 'United States',
    workType: 'Onsite',
    experience: 'Senior',
    salaryMin: 155000,
    salaryMax: 195000,
    currency: 'USD',
    openings: 2,
    postedDate: '2026-07-24',
    description: 'Perform Monte Carlo simulations, complex Excel financial modeling, and Python portfolio stress testing.',
    requiredSkills: ['Excel', 'Python', 'SQL', 'R', 'Finance'],
    department: 'Quantitative Research',
    applyUrl: 'https://jpmorgan.com/careers',
    matchScore: 84,
  },
  {
    id: 'job-108',
    companyId: 'comp-spotify',
    companyName: 'Spotify',
    companyLogo: 'https://images.unsplash.com/photo-1614680376593-902f749f7cfc?w=100&auto=format&fit=crop&q=80',
    title: 'Product Data Analyst, Creator Growth',
    location: 'Stockholm / Remote',
    country: 'Germany',
    workType: 'Remote',
    experience: 'Mid',
    salaryMin: 75000,
    salaryMax: 95000,
    currency: 'EUR',
    openings: 3,
    postedDate: '2026-07-27',
    description: 'Design A/B tests, measure podcast creator engagement, and build automated Tableau performance dashboards.',
    requiredSkills: ['SQL', 'Tableau', 'Python', 'A/B Testing'],
    department: 'Product Analytics',
    applyUrl: 'https://lifeatspotify.com',
    matchScore: 90,
  },
];

// Sample Companies Dataset
export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-google',
    name: 'Google',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80',
    industry: 'Technology & Cloud',
    headquarters: 'Mountain View, CA',
    country: 'United States',
    size: '100,000+ employees',
    website: 'https://careers.google.com',
    hiringStatus: 'Active Hiring',
    totalOpenJobs: 42,
    technologies: ['SQL', 'Python', 'BigQuery', 'TensorFlow', 'Looker'],
    benefits: ['Remote Work Options', 'Health Care', '401k Matching', 'Learning Stipend'],
  },
  {
    id: 'comp-snowflake',
    name: 'Snowflake',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    industry: 'Data Cloud Platform',
    headquarters: 'Bozeman, MT',
    country: 'United States',
    size: '5,000 - 10,000 employees',
    website: 'https://snowflake.com',
    hiringStatus: 'High Demand',
    totalOpenJobs: 28,
    technologies: ['Snowflake', 'SQL', 'dbt', 'Python', 'AWS'],
    benefits: ['100% Remote Choice', 'Equity Grants', 'Unlimited PTO', 'Wellness Budget'],
  },
  {
    id: 'comp-microsoft',
    name: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1642132652806-695029a1a6f3?w=100&auto=format&fit=crop&q=80',
    industry: 'Software & Cloud',
    headquarters: 'Redmond, WA',
    country: 'United States',
    size: '100,000+ employees',
    website: 'https://careers.microsoft.com',
    hiringStatus: 'Active Hiring',
    totalOpenJobs: 56,
    technologies: ['Power BI', 'Azure', 'SQL', 'DAX', 'Excel'],
    benefits: ['Hybrid Schedule', 'Healthcare', 'Parental Leave', 'Tuition Reimbursement'],
  },
  {
    id: 'comp-databricks',
    name: 'Databricks',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    industry: 'AI & Data Intelligence',
    headquarters: 'San Francisco, CA',
    country: 'United States',
    size: '5,000 - 10,000 employees',
    website: 'https://databricks.com',
    hiringStatus: 'High Demand',
    totalOpenJobs: 34,
    technologies: ['Databricks', 'PySpark', 'Python', 'SQL', 'Machine Learning'],
    benefits: ['Flexible Work', 'Stock Options', 'Global Offsites', 'Health Perks'],
  },
];

class CareerService {
  private savedJobsKey = 'analyticsrise_saved_jobs';
  private applicationsKey = 'analyticsrise_job_applications';

  public getJobs(filter?: CareerFilter): Job[] {
    let result = [...MOCK_JOBS];

    if (!filter) return result;

    if (filter.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filter.country && filter.country !== 'All') {
      result = result.filter((j) => j.country.toLowerCase() === filter.country?.toLowerCase());
    }

    if (filter.workType && filter.workType !== 'All') {
      result = result.filter((j) => j.workType.toLowerCase() === filter.workType?.toLowerCase());
    }

    if (filter.experience && filter.experience !== 'All') {
      result = result.filter((j) => j.experience.toLowerCase() === filter.experience?.toLowerCase());
    }

    if (filter.skill && filter.skill !== 'All') {
      result = result.filter((j) => j.requiredSkills.includes(filter.skill!));
    }

    return result;
  }

  public getJobById(id: string): Job | undefined {
    return MOCK_JOBS.find((j) => j.id === id);
  }

  public getCompanies(): Company[] {
    return MOCK_COMPANIES;
  }

  public getCompanyById(id: string): Company | undefined {
    return MOCK_COMPANIES.find((c) => c.id === id);
  }

  public getSavedJobIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.savedJobsKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public toggleSaveJob(jobId: string): boolean {
    if (typeof window === 'undefined') return false;
    const saved = this.getSavedJobIds();
    let isSaved = false;
    let nextSaved: string[] = [];

    if (saved.includes(jobId)) {
      nextSaved = saved.filter((id) => id !== jobId);
      isSaved = false;
    } else {
      nextSaved = [...saved, jobId];
      isSaved = true;
    }

    localStorage.setItem(this.savedJobsKey, JSON.stringify(nextSaved));
    return isSaved;
  }

  public getApplications(): Application[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.applicationsKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public applyToJob(jobId: string, notes?: string): Application {
    const job = this.getJobById(jobId);
    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job?.title || 'Data Analyst Role',
      companyName: job?.companyName || 'Enterprise Partner',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      notes,
    };

    if (typeof window !== 'undefined') {
      const apps = this.getApplications();
      localStorage.setItem(this.applicationsKey, JSON.stringify([newApp, ...apps]));
    }

    return newApp;
  }

  public calculateCareerMatch(userScore: number = 88): {
    score: number;
    recommendedSkills: string[];
    recommendedCourses: string[];
    recommendedJobs: Job[];
  } {
    return {
      score: userScore,
      recommendedSkills: ['Snowflake', 'Databricks', 'dbt', 'BigQuery'],
      recommendedCourses: ['Excel Studio Pro Masterclass', 'Advanced SQL Query Tuning', 'Python for Financial Modeling'],
      recommendedJobs: MOCK_JOBS.slice(0, 3),
    };
  }

  public exportJobsToCSV(jobs: Job[]): void {
    if (typeof window === 'undefined') return;

    const headers = ['Company', 'Job Title', 'Location', 'Country', 'Work Type', 'Experience', 'Salary Range', 'Openings', 'Posted Date', 'Apply URL'];
    const rows = jobs.map((j) => [
      `"${j.companyName}"`,
      `"${j.title}"`,
      `"${j.location}"`,
      `"${j.country}"`,
      `"${j.workType}"`,
      `"${j.experience}"`,
      `"${j.currency} ${j.salaryMin.toLocaleString()} - ${j.salaryMax.toLocaleString()}"`,
      j.openings,
      `"${j.postedDate}"`,
      `"${j.applyUrl}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `analyticsrise_career_jobs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const careerService = new CareerService();
