'use client';

export interface ExecutiveKpiState {
  business: {
    visitors: number;
    registrations: number;
    dau: number;
    wau: number;
    mau: number;
    premiumConversionRate: string;
    recruiterSignups: number;
    enterpriseAccounts: number;
    mrr: string;
    arr: string;
    churnRate: string;
    arpu: string;
    ltv: string;
  };
  learning: {
    courseCompletionRate: string;
    simulatorCompletionRate: string;
    interviewSuccessRate: string;
    resumeImprovementRate: string;
    certificationCompletionCount: number;
    jobPlacementRate: string;
  };
  growth: {
    referralConversionRate: string;
    avgSessionDurationMinutes: number;
    returningUsersPercentage: string;
    aiMentorQueriesTotal: number;
    portfolioViewsTotal: number;
    recruiterEngagementScore: number;
  };
}

export class ExecutiveAnalyticsService {
  static getExecutiveKpis(): ExecutiveKpiState {
    return {
      business: {
        visitors: 142000,
        registrations: 38400,
        dau: 12408,
        wau: 48200,
        mau: 142000,
        premiumConversionRate: '4.85%',
        recruiterSignups: 320,
        enterpriseAccounts: 45,
        mrr: '$128,400',
        arr: '$1,540,800',
        churnRate: '1.8%',
        arpu: '$42.50',
        ltv: '$890.00',
      },
      learning: {
        courseCompletionRate: '78.2%',
        simulatorCompletionRate: '84.6%',
        interviewSuccessRate: '72.1%',
        resumeImprovementRate: '91.4%',
        certificationCompletionCount: 2450,
        jobPlacementRate: '88.3%',
      },
      growth: {
        referralConversionRate: '14.2%',
        avgSessionDurationMinutes: 28.4,
        returningUsersPercentage: '68.5%',
        aiMentorQueriesTotal: 184000,
        portfolioViewsTotal: 42000,
        recruiterEngagementScore: 94,
      },
    };
  }
}
