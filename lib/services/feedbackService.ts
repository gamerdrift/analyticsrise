'use client';

import { FirestoreService } from './firestore';
import { logger } from '../utils/logger';

export type FeedbackType = 'bug' | 'feature' | 'general';

export interface BetaFeedbackSubmission {
  id?: string;
  userId?: string;
  userEmail?: string;
  type: FeedbackType;
  title: string;
  description: string;
  rating?: number; // 1 to 5
  pageUrl?: string;
  screenshotUrl?: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

class FeedbackService {
  /**
   * Submit beta learner feedback entry to Firestore collection `feedback`
   */
  public async submitFeedback(
    submission: Omit<BetaFeedbackSubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<string> {
    const payload: BetaFeedbackSubmission = {
      ...submission,
      status: 'new',
      createdAt: new Date().toISOString(),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    };

    logger.info('FEEDBACK', 'Submitting Beta Feedback entry:', payload);
    const docId = await FirestoreService.addDocument('feedback', payload);
    return docId;
  }
}

export const feedbackService = new FeedbackService();
