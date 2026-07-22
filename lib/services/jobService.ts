'use client';

/**
 * Job Intelligence Service (Module E)
 * Abstracted job provider service for job search, recommended roles, and application tracker pipeline.
 */

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  isRemote: boolean;
  type: 'Full-time' | 'Contract' | 'Internship';
  salaryRange: string;
  matchScore: number; // 0 - 100
  postedDate: string;
  skillsRequired: string[];
  description: string;
  applicationUrl?: string;
}

export interface ApplicationTrackerItem {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Archived';
  appliedDate: string;
  notes?: string;
}

export const MOCK_JOBS: JobPosting[] = [
  {
    id: 'job-101',
    title: 'Senior Data Analyst (SQL & Power BI)',
    company: 'FinTech Dynamics',
    location: 'San Francisco, CA',
    isRemote: true,
    type: 'Full-time',
    salaryRange: '$110,000 - $135,000',
    matchScore: 94,
    postedDate: '2 days ago',
    skillsRequired: ['SQL', 'Power BI', 'DAX', 'Snowflake'],
    description: 'We are seeking a Senior Data Analyst to design executive reporting dashboards and query transaction ledgers.',
  },
  {
    id: 'job-102',
    title: 'BI Solutions Developer',
    company: 'Apex Logistics Tech',
    location: 'New York, NY',
    isRemote: true,
    type: 'Full-time',
    salaryRange: '$105,000 - $125,000',
    matchScore: 88,
    postedDate: '1 day ago',
    skillsRequired: ['Power BI', 'Tableau', 'Star Schema', 'SQL'],
    description: 'Join our business intelligence team to architect enterprise data semantic models and LOD Tableau workbooks.',
  },
  {
    id: 'job-103',
    title: 'Junior Analytics Engineer Internship',
    company: 'Cloud Data Labs',
    location: 'Austin, TX',
    isRemote: true,
    type: 'Internship',
    salaryRange: '$40 - $50 / hr',
    matchScore: 91,
    postedDate: '3 days ago',
    skillsRequired: ['SQL', 'Python', 'Excel', 'dbt'],
    description: 'Great entry opportunity for graduating analysts. Learn dbt, SQL transformation pipelines, and GitHub workflows.',
  },
  {
    id: 'job-104',
    title: 'Python Data Scientist (Pandas & ML)',
    company: 'AI Vanguard Labs',
    location: 'Boston, MA',
    isRemote: false,
    type: 'Full-time',
    salaryRange: '$130,000 - $160,000',
    matchScore: 82,
    postedDate: '4 days ago',
    skillsRequired: ['Python', 'Pandas', 'Scikit-Learn', 'SQL'],
    description: 'Build predictive churn algorithms and deploy automated ML inference models in microservice architectures.',
  },
];

export const INITIAL_APPLICATIONS: ApplicationTrackerItem[] = [
  {
    id: 'app-1',
    jobId: 'job-101',
    title: 'Senior Data Analyst',
    company: 'FinTech Dynamics',
    location: 'San Francisco, CA (Remote)',
    salary: '$110,000 - $135,000',
    status: 'Interviewing',
    appliedDate: '2026-07-18',
    notes: 'Technical SQL interview scheduled for Thursday.',
  },
  {
    id: 'app-2',
    jobId: 'job-102',
    title: 'BI Solutions Developer',
    company: 'Apex Logistics Tech',
    location: 'New York, NY',
    salary: '$105,000 - $125,000',
    status: 'Applied',
    appliedDate: '2026-07-20',
  },
  {
    id: 'app-3',
    jobId: 'job-103',
    title: 'Junior Analytics Engineer Internship',
    company: 'Cloud Data Labs',
    location: 'Austin, TX (Remote)',
    salary: '$45 / hr',
    status: 'Saved',
    appliedDate: '2026-07-21',
  },
];

class JobService {
  public getJobs(filter?: { keyword?: string; remoteOnly?: boolean; type?: string }): JobPosting[] {
    let result = MOCK_JOBS;
    if (filter?.remoteOnly) {
      result = result.filter((j) => j.isRemote);
    }
    if (filter?.type && filter.type !== 'All') {
      result = result.filter((j) => j.type === filter.type);
    }
    if (filter?.keyword) {
      const kw = filter.keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.skillsRequired.some((s) => s.toLowerCase().includes(kw))
      );
    }
    return result;
  }
}

export const jobService = new JobService();
