import { PlanTier, MEMBERSHIP_PLANS } from '@/lib/config/plans';
import { MembershipService } from './membershipService';

export type FeatureKey =
  | 'ai_mentor'
  | 'simulators'
  | 'certificates'
  | 'resume_builder'
  | 'interview_coach'
  | 'job_applications'
  | 'portfolio_export'
  | 'custom_domain'
  | 'storage';

export class EntitlementService {
  /**
   * Evaluate if a plan tier can access a given feature key
   */
  static canAccess(featureKey: FeatureKey, planId: PlanTier): boolean {
    const limits = MEMBERSHIP_PLANS[planId]?.limits;
    if (!limits) return false;

    switch (featureKey) {
      case 'ai_mentor':
        return limits.aiMentorQuota !== 0;
      case 'simulators':
        return limits.simulatorHours !== 0;
      case 'certificates':
        return limits.certificateAccess;
      case 'resume_builder':
        return limits.resumeBuilderQuota !== 0;
      case 'interview_coach':
        return limits.interviewCoachQuota !== 0;
      case 'job_applications':
        return limits.jobAppQuota !== 0;
      case 'portfolio_export':
        return limits.portfolioExportAllowed;
      case 'custom_domain':
        return limits.customDomainAllowed;
      case 'storage':
        return limits.storageMb > 0;
      default:
        return true;
    }
  }

  /**
   * Determine whether accessing a feature requires a plan upgrade
   */
  static requiresUpgrade(featureKey: FeatureKey, planId: PlanTier): boolean {
    return !this.canAccess(featureKey, planId);
  }

  /**
   * Calculate remaining numerical monthly usage for a specific feature key
   */
  static getRemainingUsage(featureKey: FeatureKey, currentUsage: number, planId: PlanTier): number {
    const limits = MEMBERSHIP_PLANS[planId]?.limits;
    if (!limits) return 0;

    let maxQuota = 0;
    switch (featureKey) {
      case 'ai_mentor':
        maxQuota = limits.aiMentorQuota;
        break;
      case 'simulators':
        maxQuota = limits.simulatorHours;
        break;
      case 'resume_builder':
        maxQuota = limits.resumeBuilderQuota;
        break;
      case 'interview_coach':
        maxQuota = limits.interviewCoachQuota;
        break;
      case 'job_applications':
        maxQuota = limits.jobAppQuota;
        break;
      default:
        return 9999;
    }

    if (maxQuota === -1) return Infinity; // Unlimited
    return Math.max(0, maxQuota - currentUsage);
  }

  /**
   * Get active plan definition for user
   */
  static getCurrentPlan(uid: string = 'demo-user'): PlanTier {
    return MembershipService.getSubscription(uid).planId;
  }
}
