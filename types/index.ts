
export type Plan = 'Basic' | 'Standard' | 'Premium';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  plan?: Plan;
  bannerUrl?: string;
}

export interface Item {
  id: string;
  user: User;
  imageUrl: string; // Main display image (thumbnail)
  images?: string[]; // Array of all images
  title: string;
  description: string;
  likes: number;
  comments: number;
  value: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  itemId: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface InboxThread {
  id: string;
  otherUser: User;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'follow' | 'system' | 'offer';
  text: string;
  createdAt: string;
  isRead: boolean;
  relatedUser?: User;
  relatedItem?: { id: string; imageUrl: string };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  timestamp: number;
}

export interface Review {
  id: string;
  targetUserId: string; // The shop being reviewed
  reviewer: User;
  rating: number; // 1-5
  text: string;
  createdAt: string;
}
