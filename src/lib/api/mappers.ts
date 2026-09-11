import { NewsItem, TechnologyDomain, TrendingBadgeType, User } from '@/types';

export const DOMAIN_TO_BACKEND: Record<string, string> = {
  'Artificial Intelligence': 'AI',
  'Generative AI': 'AI',
  'AI Agents': 'AI',
  'Machine Learning': 'AI',
  'Robotics': 'ROBOTICS',
  'Humanoid Robotics': 'ROBOTICS',
  'Cybersecurity': 'CYBERSECURITY',
  'Quantum Computing': 'QUANTUM',
  'Semiconductors': 'SEMICONDUCTORS',
  'GPUs & AI Infrastructure': 'SEMICONDUCTORS',
  'Smartphones': 'GADGETS',
  'Consumer Electronics': 'GADGETS',
  'Apple': 'GADGETS',
  'Google': 'SOFTWARE',
  'Microsoft': 'SOFTWARE',
  'Open Source': 'SOFTWARE',
  'Software Development': 'SOFTWARE',
  'Cloud Computing': 'CLOUD',
  'Space Technology': 'SPACE',
  'Autonomous Vehicles': 'ROBOTICS',
  'AR / VR': 'GADGETS',
  'Blockchain': 'STARTUPS',
  'FinTech': 'STARTUPS',
  'BioTech': 'OTHER',
  'Future Technology': 'OTHER',
};

export const BACKEND_TO_DOMAIN: Record<string, TechnologyDomain> = {
  AI: 'Artificial Intelligence',
  ROBOTICS: 'Robotics',
  CYBERSECURITY: 'Cybersecurity',
  QUANTUM: 'Quantum Computing',
  SEMICONDUCTORS: 'Semiconductors',
  GADGETS: 'Consumer Electronics',
  SOFTWARE: 'Software Development',
  CLOUD: 'Cloud Computing',
  SPACE: 'Space Technology',
  STARTUPS: 'Future Technology',
  OTHER: 'Future Technology',
};

const VALID_BACKEND_DOMAINS = new Set([
  'AI',
  'ROBOTICS',
  'CYBERSECURITY',
  'QUANTUM',
  'SEMICONDUCTORS',
  'GADGETS',
  'SOFTWARE',
  'CLOUD',
  'SPACE',
  'STARTUPS',
  'OTHER',
]);

export function toBackendDomain(domain: string): string {
  if (DOMAIN_TO_BACKEND[domain]) return DOMAIN_TO_BACKEND[domain];
  const upper = (domain || '').toUpperCase();
  if (VALID_BACKEND_DOMAINS.has(upper)) return upper;
  return 'OTHER';
}

export function toFrontendDomain(domain: string): TechnologyDomain {
  return BACKEND_TO_DOMAIN[domain] || (domain as TechnologyDomain) || 'Artificial Intelligence';
}

export function formatTimeAgo(dateInput: string | Date | number): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'Recently';
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function mapBackendArticleToNewsItem(item: any): NewsItem {
  const readTimeStr =
    typeof item.readTime === 'number'
      ? `${item.readTime} min read`
      : typeof item.readTime === 'string' && item.readTime
      ? item.readTime
      : '4 min read';

  return {
    id: item.id || `art-${Date.now()}`,
    title: item.title || '',
    summary: item.summary || item.description || '',
    content: item.content || item.summary || item.description || '',
    domain: toFrontendDomain(item.domain),
    source: item.sourceName || item.source || 'NEXBYTEES Intelligence',
    author: item.author?.name || item.authorName || 'NEXBYTEES Staff',
    publishedAt: item.publishedAt ? formatTimeAgo(item.publishedAt) : 'Recently',
    readTime: readTimeStr,
    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    trendingBadge: (item.trendingBadge as TrendingBadgeType) || (item.trendingScore > 85 ? 'TRENDING' : null),
    trendingScore: Math.round(Number(item.trendingScore) || 50),
    viewsCount: Number(item.viewCount ?? item.viewsCount ?? 0),
    isCommunitySubmission: Boolean(item.isCommunitySubmission ?? false),
    tags: Array.isArray(item.tags) ? item.tags : [],
    keyTakeaways: Array.isArray(item.keyTakeaways) ? item.keyTakeaways : [],
    relatedArticleIds: Array.isArray(item.relatedArticleIds) ? item.relatedArticleIds : [],
    isLiked: Boolean(item.isLiked ?? false),
    likesCount: Number(item._count?.likes ?? item.likesCount ?? item.likes ?? 0),
  };
}

export function mapBackendUserToFrontend(raw: any): User {
  const date = raw.createdAt ? new Date(raw.createdAt) : new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const joinedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  return {
    id: raw.id,
    name: raw.name || raw.username || 'Anonymous Contributor',
    email: raw.email,
    avatarUrl: raw.profileImage || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(raw.name || raw.email || 'user')}`,
    joinedDate,
    role: raw.role === 'ADMIN' ? 'Lead System Architect' : raw.role === 'CONTRIBUTOR' ? 'Senior Intelligence Contributor' : 'Community Member',
    bio: raw.bio || '',
    interests: Array.isArray(raw.techInterests) ? raw.techInterests : (raw.interests || []),
    isAdmin: raw.role === 'ADMIN' || raw.role === 'EDITOR',
  };
}

export function extractSavedStories(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.stories)) return data.stories;
  return [];
}

export function extractUserUploads(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.uploads)) return data.uploads;
  return [];
}

export function mapBackendSavedItemToNewsItem(item: any): NewsItem | null {
  if (!item) return null;
  const rawArticle = item.article || item;
  return mapBackendArticleToNewsItem(rawArticle);
}

export function mapBackendUploadToNewsItem(upload: any): NewsItem {
  return {
    ...mapBackendArticleToNewsItem(upload),
    isCommunitySubmission: true,
  };
}

