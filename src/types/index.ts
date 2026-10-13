export type UIStyleId = 
  | 'skeuomorphism'
  | 'neomorphism'
  | 'glassmorphism'
  | 'claymorphism'
  | 'minimalism'
  | 'maximalism'
  | 'brutalism'
  | 'liquid-glass'
  | 'bento-grid'
  | 'spatial-ui';

export interface UIStyleInfo {
  id: UIStyleId;
  name: string;
  role: string;
  appliedTo: string;
  badgeColor: string;
  description: string;
}

export type ViewTab = 
  | 'feed'
  | 'dashboard'
  | 'memories'
  | 'friends'
  | 'favorites'
  | 'admin'
  | 'settings';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'admin' | 'member';
  status: 'approved' | 'pending' | 'suspended';
  bio: string;
  mutualCount: number;
  joinedDate: string;
  memoriesCount: number;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  author: User;
  caption: string;
  photos: string[];
  location?: string;
  createdAt: string;
  likesCount: number;
  hasLiked: boolean;
  saved: boolean;
  comments: Comment[];
  // Special style integration tags
  variant?: 'minimal' | 'skeuomorphic' | 'maximalist' | 'spatial';
  celebrationTitle?: string;
  celebrationType?: 'birthday' | 'roadtrip' | 'anniversary' | 'milestone';
  memoryDate?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  yearAgo: string;
  photos: string[];
  story: string;
  author: User;
  mood: string;
  style: 'polaroid' | 'maximalist' | 'spatial';
  tags: string[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'invite' | 'memory' | 'admin';
  user: User;
  message: string;
  targetPostId?: string;
  timeAgo: string;
  read: boolean;
}

export interface AuditLogItem {
  id: string;
  admin: string;
  action: string;
  targetUser: string;
  timestamp: string;
  status: 'APPROVED' | 'REVOKED' | 'MODERATED' | 'PENDING';
  details: string;
}
