export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetRoute: string;
  featureKey: string;
  iconName: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'dashboard',
    title: 'Your Command Center',
    description: 'Track daily missions, learning goals, XP, and career progress in real time.',
    targetRoute: '/dashboard',
    featureKey: 'dashboard',
    iconName: 'LayoutDashboard',
  },
  {
    id: 'ai_mentor',
    title: '24/7 AI Mentor',
    description: 'Ask instant technical questions, debug SQL/Python code, and get career advice.',
    targetRoute: '/dashboard',
    featureKey: 'ai_mentor',
    iconName: 'Sparkles',
  },
  {
    id: 'excel_studio',
    title: 'Excel Studio Pro',
    description: 'Practice real formulas, VLOOKUP, INDEX/MATCH, and PivotTables in browser.',
    targetRoute: '/excel-studio',
    featureKey: 'excel_studio',
    iconName: 'FileSpreadsheet',
  },
  {
    id: 'sql_lab',
    title: 'Interactive SQL Lab',
    description: 'Execute queries on real PostgreSQL/SQLite datasets with instant execution feedback.',
    targetRoute: '/simulators/sql',
    featureKey: 'sql_lab',
    iconName: 'Database',
  },
  {
    id: 'python_lab',
    title: 'Python Data Science Studio',
    description: 'Run Pandas, NumPy, and Matplotlib notebooks directly in your browser.',
    targetRoute: '/python-lab',
    featureKey: 'python_lab',
    iconName: 'Code2',
  },
  {
    id: 'certifications',
    title: 'Verified Certifications',
    description: 'Earn industry-recognized certificates with verifiable credential IDs.',
    targetRoute: '/certifications',
    featureKey: 'certifications',
    iconName: 'Award',
  },
  {
    id: 'portfolio',
    title: 'Live Candidate Portfolio',
    description: 'Showcase verified code proofs and project builds directly to recruiters.',
    targetRoute: '/portfolio/demo',
    featureKey: 'portfolio',
    iconName: 'UserCheck',
  },
  {
    id: 'get_hired',
    title: 'Get Hired Global Jobs',
    description: 'Apply directly to aggregated global analytics opportunities matching your skills.',
    targetRoute: '/get-hired',
    featureKey: 'get_hired',
    iconName: 'Briefcase',
  },
];

const STORAGE_KEY = 'analyticsrise_onboarding_state';

export interface OnboardingState {
  completed: boolean;
  currentStepIndex: number;
  completedStepIds: string[];
  lastUpdatedIso: string;
}

export class OnboardingService {
  static getState(uid: string = 'demo-user'): OnboardingState {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse onboarding state:', e);
        }
      }
    }
    return {
      completed: false,
      currentStepIndex: 0,
      completedStepIds: [],
      lastUpdatedIso: new Date().toISOString(),
    };
  }

  static completeStep(stepId: string, uid: string = 'demo-user'): OnboardingState {
    const state = this.getState(uid);
    if (!state.completedStepIds.includes(stepId)) {
      state.completedStepIds.push(stepId);
    }
    state.currentStepIndex = Math.min(ONBOARDING_STEPS.length - 1, state.currentStepIndex + 1);
    if (state.completedStepIds.length >= ONBOARDING_STEPS.length) {
      state.completed = true;
    }
    state.lastUpdatedIso = new Date().toISOString();

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(state));
    }
    return state;
  }

  static completeAll(uid: string = 'demo-user'): OnboardingState {
    const state: OnboardingState = {
      completed: true,
      currentStepIndex: ONBOARDING_STEPS.length - 1,
      completedStepIds: ONBOARDING_STEPS.map((s) => s.id),
      lastUpdatedIso: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(state));
    }
    return state;
  }

  static reset(uid: string = 'demo-user'): OnboardingState {
    const state: OnboardingState = {
      completed: false,
      currentStepIndex: 0,
      completedStepIds: [],
      lastUpdatedIso: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(state));
    }
    return state;
  }
}
