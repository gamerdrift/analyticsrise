import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/config';
import { PlanTier, MEMBERSHIP_PLANS, PlanDefinition } from '@/lib/config/plans';

export interface UserSubscription {
  uid: string;
  planId: PlanTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'cancel_at_period_end' | 'expired';
  billingCycle: 'monthly' | 'annual';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  provider?: 'razorpay' | 'stripe';
  subscriptionId?: string;
}

const STORAGE_KEY = 'analyticsrise_user_subscription';

export class MembershipService {
  /**
   * Fast synchronous retrieval (uses local cache with default fallback).
   * Note: For security-critical authorization, use fetchAuthoritativeSubscription().
   */
  static getSubscription(uid: string = 'demo-user'): UserSubscription {
    const targetUid = uid || auth.currentUser?.uid || 'demo-user';

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${targetUid}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse subscription from localStorage:', e);
        }
      }
    }

    // Default Fallback Plan for unauthenticated users
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    return {
      uid: targetUid,
      planId: 'free',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextMonth.toISOString(),
      cancelAtPeriodEnd: false,
    };
  }

  /**
   * Fetches the server-authoritative entitlement & subscription directly from Cloud Firestore.
   * Updates local cache upon retrieval.
   */
  static async fetchAuthoritativeSubscription(uid?: string): Promise<UserSubscription> {
    const targetUid = uid || auth.currentUser?.uid;
    if (!targetUid) {
      return this.getSubscription('demo-user');
    }

    try {
      const entDocRef = doc(db, 'entitlements', targetUid);
      const snap = await getDoc(entDocRef);

      if (snap.exists()) {
        const data = snap.data();
        const start = data.effectiveFrom?.toDate
          ? data.effectiveFrom.toDate().toISOString()
          : new Date().toISOString();
        const end = data.effectiveUntil?.toDate
          ? data.effectiveUntil.toDate().toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Check expiry against client clock
        const isExpired = new Date(end).getTime() <= Date.now();

        const authoritativeSub: UserSubscription = {
          uid: targetUid,
          planId: isExpired ? 'free' : (data.planId as PlanTier) || 'free',
          status: isExpired ? 'expired' : (data.status as any) || 'active',
          billingCycle: data.billingCycle || 'monthly',
          currentPeriodStart: start,
          currentPeriodEnd: end,
          cancelAtPeriodEnd: !!data.cancelAtPeriodEnd,
          provider: 'razorpay',
          subscriptionId: data.subscriptionId || undefined,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(`${STORAGE_KEY}_${targetUid}`, JSON.stringify(authoritativeSub));
        }

        return authoritativeSub;
      } else {
        // No entitlement document exists in Firestore - authoritative plan is free
        const freeSub: UserSubscription = {
          uid: targetUid,
          planId: 'free',
          status: 'active',
          billingCycle: 'monthly',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(`${STORAGE_KEY}_${targetUid}`, JSON.stringify(freeSub));
        }

        return freeSub;
      }
    } catch (e) {
      console.warn('Failed to fetch authoritative entitlement from Firestore:', e);
    }

    return this.getSubscription(targetUid);
  }

  /**
   * Subscribes to real-time entitlement mutations in Cloud Firestore.
   * Fires callback immediately and on every server-side mutation (webhook / verification).
   */
  static subscribeToSubscription(
    uid: string,
    onUpdate: (sub: UserSubscription) => void
  ): () => void {
    if (!uid || uid === 'demo-user') {
      onUpdate(this.getSubscription('demo-user'));
      return () => {};
    }

    try {
      const entDocRef = doc(db, 'entitlements', uid);
      return onSnapshot(
        entDocRef,
        (snap: any) => {
          if (snap.exists()) {
            const data = snap.data();
            const start = data.effectiveFrom?.toDate
              ? data.effectiveFrom.toDate().toISOString()
              : new Date().toISOString();
            const end = data.effectiveUntil?.toDate
              ? data.effectiveUntil.toDate().toISOString()
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

            const isExpired = new Date(end).getTime() <= Date.now();

            const sub: UserSubscription = {
              uid,
              planId: isExpired ? 'free' : (data.planId as PlanTier) || 'free',
              status: isExpired ? 'expired' : (data.status as any) || 'active',
              billingCycle: data.billingCycle || 'monthly',
              currentPeriodStart: start,
              currentPeriodEnd: end,
              cancelAtPeriodEnd: !!data.cancelAtPeriodEnd,
              provider: 'razorpay',
              subscriptionId: data.subscriptionId || undefined,
            };

            if (typeof window !== 'undefined') {
              localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(sub));
            }

            onUpdate(sub);
          } else {
            onUpdate(this.getSubscription(uid));
          }
        },
        (error: any) => {
          console.warn('Firestore subscription onSnapshot listener error:', error);
          onUpdate(this.getSubscription(uid));
        }
      );
    } catch (e) {
      onUpdate(this.getSubscription(uid));
      return () => {};
    }
  }

  /**
   * Save or update subscription plan in local cache (temporary fallback)
   */
  static updateSubscription(
    uid: string,
    planId: PlanTier,
    billingCycle: 'monthly' | 'annual' = 'monthly'
  ): UserSubscription {
    const now = new Date();
    const periodEnd = new Date(
      billingCycle === 'annual'
        ? now.getFullYear() + 1
        : now.getFullYear(),
      billingCycle === 'annual'
        ? now.getMonth()
        : now.getMonth() + 1,
      now.getDate()
    );

    const sub: UserSubscription = {
      uid,
      planId,
      status: 'active',
      billingCycle,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(sub));
    }

    return sub;
  }

  /**
   * Cancel subscription at period end
   */
  static cancelSubscription(uid: string): UserSubscription {
    const sub = this.getSubscription(uid);
    sub.cancelAtPeriodEnd = true;
    sub.status = 'canceled';
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(sub));
    }
    return sub;
  }

  /**
   * Retrieve full plan definition
   */
  static getPlanDefinition(planId: PlanTier): PlanDefinition {
    return MEMBERSHIP_PLANS[planId] || MEMBERSHIP_PLANS.free;
  }
}
