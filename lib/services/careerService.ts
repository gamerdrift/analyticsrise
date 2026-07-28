// lib/services/careerService.ts

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  location: string;
  city?: string;
  state?: string;
  country: string;
  workType: 'Remote' | 'Hybrid' | 'Onsite';
  experience: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  openings: number;
  postedDate: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  techStack?: string[];
  requiredSkills: string[];
  department: string;
  applyUrl: string;
  source: string;
  visaSponsorship?: boolean;
  recruiterName?: string;
  recruiterEmail?: string;
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
  rating?: number;
  overview?: string;
}

export interface SavedJob {
  jobId: string;
  savedAt: string;
  notes?: string;
}

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Interview'
  | 'Technical Round'
  | 'HR Round'
  | 'Offer'
  | 'Rejected'
  | 'Accepted';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: ApplicationStatus;
  notes?: string;
  timeline?: Array<{ status: ApplicationStatus; date: string; note?: string }>;
}

export interface CareerFilter {
  query?: string;
  country?: string;
  state?: string;
  city?: string;
  workType?: string;
  experience?: string;
  skill?: string;
  source?: string;
  visaSponsorshipOnly?: boolean;
  minSalary?: number;
}

// Extended Sample Analytics Jobs
export const MOCK_JOBS: Job[] = [
  {
    id: 'job-101',
    companyId: 'comp-google',
    companyName: 'Google',
    companyLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80',
    title: 'Senior Data Analyst, Business Intelligence',
    location: 'Mountain View, CA',
    city: 'Mountain View',
    state: 'California',
    country: 'United States',
    workType: 'Hybrid',
    experience: 'Senior',
    salaryMin: 145000,
    salaryMax: 185000,
    currency: 'USD',
    openings: 3,
    postedDate: '2026-07-27',
    description: 'Lead business intelligence reporting, SQL data modeling, and executive dashboard delivery across cloud operations.',
    responsibilities: [
      'Architect enterprise SQL data pipelines in BigQuery',
      'Design interactive Looker and Tableau executive dashboards',
      'Collaborate with product and finance leaders on quarterly forecasts',
    ],
    requirements: [
      '5+ years experience in Business Intelligence or Data Analytics',
      'Advanced proficiency in SQL, Python, and Excel financial modeling',
      'Strong communication skills with executive stakeholders',
    ],
    benefits: ['Health, Dental, Vision', '401(k) 5% Match', 'Remote Choice', 'Gym & Wellness Allowance'],
    techStack: ['SQL', 'BigQuery', 'Looker', 'Python', 'Excel Studio'],
    requiredSkills: ['SQL', 'Excel', 'Python', 'Tableau', 'BigQuery'],
    department: 'Business Intelligence',
    applyUrl: 'https://careers.google.com',
    source: 'LinkedIn Jobs API',
    visaSponsorship: true,
    recruiterName: 'Sarah Jenkins',
    recruiterEmail: 'recruitment@google.com',
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
    city: 'Remote',
    state: 'Remote',
    country: 'United States',
    workType: 'Remote',
    experience: 'Mid',
    salaryMin: 130000,
    salaryMax: 160000,
    currency: 'USD',
    openings: 5,
    postedDate: '2026-07-28',
    description: 'Design and optimize data transformation models using SQL, dbt, and Snowflake data warehouses.',
    responsibilities: [
      'Build scalable dbt data transformations for Snowflake cloud data platform',
      'Manage data warehouse schemas and automated testing suits',
    ],
    requirements: [
      '3+ years with SQL and modern data stack (dbt, Snowflake, Fivetran)',
      'Experience with Python automation scripts',
    ],
    benefits: ['100% Remote Choice', 'Equity Grant Options', 'Unlimited PTO'],
    techStack: ['Snowflake', 'SQL', 'dbt', 'Python', 'AWS'],
    requiredSkills: ['SQL', 'Snowflake', 'Python', 'dbt', 'AWS'],
    department: 'Data Engineering',
    applyUrl: 'https://snowflake.com/careers',
    source: 'Greenhouse API',
    visaSponsorship: true,
    recruiterName: 'David Vance',
    recruiterEmail: 'talent@snowflake.com',
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
    city: 'Redmond',
    state: 'Washington',
    country: 'United States',
    workType: 'Hybrid',
    experience: 'Senior',
    salaryMin: 140000,
    salaryMax: 175000,
    currency: 'USD',
    openings: 2,
    postedDate: '2026-07-26',
    description: 'Build enterprise Power BI financial models, DAX measures, and interactive sales reporting suites.',
    responsibilities: [
      'Develop complex DAX calculations and Power BI tabular models',
      'Automate monthly revenue variance reporting for CFO org',
    ],
    requirements: [
      'Deep expertise in Power BI, DAX, SQL, and Excel Studio Pro',
    ],
    benefits: ['Hybrid Work Model', 'Healthcare', 'Parental Leave'],
    techStack: ['Power BI', 'DAX', 'Excel', 'SQL', 'Azure'],
    requiredSkills: ['Power BI', 'Excel', 'SQL', 'DAX', 'Azure'],
    department: 'Finance Analytics',
    applyUrl: 'https://careers.microsoft.com',
    source: 'Workday API',
    visaSponsorship: false,
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
    city: 'London',
    state: 'Greater London',
    country: 'United Kingdom',
    workType: 'Hybrid',
    experience: 'Mid',
    salaryMin: 85000,
    salaryMax: 110000,
    currency: 'GBP',
    openings: 4,
    postedDate: '2026-07-25',
    description: 'Deploy PySpark ML models, predictive customer churn algorithms, and real-time data pipelines.',
    responsibilities: [
      'Train and evaluate machine learning models in MLflow',
      'Optimize PySpark data pipelines on lakehouse architecture',
    ],
    requirements: ['M.Sc in Computer Science or Quantitative discipline', 'Proficiency in Python and PySpark'],
    benefits: ['Stock Options', 'Global Team Offsites', 'Health Perks'],
    techStack: ['Python', 'Databricks', 'PySpark', 'SQL', 'Machine Learning'],
    requiredSkills: ['Python', 'Databricks', 'SQL', 'Machine Learning', 'PySpark'],
    department: 'AI & Data Science',
    applyUrl: 'https://databricks.com/careers',
    source: 'Lever API',
    visaSponsorship: true,
    matchScore: 91,
  },
];

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
    rating: 4.6,
    overview: 'Google is a global technology leader focusing on search, cloud infrastructure, AI research, and consumer hardware.',
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
    rating: 4.5,
    overview: 'Snowflake enables organizations to mobilize data across cloud data warehouses.',
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

    if (filter.visaSponsorshipOnly) {
      result = result.filter((j) => j.visaSponsorship === true);
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
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }

    // Default sample applications if empty
    return [
      {
        id: 'app-001',
        jobId: 'job-101',
        jobTitle: 'Senior Data Analyst, Business Intelligence',
        companyName: 'Google',
        appliedDate: '2026-07-25',
        status: 'Interview Scheduled',
        notes: 'Technical SQL rounds scheduled for Thursday',
        timeline: [
          { status: 'Applied', date: '2026-07-25' },
          { status: 'Screening', date: '2026-07-26' },
          { status: 'Interview Scheduled', date: '2026-07-27' },
        ],
      },
      {
        id: 'app-002',
        jobId: 'job-102',
        jobTitle: 'Analytics Engineer',
        companyName: 'Snowflake',
        appliedDate: '2026-07-26',
        status: 'Applied',
        notes: 'Submitted resume and Excel simulation scorecard',
      },
    ];
  }

  public updateApplicationStatus(appId: string, newStatus: ApplicationStatus, note?: string): Application[] {
    if (typeof window === 'undefined') return [];
    const apps = this.getApplications();
    const updated = apps.map((app) => {
      if (app.id === appId) {
        const history = app.timeline || [{ status: app.status, date: app.appliedDate }];
        return {
          ...app,
          status: newStatus,
          notes: note || app.notes,
          timeline: [...history, { status: newStatus, date: new Date().toISOString().split('T')[0], note }],
        };
      }
      return app;
    });

    localStorage.setItem(this.applicationsKey, JSON.stringify(updated));
    return updated;
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
      timeline: [{ status: 'Applied', date: new Date().toISOString().split('T')[0], note: notes }],
    };

    if (typeof window !== 'undefined') {
      const apps = this.getApplications();
      const updated = [newApp, ...apps];
      localStorage.setItem(this.applicationsKey, JSON.stringify(updated));
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

    const headers = ['Company', 'Job Title', 'Location', 'Country', 'Work Type', 'Experience', 'Salary Range', 'Openings', 'Posted Date', 'Source', 'Visa Sponsorship', 'Apply URL'];
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
      `"${j.source}"`,
      j.visaSponsorship ? 'Yes' : 'No',
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
