import { NewsDomain } from '@prisma/client';
import { ENV } from '../../config/env';

export interface NormalizedNewsArticle {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  domain: NewsDomain;
  tags: string[];
  publishedAt: Date;
}

export interface INewsProvider {
  fetchLatest(limit?: number): Promise<NormalizedNewsArticle[]>;
  fetchByDomain(domain: NewsDomain, limit?: number): Promise<NormalizedNewsArticle[]>;
  search(query: string, limit?: number): Promise<NormalizedNewsArticle[]>;
  normalizeArticle(rawArticle: any): NormalizedNewsArticle;
}

const DEFAULT_TECH_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
];

export class NewsProvider implements INewsProvider {
  private isEnabled: boolean;
  private apiKey: string;
  private baseUrl: string = 'https://newsapi.org/v2';

  constructor() {
    this.isEnabled = ENV.NEWS_API.PROVIDER === 'newsapi' && !!ENV.NEWS_API.API_KEY;
    this.apiKey = ENV.NEWS_API.API_KEY;
  }

  async fetchLatest(limit: number = 15): Promise<NormalizedNewsArticle[]> {
    if (!this.isEnabled) {
      console.warn('NewsProvider: NewsAPI is disabled or missing API key.');
      return [];
    }

    try {
      const pageSize = Math.min(Math.max(limit, 1), 50);
      const url = `${this.baseUrl}/top-headlines?category=technology&language=en&pageSize=${pageSize}`;

      const res = await fetch(url, {
        headers: {
          'X-Api-Key': this.apiKey,
          'User-Agent': 'NEXBYTEES-Intelligence/1.0',
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`NewsAPI request failed with HTTP ${res.status}: ${errText}`);
        return [];
      }

      const data: any = await res.json();
      if (data.status !== 'ok' || !Array.isArray(data.articles)) {
        console.warn('NewsAPI response payload format unexpected:', data.status);
        return [];
      }

      return data.articles
        .filter((raw: any) => this.isValidRawArticle(raw))
        .map((raw: any, idx: number) => this.normalizeArticle(raw, idx));
    } catch (err: any) {
      console.error('Error fetching from NewsAPI:', err.message || err);
      return [];
    }
  }

  async fetchByDomain(domain: NewsDomain, limit: number = 10): Promise<NormalizedNewsArticle[]> {
    if (!this.isEnabled) {
      return [];
    }

    const domainQueryMap: Record<NewsDomain, string> = {
      AI: 'artificial intelligence OR LLM OR OpenAI OR machine learning',
      CYBERSECURITY: 'cybersecurity OR malware OR ransomware OR data breach',
      ROBOTICS: 'robotics OR humanoid robot OR autonomous',
      QUANTUM: 'quantum computing OR qubit OR quantum physics',
      SPACE: 'space technology OR NASA OR satellite OR SpaceX',
      SEMICONDUCTORS: 'semiconductor OR GPU OR microchip OR TSMC OR Nvidia',
      SOFTWARE: 'software development OR open source OR programming OR GitHub',
      CLOUD: 'cloud computing OR AWS OR Azure OR Kubernetes',
      GADGETS: 'smartphones OR consumer electronics OR Apple OR hardware',
      STARTUPS: 'tech startup OR venture capital OR tech IPO',
      OTHER: 'future technology OR tech innovation',
    };

    const q = encodeURIComponent(domainQueryMap[domain] || 'technology');
    return this.search(q, limit);
  }

  async search(query: string, limit: number = 10): Promise<NormalizedNewsArticle[]> {
    if (!this.isEnabled) {
      return [];
    }

    try {
      const pageSize = Math.min(Math.max(limit, 1), 30);
      const url = `${this.baseUrl}/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=${pageSize}`;

      const res = await fetch(url, {
        headers: {
          'X-Api-Key': this.apiKey,
          'User-Agent': 'NEXBYTEES-Intelligence/1.0',
        },
      });

      if (!res.ok) {
        return [];
      }

      const data: any = await res.json();
      if (data.status !== 'ok' || !Array.isArray(data.articles)) {
        return [];
      }

      return data.articles
        .filter((raw: any) => this.isValidRawArticle(raw))
        .map((raw: any, idx: number) => this.normalizeArticle(raw, idx));
    } catch (err: any) {
      console.error('Error searching NewsAPI:', err.message || err);
      return [];
    }
  }

  private isValidRawArticle(raw: any): boolean {
    if (!raw) return false;
    if (!raw.title || raw.title.trim() === '' || raw.title.includes('[Removed]')) return false;
    if (!raw.url || !raw.url.startsWith('http')) return false;
    if (!raw.description && !raw.content) return false;
    return true;
  }

  normalizeArticle(rawArticle: any, fallbackIndex: number = 0): NormalizedNewsArticle {
    // Clean description and content
    const description = (rawArticle.description || rawArticle.summary || '').trim();
    let content = (rawArticle.content || rawArticle.description || '').trim();

    // Strip NewsAPI trailing snippet count like "[+2412 chars]"
    content = content.replace(/\s*\[\+\d+\s+chars\]\s*$/, '');

    // Select valid image or fallback
    let imageUrl = rawArticle.urlToImage || rawArticle.image;
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      imageUrl = DEFAULT_TECH_IMAGES[fallbackIndex % DEFAULT_TECH_IMAGES.length];
    }

    const sourceName = rawArticle.source?.name || rawArticle.sourceName || 'External Tech Wire';
    const sourceUrl = rawArticle.url || rawArticle.sourceUrl || 'https://nexbytees.com';
    const publishedAt = rawArticle.publishedAt ? new Date(rawArticle.publishedAt) : new Date();

    return {
      title: rawArticle.title.trim(),
      description,
      content,
      imageUrl,
      sourceName,
      sourceUrl,
      domain: NewsDomain.AI, // Will be intelligently classified by AIService in NewsSyncService
      tags: ['Technology'],
      publishedAt: isNaN(publishedAt.getTime()) ? new Date() : publishedAt,
    };
  }
}

export const newsProvider = new NewsProvider();
