'use client';

export type FeedbackCategory = 'bug' | 'feature_request' | 'course_rating' | 'simulator_rating' | 'ai_mentor';
export type FeedbackType = 'bug' | 'feature' | 'general' | FeedbackCategory;

export interface UserFeedbackItem {
  id: string;
  category: FeedbackCategory;
  type?: FeedbackType;
  title: string;
  description: string;
  rating?: number; // 1-5
  upvotesCount: number;
  status: 'under_review' | 'planned' | 'completed';
  createdAtIso: string;
  userId?: string;
  userEmail?: string;
}

export const DEMO_FEEDBACK_ITEMS: UserFeedbackItem[] = [
  {
    id: 'fb_1',
    category: 'feature_request',
    type: 'feature',
    title: 'Add Snowflake DWH SQL Execution Lab',
    description: 'Support Snowflake dialect syntax (QUALIFY, ZEROIFNULL) in SQL Lab sandbox.',
    upvotesCount: 142,
    status: 'planned',
    createdAtIso: '2026-07-28T10:00:00Z',
  },
  {
    id: 'fb_2',
    category: 'simulator_rating',
    type: 'general',
    title: 'Excel Studio PivotTable Interactive Task Rating',
    description: 'The PivotTable drag-and-drop builder is smooth and responsive.',
    rating: 5,
    upvotesCount: 98,
    status: 'completed',
    createdAtIso: '2026-07-27T14:30:00Z',
  },
  {
    id: 'fb_3',
    category: 'ai_mentor',
    type: 'general',
    title: 'AI Career Copilot Weekly Action Plan',
    description: 'The weekly step-by-step roadmap helped me bridge my SQL window function gap.',
    rating: 5,
    upvotesCount: 84,
    status: 'completed',
    createdAtIso: '2026-07-29T18:00:00Z',
  },
];

export class FeedbackService {
  static getFeedbackList(): UserFeedbackItem[] {
    return DEMO_FEEDBACK_ITEMS;
  }

  static submitFeedback(item: Partial<UserFeedbackItem>): UserFeedbackItem {
    const newItem: UserFeedbackItem = {
      id: `fb_${Date.now()}`,
      category: (item.category as FeedbackCategory) || 'feature_request',
      type: item.type || 'general',
      title: item.title || 'User Feedback',
      description: item.description || '',
      rating: item.rating || 5,
      upvotesCount: 1,
      status: 'under_review',
      createdAtIso: new Date().toISOString(),
      userId: item.userId,
      userEmail: item.userEmail,
    };
    DEMO_FEEDBACK_ITEMS.unshift(newItem);
    return newItem;
  }

  public async submitFeedback(item: Partial<UserFeedbackItem>): Promise<UserFeedbackItem> {
    return FeedbackService.submitFeedback(item);
  }
}

export const feedbackService = new FeedbackService();
