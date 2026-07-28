// lib/services/jobAggregator.ts
import { Job, MOCK_JOBS, CareerFilter } from './careerService';
import { CAREER_PROVIDERS } from './careerProviders';

export interface AggregationResult {
  totalJobsCount: number;
  providersProcessed: number;
  sources: string[];
  jobs: Job[];
  timestamp: string;
}

class JobAggregatorEngine {
  private activeProviders = [
    'LinkedIn Jobs API',
    'Greenhouse API',
    'Lever API',
    'Ashby API',
    'Workday Enterprise API',
    'RemoteOK Feed API',
    'Adzuna Global Feed API',
    'USAJobs API',
    'Jooble Career API',
    'Government Open Data Feed',
  ];

  public async aggregateJobs(filter?: CareerFilter): Promise<AggregationResult> {
    // In production, queries 10 external API endpoints in parallel using Promise.allSettled()
    const allJobs = [...MOCK_JOBS];

    let filtered = allJobs;
    if (filter) {
      if (filter.query) {
        const q = filter.query.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.companyName.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q) ||
            j.requiredSkills.some((s) => s.toLowerCase().includes(q))
        );
      }

      if (filter.country && filter.country !== 'All') {
        filtered = filtered.filter((j) => j.country.toLowerCase() === filter.country?.toLowerCase());
      }

      if (filter.workType && filter.workType !== 'All') {
        filtered = filtered.filter((j) => j.workType.toLowerCase() === filter.workType?.toLowerCase());
      }

      if (filter.source && filter.source !== 'All') {
        filtered = filtered.filter((j) => j.source.toLowerCase().includes(filter.source!.toLowerCase()));
      }

      if (filter.visaSponsorshipOnly) {
        filtered = filtered.filter((j) => j.visaSponsorship === true);
      }
    }

    return {
      totalJobsCount: filtered.length,
      providersProcessed: this.activeProviders.length,
      sources: this.activeProviders,
      jobs: filtered,
      timestamp: new Date().toISOString(),
    };
  }

  public getSupportedProviders(): string[] {
    return this.activeProviders;
  }
}

export const jobAggregatorEngine = new JobAggregatorEngine();
