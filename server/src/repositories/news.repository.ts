import { prisma } from '../database/prisma';
import { NewsArticle, NewsDomain, NewsStatus, Prisma } from '@prisma/client';
import { NewsQueryFilters } from '../types';

export class NewsRepository {
  async create(data: Prisma.NewsArticleCreateInput): Promise<NewsArticle> {
    return prisma.newsArticle.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.newsArticle.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            savedBy: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.newsArticle.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            savedBy: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.NewsArticleUpdateInput): Promise<NewsArticle> {
    return prisma.newsArticle.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<NewsArticle> {
    return prisma.newsArticle.delete({
      where: { id },
    });
  }

  async findMany(filters: NewsQueryFilters) {
    const { domain, tag, search, sort = 'latest', status = NewsStatus.PUBLISHED, page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.NewsArticleWhereInput = {
      status,
      ...(domain ? { domain } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
              { sourceName: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    let orderBy: Prisma.NewsArticleOrderByWithRelationInput = { publishedAt: 'desc' };
    if (sort === 'trending') {
      orderBy = { trendingScore: 'desc' };
    } else if (sort === 'views') {
      orderBy = { viewCount: 'desc' };
    }

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
              savedBy: true,
            },
          },
        },
      }),
      prisma.newsArticle.count({ where }),
    ]);

    return { articles, total };
  }

  async incrementViews(id: string): Promise<NewsArticle> {
    return prisma.newsArticle.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });
  }

  async incrementShares(id: string): Promise<NewsArticle> {
    return prisma.newsArticle.update({
      where: { id },
      data: {
        shareCount: { increment: 1 },
      },
    });
  }

  async updateTrendingScore(id: string, trendingScore: number): Promise<NewsArticle> {
    return prisma.newsArticle.update({
      where: { id },
      data: { trendingScore },
    });
  }

  async updateCounts(id: string, saveCountChange: number = 0) {
    return prisma.newsArticle.update({
      where: { id },
      data: {
        saveCount: { increment: saveCountChange },
      },
    });
  }
}

export const newsRepository = new NewsRepository();
