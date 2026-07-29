export type NotificationCategory =
  | 'welcome'
  | 'weekly_summary'
  | 'daily_challenge'
  | 'certificate'
  | 'ai_recommendation'
  | 'job_alert'
  | 'trial_reminder';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestampIso: string;
  read: boolean;
  actionRoute?: string;
  actionText?: string;
}

const STORAGE_KEY = 'analyticsrise_notifications';

export class NotificationService {
  /**
   * Fetch in-app notifications
   */
  static getNotifications(uid: string = 'demo-user'): AppNotification[] {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse notifications:', e);
        }
      }
    }

    return [
      {
        id: 'notif_1',
        category: 'daily_challenge',
        title: 'Daily Challenge Ready! ⚡',
        message: "Today's Excel & SQL challenge is live. Complete it to earn +50 XP and protect your streak!",
        timestampIso: new Date().toISOString(),
        read: false,
        actionRoute: '/dashboard',
        actionText: 'Start Challenge',
      },
      {
        id: 'notif_2',
        category: 'job_alert',
        title: '3 New Jobs Match Your Profile 🎯',
        message: 'Snowflake, Databricks, and Stripe posted new Remote Data Analyst roles.',
        timestampIso: new Date(Date.now() - 3600000 * 4).toISOString(),
        read: false,
        actionRoute: '/get-hired',
        actionText: 'View Jobs',
      },
      {
        id: 'notif_3',
        category: 'ai_recommendation',
        title: 'AI Skill Gap Alert 💡',
        message: 'Your SQL window functions score can be improved by trying the Advanced SQL Lab.',
        timestampIso: new Date(Date.now() - 3600000 * 24).toISOString(),
        read: true,
        actionRoute: '/simulators/sql',
        actionText: 'Launch Lab',
      },
    ];
  }

  /**
   * Mark notification as read
   */
  static markAsRead(id: string, uid: string = 'demo-user'): AppNotification[] {
    const list = this.getNotifications(uid);
    const item = list.find((n) => n.id === id);
    if (item) {
      item.read = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(list));
      }
    }
    return list;
  }

  /**
   * Get unread count
   */
  static getUnreadCount(uid: string = 'demo-user'): number {
    return this.getNotifications(uid).filter((n) => !n.read).length;
  }

  /**
   * Extensible Email Provider Integration Architecture (SendGrid / Resend / AWS SES)
   */
  static async dispatchEmailNotification(
    category: NotificationCategory,
    recipientEmail: string,
    payload: Record<string, any>
  ): Promise<{ success: boolean; messageId: string }> {
    console.log(`[NotificationService Email Dispatch] Category: ${category} | To: ${recipientEmail}`, payload);
    return {
      success: true,
      messageId: `msg_${category}_${Date.now()}`,
    };
  }
}
