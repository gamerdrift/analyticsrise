// lib/services/careerProviders.ts
import { Job, MOCK_JOBS } from './careerService';

export interface JobSearchQuery {
  keywords?: string;
  location?: string;
  country?: string;
  remoteOnly?: boolean;
  limit?: number;
  offset?: number;
}

export interface JobSearchResponse {
  providerName: string;
  totalResults: number;
  jobs: Job[];
  status: 'SUCCESS' | 'RATE_LIMITED' | 'UNAVAILABLE';
}

/**
 * CareerProvider Interface
 * Standardized provider abstraction contract for consuming official job board APIs,
 * ATS endpoints (Greenhouse, Lever, Workday, Ashby), and partner career feeds.
 */
export interface CareerProvider {
  name: string;
  type: 'ATS' | 'JOB_BOARD' | 'EMPLOYER_FEED';
  isConfigured: boolean;
  searchJobs(query: JobSearchQuery): Promise<JobSearchResponse>;
}

export class MockLinkedInProvider implements CareerProvider {
  name = 'LinkedIn Jobs API (Official Integration Contract)';
  type: 'JOB_BOARD' = 'JOB_BOARD';
  isConfigured = true;

  async searchJobs(query: JobSearchQuery): Promise<JobSearchResponse> {
    return {
      providerName: this.name,
      totalResults: MOCK_JOBS.length,
      jobs: MOCK_JOBS,
      status: 'SUCCESS',
    };
  }
}

export class MockGreenhouseProvider implements CareerProvider {
  name = 'Greenhouse ATS API';
  type: 'ATS' = 'ATS';
  isConfigured = true;

  async searchJobs(query: JobSearchQuery): Promise<JobSearchResponse> {
    return {
      providerName: this.name,
      totalResults: MOCK_JOBS.filter((j) => j.companyName === 'Snowflake' || j.companyName === 'Stripe').length,
      jobs: MOCK_JOBS.filter((j) => j.companyName === 'Snowflake' || j.companyName === 'Stripe'),
      status: 'SUCCESS',
    };
  }
}

export class MockLeverProvider implements CareerProvider {
  name = 'Lever ATS API';
  type: 'ATS' = 'ATS';
  isConfigured = true;

  async searchJobs(query: JobSearchQuery): Promise<JobSearchResponse> {
    return {
      providerName: this.name,
      totalResults: MOCK_JOBS.filter((j) => j.companyName === 'Databricks').length,
      jobs: MOCK_JOBS.filter((j) => j.companyName === 'Databricks'),
      status: 'SUCCESS',
    };
  }
}

export class MockAshbyProvider implements CareerProvider {
  name = 'Ashby ATS API';
  type: 'ATS' = 'ATS';
  isConfigured = true;

  async searchJobs(query: JobSearchQuery): Promise<JobSearchResponse> {
    return {
      providerName: this.name,
      totalResults: MOCK_JOBS.filter((j) => j.workType === 'Remote').length,
      jobs: MOCK_JOBS.filter((j) => j.workType === 'Remote'),
      status: 'SUCCESS',
    };
  }
}

export class MockWorkdayProvider implements CareerProvider {
  name = 'Workday Enterprise API';
  type: 'ATS' = 'ATS';
  isConfigured = true;

  async searchJobs(query: JobSearchQuery): Promise<JobSearchResponse> {
    return {
      providerName: this.name,
      totalResults: MOCK_JOBS.filter((j) => j.companyName === 'Google' || j.companyName === 'Microsoft').length,
      jobs: MOCK_JOBS.filter((j) => j.companyName === 'Google' || j.companyName === 'Microsoft'),
      status: 'SUCCESS',
    };
  }
}

export class MockRemoteProvider implements CareerProvider {
  name = 'RemoteOK & WeWorkRemotely API';
  type: 'EMPLOYER_FEED' = 'EMPLOYER_FEED';
  isConfigured = true;

  async searchJobs(query: JobSearchQuery): Promise<JobSearchResponse> {
    return {
      providerName: this.name,
      totalResults: MOCK_JOBS.filter((j) => j.workType === 'Remote').length,
      jobs: MOCK_JOBS.filter((j) => j.workType === 'Remote'),
      status: 'SUCCESS',
    };
  }
}

export class MockGovernmentJobsProvider implements CareerProvider {
  name = 'USAJOBS & Public Data Feed API';
  type: 'EMPLOYER_FEED' = 'EMPLOYER_FEED';
  isConfigured = true;

  async searchJobs(query: JobSearchQuery): Promise<JobSearchResponse> {
    return {
      providerName: this.name,
      totalResults: 1,
      jobs: [MOCK_JOBS[0]],
      status: 'SUCCESS',
    };
  }
}

export const CAREER_PROVIDERS: Record<string, CareerProvider> = {
  linkedIn: new MockLinkedInProvider(),
  greenhouse: new MockGreenhouseProvider(),
  lever: new MockLeverProvider(),
  ashby: new MockAshbyProvider(),
  workday: new MockWorkdayProvider(),
  remote: new MockRemoteProvider(),
  government: new MockGovernmentJobsProvider(),
};
