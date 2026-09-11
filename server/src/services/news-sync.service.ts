import { prisma } from '../database/prisma';
import { newsProvider, NormalizedNewsArticle } from './providers/news.provider';
import { aiService } from './ai/ai.service';
import { createSlug } from '../utils/slugify';
import { NewsStatus, Role } from '@prisma/client';

export interface SyncResult {
  status: 'success' | 'partial' | 'error';
  provider: string;
  fetched: number;
  inserted: number;
  duplicatesSkipped: number;
  invalidSkipped: number;
  timestamp: string;
  articles?: Array<{
    id: string;
    title: string;
    domain: string;
    source: string;
  }>;
}

export class NewsSyncService {
  async syncNews(limit: number = 15): Promise<SyncResult> {
    const timestamp = new Date().toISOString();

    try {
      // 1. Fetch from NewsAPI
      const rawArticles: NormalizedNewsArticle[] = await newsProvider.fetchLatest(limit);
      const totalFetched = rawArticles.length;

      if (totalFetched === 0) {
        return {
          status: 'success',
          provider: 'NewsAPI',
          fetched: 0,
          inserted: 0,
          duplicatesSkipped: 0,
          invalidSkipped: 0,
          timestamp,
        };
      }

      // 2. Load existing articles from Supabase for fast duplicate detection
      const existingArticles = await prisma.newsArticle.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          sourceUrl: true,
        },
        take: 300,
        orderBy: { createdAt: 'desc' },
      });

      const existingUrls = new Set(existingArticles.map((a) => a.sourceUrl.toLowerCase()));
      const existingTitles = existingArticles.map((a) => a.title);

      // 3. Find or assign default editorial curator author
      let defaultAuthor = await prisma.user.findFirst({
        where: { role: { in: [Role.ADMIN, Role.EDITOR] } },
      });

      if (!defaultAuthor) {
        defaultAuthor = await prisma.user.findFirst();
      }

      let insertedCount = 0;
      let duplicatesCount = 0;
      let invalidCount = 0;
      const insertedSummaries: Array<{ id: string; title: string; domain: string; source: string }> = [];

      // 4. Process each article
      for (const article of rawArticles) {
        // Validate
        if (!article.title || article.title.length < 5 || article.title.includes('[Removed]')) {
          invalidCount++;
          continue;
        }

        const lowerUrl = article.sourceUrl.toLowerCase();
        if (existingUrls.has(lowerUrl)) {
          duplicatesCount++;
          continue;
        }

        // Fuzzy duplicate check
        const { isDuplicate } = await aiService.detectDuplicate(article.title, existingTitles);
        if (isDuplicate) {
          duplicatesCount++;
          continue;
        }

        // Classify into NEXBYTEES domain
        const domain = await aiService.classifyArticle(
          article.title,
          `${article.description} ${article.content}`
        );

        // Generate tags
        const tags = await aiService.generateTags(article.title, article.content || article.description);

        // Generate collision-safe slug
        let baseSlug = createSlug(article.title);
        let slug = baseSlug;
        let slugCollision = await prisma.newsArticle.findUnique({ where: { slug } });
        if (slugCollision) {
          slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        // Random realistic trending score between 75 and 95
        const initialTrendingScore = Math.floor(75 + Math.random() * 20);

        // Save into Supabase
        const created = await prisma.newsArticle.create({
          data: {
            title: article.title,
            slug,
            description: article.description || article.title,
            content: article.content || article.description || article.title,
            imageUrl: article.imageUrl,
            sourceName: article.sourceName,
            sourceUrl: article.sourceUrl,
            domain,
            tags,
            status: NewsStatus.PUBLISHED,
            publishedAt: article.publishedAt,
            authorId: defaultAuthor ? defaultAuthor.id : null,
            trendingScore: initialTrendingScore,
            viewCount: Math.floor(25 + Math.random() * 50),
          },
        });

        existingUrls.add(lowerUrl);
        existingTitles.push(article.title);
        insertedCount++;
        insertedSummaries.push({
          id: created.id,
          title: created.title,
          domain: created.domain,
          source: created.sourceName,
        });
      }

      return {
        status: 'success',
        provider: 'NewsAPI',
        fetched: totalFetched,
        inserted: insertedCount,
        duplicatesSkipped: duplicatesCount,
        invalidSkipped: invalidCount,
        timestamp,
        articles: insertedSummaries,
      };
    } catch (err: any) {
      console.error('NewsSyncService error during execution:', err.message || err);
      return {
        status: 'error',
        provider: 'NewsAPI',
        fetched: 0,
        inserted: 0,
        duplicatesSkipped: 0,
        invalidSkipped: 0,
        timestamp,
      };
    }
  }
}

export const newsSyncService = new NewsSyncService();
