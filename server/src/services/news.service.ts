import { newsRepository } from '../repositories/news.repository';
import { interactionRepository } from '../repositories/interaction.repository';
import { createSlug } from '../utils/slugify';
import { calculateTrendingScore } from '../utils/trending';
import { NewsQueryFilters, AuthUser } from '../types';
import { NewsDomain, NewsStatus, Role } from '@prisma/client';

export class NewsService {
  async getNews(filters: NewsQueryFilters, currentUserId?: string) {
    const { articles, total } = await newsRepository.findMany(filters);

    // Decorate with isLiked and isSaved for authenticated user
    const decorated = await Promise.all(
      articles.map(async (article) => {
        let isSaved = false;
        let isLiked = false;

        if (currentUserId) {
          [isSaved, isLiked] = await Promise.all([
            interactionRepository.isStorySaved(currentUserId, article.id),
            interactionRepository.isStoryLiked(currentUserId, article.id),
          ]);
        }

        return {
          ...article,
          isSaved,
          isLiked,
        };
      })
    );

    const totalPages = Math.ceil(total / (filters.limit || 20));

    return {
      articles: decorated,
      pagination: {
        currentPage: filters.page || 1,
        pageSize: filters.limit || 20,
        totalItems: total,
        totalPages: totalPages || 1,
      },
    };
  }

  async getArticleBySlug(slug: string, currentUserId?: string) {
    const article = await newsRepository.findBySlug(slug);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    // Increment view count asynchronously
    await newsRepository.incrementViews(article.id);
    const updatedViews = article.viewCount + 1;

    // Recalculate trending score with real decay
    const newTrendingScore = calculateTrendingScore({
      views: updatedViews,
      likes: article._count.likes,
      saves: article._count.savedBy,
      shares: article.shareCount,
      comments: article._count.comments,
      publishedAt: article.publishedAt,
    });

    await newsRepository.updateTrendingScore(article.id, newTrendingScore);

    let isSaved = false;
    let isLiked = false;

    if (currentUserId) {
      [isSaved, isLiked] = await Promise.all([
        interactionRepository.isStorySaved(currentUserId, article.id),
        interactionRepository.isStoryLiked(currentUserId, article.id),
      ]);
    }

    return {
      ...article,
      viewCount: updatedViews,
      trendingScore: newTrendingScore,
      isSaved,
      isLiked,
    };
  }

  async createArticle(data: {
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    sourceName: string;
    sourceUrl: string;
    domain: NewsDomain;
    tags: string[];
    status?: NewsStatus;
    authorId?: string;
  }) {
    const slug = createSlug(data.title);

    const article = await newsRepository.create({
      title: data.title,
      slug,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      sourceName: data.sourceName,
      sourceUrl: data.sourceUrl,
      domain: data.domain,
      tags: data.tags,
      status: data.status || NewsStatus.PUBLISHED,
      author: data.authorId ? { connect: { id: data.authorId } } : undefined,
      trendingScore: 10.0, // Initial fresh score
    });

    return article;
  }

  async updateArticle(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      content: string;
      imageUrl: string;
      sourceName: string;
      sourceUrl: string;
      domain: NewsDomain;
      tags: string[];
      status: NewsStatus;
    }>,
    user: AuthUser
  ) {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    // Authorization: author, EDITOR or ADMIN
    if (article.authorId !== user.id && user.role !== Role.ADMIN && user.role !== Role.EDITOR) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'You are not authorized to update this article' };
    }

    return newsRepository.update(id, data);
  }

  async deleteArticle(id: string, user: AuthUser) {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    if (article.authorId !== user.id && user.role !== Role.ADMIN) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'Only an admin or the author can delete this article' };
    }

    return newsRepository.delete(id);
  }

  async shareArticle(id: string) {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    const updated = await newsRepository.incrementShares(id);

    // Recalculate trending score
    const newScore = calculateTrendingScore({
      views: updated.viewCount,
      likes: article._count.likes,
      saves: article._count.savedBy,
      shares: updated.shareCount,
      comments: article._count.comments,
      publishedAt: updated.publishedAt,
    });

    await newsRepository.updateTrendingScore(id, newScore);

    return { shareCount: updated.shareCount, trendingScore: newScore };
  }
}

export const newsService = new NewsService();
