export interface ReferralItem {
  id: string;
  referredUserEmailMasked: string;
  status: 'signed_up' | 'upgraded_pro';
  dateIso: string;
  rewardEarned: string;
}

export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferred: number;
  totalUpgraded: number;
  xpEarned: number;
  proTrialDaysEarned: number;
  referrals: ReferralItem[];
}

const STORAGE_KEY = 'analyticsrise_user_referrals';

export class ReferralService {
  /**
   * Fetch user referral stats
   */
  static getReferralStats(uid: string = 'demo-user'): ReferralStats {
    const defaultCode = `ARISE-${uid.substring(0, 4).toUpperCase()}`;

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse referral stats:', e);
        }
      }
    }

    return {
      referralCode: defaultCode,
      referralLink: `https://analyticsrise.com/register?ref=${defaultCode}`,
      totalReferred: 3,
      totalUpgraded: 1,
      xpEarned: 750,
      proTrialDaysEarned: 14,
      referrals: [
        {
          id: 'ref_1',
          referredUserEmailMasked: 'al***@gmail.com',
          status: 'upgraded_pro',
          dateIso: '2026-07-20T14:30:00Z',
          rewardEarned: '500 XP + 14 Pro Days',
        },
        {
          id: 'ref_2',
          referredUserEmailMasked: 'jo***@yahoo.com',
          status: 'signed_up',
          dateIso: '2026-07-25T09:15:00Z',
          rewardEarned: '250 XP',
        },
      ],
    };
  }

  /**
   * Process a new referral code redemption
   */
  static recordReferral(code: string, newEmail: string): boolean {
    console.log(`[ReferralService] Processing referral code ${code} for ${newEmail}`);
    return true;
  }
}
