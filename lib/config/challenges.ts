export type ChallengeDomain =
  | 'excel'
  | 'sql'
  | 'python'
  | 'tableau'
  | 'powerbi'
  | 'statistics'
  | 'interview';

export interface ChallengeOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface DailyChallenge {
  id: string;
  domain: ChallengeDomain;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  codeSnippet?: string;
  options: ChallengeOption[];
  explanation: string;
  xpReward: number;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch_excel_01',
    domain: 'excel',
    title: 'Dynamic Array Formulas',
    description: 'Master modern Excel formulas for dynamic data filtering.',
    difficulty: 'Intermediate',
    question: 'Which Excel formula extracts unique non-blank values from column A?',
    codeSnippet: '=UNIQUE(FILTER(A2:A100, A2:A100<>""))',
    options: [
      { id: 'opt_1', text: '=UNIQUE(FILTER(A2:A100, A2:A100<>""))', isCorrect: true },
      { id: 'opt_2', text: '=DISTINCT(A2:A100)', isCorrect: false },
      { id: 'opt_3', text: '=VLOOKUP(UNIQUE, A2:A100)', isCorrect: false },
      { id: 'opt_4', text: '=COUNTIF(UNIQUE(A2:A100))', isCorrect: false },
    ],
    explanation: '=UNIQUE combined with =FILTER creates a dynamic array containing unique values while filtering out empty cells.',
    xpReward: 50,
  },
  {
    id: 'ch_sql_01',
    domain: 'sql',
    title: 'Window Function Aggregation',
    description: 'Compute running totals and rankings without GROUP BY collapsing.',
    difficulty: 'Advanced',
    question: 'Which SQL clause computes a cumulative sum ordered by order_date?',
    codeSnippet: 'SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
    options: [
      { id: 'opt_1', text: 'SUM(amount) OVER (ORDER BY order_date)', isCorrect: true },
      { id: 'opt_2', text: 'SUM(amount) GROUP BY order_date', isCorrect: false },
      { id: 'opt_3', text: 'AGGREGATE(SUM(amount) WHERE order_date)', isCorrect: false },
      { id: 'opt_4', text: 'CUMULATIVE_SUM(amount) BY order_date', isCorrect: false },
    ],
    explanation: 'SUM(...) OVER (ORDER BY ...) defines a window frame that aggregates cumulative totals across chronological rows.',
    xpReward: 75,
  },
  {
    id: 'ch_python_01',
    domain: 'python',
    title: 'Pandas Vectorized Method Chaining',
    description: 'Optimize data transformation pipelines in Pandas.',
    difficulty: 'Intermediate',
    question: 'How do you filter a DataFrame df for rows where revenue > 10,000 and calculate mean profit?',
    codeSnippet: 'df.query("revenue > 10000")["profit"].mean()',
    options: [
      { id: 'opt_1', text: 'df.query("revenue > 10000")["profit"].mean()', isCorrect: true },
      { id: 'opt_2', text: 'df.filter(revenue > 10000).mean()', isCorrect: false },
      { id: 'opt_3', text: 'mean(df[revenue > 10000])', isCorrect: false },
      { id: 'opt_4', text: 'df.loc[revenue > 10000].sum()', isCorrect: false },
    ],
    explanation: 'df.query() performs fast expression evaluation, and ["profit"].mean() computes vector mean.',
    xpReward: 60,
  },
  {
    id: 'ch_stat_01',
    domain: 'statistics',
    title: 'P-Value Significance Thresholds',
    description: 'Evaluate statistical hypothesis testing results.',
    difficulty: 'Beginner',
    question: 'If a two-sample t-test yields p-value = 0.02 at alpha = 0.05, what is the statistical decision?',
    options: [
      { id: 'opt_1', text: 'Reject the Null Hypothesis (Statistically Significant)', isCorrect: true },
      { id: 'opt_2', text: 'Fail to Reject Null Hypothesis', isCorrect: false },
      { id: 'opt_3', text: 'Increase sample size until p > 0.05', isCorrect: false },
      { id: 'opt_4', text: 'Data is completely invalid', isCorrect: false },
    ],
    explanation: 'Since p-value (0.02) < alpha (0.05), we reject the null hypothesis in favor of the alternative hypothesis.',
    xpReward: 40,
  },
  {
    id: 'ch_tbl_01',
    domain: 'tableau',
    title: 'Tableau LOD Expressions',
    description: 'Master Fixed, Include, and Exclude calculation scopes in Tableau.',
    difficulty: 'Intermediate',
    question: 'Which Tableau LOD expression calculates regional sales total independent of view dimensions?',
    codeSnippet: '{ FIXED [Region] : SUM([Sales]) }',
    options: [
      { id: 'opt_1', text: '{ FIXED [Region] : SUM([Sales]) }', isCorrect: true },
      { id: 'opt_2', text: '{ INCLUDE [Region] : AVG([Sales]) }', isCorrect: false },
      { id: 'opt_3', text: 'TOTAL(SUM([Sales])) OVER [Region]', isCorrect: false },
      { id: 'opt_4', text: 'EXCLUDE([Sales]) BY [Region]', isCorrect: false },
    ],
    explanation: '{ FIXED [Region] : SUM([Sales]) } computes aggregated sales total strictly grouped by Region, ignoring view filters.',
    xpReward: 65,
  },
  {
    id: 'ch_pbi_01',
    domain: 'powerbi',
    title: 'Power BI DAX Time Intelligence',
    description: 'Calculate Year-Over-Year growth rates in Power BI using DAX.',
    difficulty: 'Advanced',
    question: 'Which DAX function shifts dates back by one year for cumulative comparison?',
    codeSnippet: 'SAMEPERIODLASTYEAR(Calendar[Date])',
    options: [
      { id: 'opt_1', text: 'SAMEPERIODLASTYEAR(Calendar[Date])', isCorrect: true },
      { id: 'opt_2', text: 'PREVIOUSYEAR(Sales[Amount])', isCorrect: false },
      { id: 'opt_3', text: 'DATEADD(Calendar[Date], -1, MONTH)', isCorrect: false },
      { id: 'opt_4', text: 'PARALLELPERIOD(1, YEAR)', isCorrect: false },
    ],
    explanation: 'SAMEPERIODLASTYEAR returns a table of dates shifted one year back, perfect for CALCULATE sales YoY metrics.',
    xpReward: 70,
  },
  {
    id: 'ch_int_01',
    domain: 'interview',
    title: 'FAANG Data Analyst System Design',
    description: 'Answer core product analytics and metric selection questions.',
    difficulty: 'Intermediate',
    question: 'If user retention drops by 15% after a product deployment, what is the first debugging step?',
    options: [
      { id: 'opt_1', text: 'Segment drop-offs by device, OS version, cohort date, and geography', isCorrect: true },
      { id: 'opt_2', text: 'Immediately rollback the entire database cluster', isCorrect: false },
      { id: 'opt_3', text: 'Increase marketing spend to acquire new replacement users', isCorrect: false },
      { id: 'opt_4', text: 'Ignore the metric as random statistical variance', isCorrect: false },
    ],
    explanation: 'Segmenting retention metrics across user cohorts and platforms identifies whether the drop is caused by a specific bug, release crash, or broad user behavior change.',
    xpReward: 80,
  },
];
