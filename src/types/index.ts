export type TechnologyDomain =
  | "Artificial Intelligence"
  | "Generative AI"
  | "AI Agents"
  | "Machine Learning"
  | "Robotics"
  | "Humanoid Robotics"
  | "Cybersecurity"
  | "Quantum Computing"
  | "Semiconductors"
  | "GPUs & AI Infrastructure"
  | "Smartphones"
  | "Consumer Electronics"
  | "Apple"
  | "Google"
  | "Microsoft"
  | "Open Source"
  | "Software Development"
  | "Cloud Computing"
  | "Space Technology"
  | "Autonomous Vehicles"
  | "AR / VR"
  | "Blockchain"
  | "FinTech"
  | "BioTech"
  | "Future Technology";

export type TrendingBadgeType = "TRENDING" | "HOT" | "RISING" | null;

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string; // Full editorial content for the article view
  domain: TechnologyDomain;
  source: string;
  author: string;
  publishedAt: string; // e.g. "12 mins ago" or ISO
  readTime: string; // e.g. "4 min read"
  imageUrl: string;
  trendingBadge?: TrendingBadgeType;
  trendingScore: number; // 0 - 100
  viewsCount: number;
  isCommunitySubmission?: boolean;
  tags: string[];
  keyTakeaways?: string[];
  relatedArticleIds?: string[];
  isLiked?: boolean;
  likesCount?: number;
}

export interface DomainMeta {
  name: TechnologyDomain;
  shortCode: string;
  description: string;
  iconName: string;
  articleCount: number;
  highlightColor: string; // Hex or tailwind class
  trendingTopic: string;
}

export interface UploadFormData {
  title: string;
  description: string;
  domain: TechnologyDomain;
  source: string;
  imageUrl: string;
  tags: string;
  content?: string;
}

export type FilterMode = "all" | "trending" | "latest";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  joinedDate: string;
  role?: string;
  bio?: string;
  interests?: string[];
  isAdmin?: boolean;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export type AuthMode = "login" | "signup" | "forgot" | "reset";
export type ProfileTab = "saved" | "uploads" | "settings";
