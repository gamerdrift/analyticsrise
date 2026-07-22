'use client';

/**
 * AI Mentor Service Abstraction
 * Supports pluggable AI providers ('mock' | 'openai' | 'gemini' | 'custom')
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  suggestedActions?: string[];
}

export interface AIMentorContext {
  courseId?: string;
  lessonId?: string;
  simulatorType?: 'sql' | 'excel' | 'powerbi' | 'tableau' | 'python';
  currentCode?: string;
  errorMessage?: string;
  datasetName?: string;
  userRole?: string;
  userLevel?: number;
}

export interface AIMentorResponse {
  message: string;
  codeSnippet?: string;
  suggestedFollowUps?: string[];
}

export type AIProvider = 'mock' | 'openai' | 'gemini' | 'custom';

class AIMentorService {
  private provider: AIProvider = 'mock';
  private apiKey: string = '';
  private customEndpoint: string = '';

  constructor() {
    if (process.env.NEXT_PUBLIC_AI_PROVIDER) {
      this.provider = process.env.NEXT_PUBLIC_AI_PROVIDER as AIProvider;
    }
  }

  public setProvider(provider: AIProvider, options?: { apiKey?: string; customEndpoint?: string }) {
    this.provider = provider;
    if (options?.apiKey) this.apiKey = options.apiKey;
    if (options?.customEndpoint) this.customEndpoint = options.customEndpoint;
  }

  public async sendMessage(
    userMessage: string,
    context: AIMentorContext = {},
    history: ChatMessage[] = []
  ): Promise<AIMentorResponse> {
    if (this.provider === 'mock') {
      return this.generateMockResponse(userMessage, context);
    }
    // Reserved for OpenAI / Gemini / Custom REST endpoint integration
    return this.generateMockResponse(userMessage, context);
  }

  public getSuggestedQuestions(context: AIMentorContext = {}): string[] {
    if (context.simulatorType === 'sql') {
      return [
        'How do I optimize this SQL JOIN query?',
        'Explain the difference between INNER and LEFT JOIN.',
        'Why am I getting a syntax error near GROUP BY?',
        'Show me an example of a SQL Window function.',
      ];
    }
    if (context.simulatorType === 'excel') {
      return [
        'How do I write an XLOOKUP formula here?',
        'Explain how INDEX & MATCH works.',
        'How do I create a dynamic Pivot Table range?',
        'Fix my formula calculation error.',
      ];
    }
    if (context.simulatorType === 'python') {
      return [
        'How do I drop missing values in Pandas?',
        'Explain df.groupby() and agg() methods.',
        'How do I filter rows with condition logic?',
        'How do I plot a seaborn bar chart?',
      ];
    }
    if (context.simulatorType === 'powerbi' || context.simulatorType === 'tableau') {
      return [
        'How do I create a DAX calculate measure?',
        'Explain Star schema data modeling.',
        'What is a Tableau Fixed LOD expression?',
        'How do I configure cross-filtering?',
      ];
    }

    return [
      'What should I study next on my learning path?',
      'How do I earn more XP and level up fast?',
      'Can you explain my current lab assignment?',
      'How do cryptographic certificates work?',
    ];
  }

  private async generateMockResponse(
    userMessage: string,
    context: AIMentorContext
  ): Promise<AIMentorResponse> {
    // Artificial latency for natural interaction
    await new Promise((res) => setTimeout(res, 600));

    const msgLower = userMessage.toLowerCase();

    if (msgLower.includes('sql') || msgLower.includes('join') || context.simulatorType === 'sql') {
      if (msgLower.includes('join')) {
        return {
          message:
            'A JOIN combines rows from two tables based on a related column. An INNER JOIN returns matching records in both tables, whereas a LEFT JOIN keeps all records from the left table regardless of a match.',
          codeSnippet: `SELECT e.name, d.department_name\nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.id;`,
          suggestedFollowUps: ['How to optimize JOINs?', 'What is a FULL OUTER JOIN?', 'Show aggregate GROUP BY example'],
        };
      }
      return {
        message:
          'Your SQL statement looks good! Tip: Ensure your filtering columns in WHERE clauses are properly indexed for optimal query latency.',
        codeSnippet: `SELECT region, SUM(revenue) AS total_rev\nFROM sales\nWHERE status = 'COMPLETED'\nGROUP BY region\nHAVING SUM(revenue) > 50000;`,
        suggestedFollowUps: ['Explain HAVING vs WHERE', 'How to write Window functions?'],
      };
    }

    if (msgLower.includes('excel') || msgLower.includes('lookup') || context.simulatorType === 'excel') {
      return {
        message:
          'In modern Excel, XLOOKUP replaces both VLOOKUP and INDEX/MATCH. It searches a range or array and returns an item corresponding to the first match.',
        codeSnippet: `=XLOOKUP(A2, Customers[ID], Customers[Name], "Not Found")`,
        suggestedFollowUps: ['How to handle #N/A errors?', 'Explain SUMIFS with multiple criteria'],
      };
    }

    if (msgLower.includes('python') || msgLower.includes('pandas') || context.simulatorType === 'python') {
      return {
        message:
          'When working with DataFrames in Pandas, use `.groupby()` to aggregate grouped subsets of data cleanly.',
        codeSnippet: `import pandas as pd\n\ndf = pd.read_csv('sales.csv')\nsummary = df.groupby('region')['revenue'].agg(['sum', 'mean']).reset_index()\nprint(summary.head())`,
        suggestedFollowUps: ['How to clean NaN values?', 'Explain pivot_table in Pandas'],
      };
    }

    if (msgLower.includes('xp') || msgLower.includes('level') || msgLower.includes('streak')) {
      return {
        message:
          'You earn XP by completing simulator labs (+100-250 XP), passing course quizzes (+50 XP), and maintaining daily study streaks (+50 XP bonus per consecutive day)!',
        suggestedFollowUps: ['Show my current streak status', 'What achievements can I unlock next?'],
      };
    }

    return {
      message: `Great question! As your AI Mentor, I am analyzing your workspace context. I recommend continuing with your active milestone on your Career Roadmap. Feel free to ask about any SQL error, formula calculation, or dataset schema!`,
      suggestedFollowUps: ['What should I study next?', 'Explain SQL Window functions', 'How to build DAX measures?'],
    };
  }
}

export const aiMentorService = new AIMentorService();
