// Community related TypeScript types

export type PostType = 'project' | 'dashboard' | 'certificate' | 'question' | 'answer';

export interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string; // HTML sanitized string
  type: PostType;
  tags?: string[];
  visibility?: 'public' | 'private' | 'followers';
  createdAt: number; // timestamp ms
  updatedAt?: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string; // sanitized HTML
  createdAt: number;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  postId: string;
  userId: string;
  createdAt: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
}

export interface UserBadge {
  badgeId: string;
  userId: string;
  earnedAt: number;
}

export interface Certificate {
  id: string;
  userId: string;
  title: string;
  issuedAt: number;
  qrCodeUrl?: string;
  verificationUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string; // e.g., 'like', 'comment', 'badge', 'announcement'
  payload: any; // arbitrary JSON payload
  read: boolean;
  createdAt: number;
}
