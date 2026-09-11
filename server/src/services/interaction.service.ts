import { interactionRepository } from '../repositories/interaction.repository';
import { newsRepository } from '../repositories/news.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { calculateTrendingScore } from '../utils/trending';
import { NotificationType, Role } from '@prisma/client';

export class InteractionService {
  async toggleSave(userId: string, articleId: string) {
    const article = await newsRepository.findById(articleId);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    const isSaved = await interactionRepository.isStorySaved(userId, articleId);

    if (isSaved) {
      await interactionRepository.unsaveStory(userId, articleId);
      await newsRepository.updateCounts(articleId, -1);
    } else {
      await interactionRepository.saveStory(userId, articleId);
      await newsRepository.updateCounts(articleId, 1);
    }

    // Refresh metrics & decay calculation
    const updated = await newsRepository.findById(articleId);
    if (updated) {
      const newScore = calculateTrendingScore({
        views: updated.viewCount,
        likes: updated._count.likes,
        saves: updated._count.savedBy,
        shares: updated.shareCount,
        comments: updated._count.comments,
        publishedAt: updated.publishedAt,
      });
      await newsRepository.updateTrendingScore(articleId, newScore);
    }

    return {
      saved: !isSaved,
      message: !isSaved ? 'Article saved to your archive' : 'Article removed from your archive',
    };
  }

  async toggleLike(userId: string, articleId: string) {
    const article = await newsRepository.findById(articleId);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    const isLiked = await interactionRepository.isStoryLiked(userId, articleId);

    if (isLiked) {
      await interactionRepository.unlikeStory(userId, articleId);
    } else {
      await interactionRepository.likeStory(userId, articleId);

      // Notify article author if different user
      if (article.authorId && article.authorId !== userId) {
        await notificationRepository.create({
          userId: article.authorId,
          type: NotificationType.LIKE,
          title: 'New Like',
          message: `Someone liked your article "${article.title}"`,
          relatedArticleId: article.id,
          relatedUserId: userId,
        });
      }
    }

    // Refresh metrics & decay calculation
    const updated = await newsRepository.findById(articleId);
    if (updated) {
      const newScore = calculateTrendingScore({
        views: updated.viewCount,
        likes: updated._count.likes,
        saves: updated._count.savedBy,
        shares: updated.shareCount,
        comments: updated._count.comments,
        publishedAt: updated.publishedAt,
      });
      await newsRepository.updateTrendingScore(articleId, newScore);
    }

    return {
      liked: !isLiked,
      totalLikes: updated?._count.likes || 0,
      message: !isLiked ? 'Article liked' : 'Article unliked',
    };
  }

  async addComment(userId: string, articleId: string, content: string, parentCommentId?: string | null) {
    const article = await newsRepository.findById(articleId);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    const comment = await interactionRepository.createComment(userId, articleId, content, parentCommentId);

    // Notify article author
    if (article.authorId && article.authorId !== userId) {
      await notificationRepository.create({
        userId: article.authorId,
        type: NotificationType.COMMENT,
        title: 'New Comment',
        message: `New commentary posted on "${article.title}"`,
        relatedArticleId: article.id,
        relatedUserId: userId,
      });
    }

    // Recalculate trending score
    const updated = await newsRepository.findById(articleId);
    if (updated) {
      const newScore = calculateTrendingScore({
        views: updated.viewCount,
        likes: updated._count.likes,
        saves: updated._count.savedBy,
        shares: updated.shareCount,
        comments: updated._count.comments,
        publishedAt: updated.publishedAt,
      });
      await newsRepository.updateTrendingScore(articleId, newScore);
    }

    return comment;
  }

  async getComments(articleId: string) {
    return interactionRepository.getCommentsByArticle(articleId);
  }

  async deleteComment(commentId: string, userId: string, role: Role) {
    const comment = await interactionRepository.findCommentById(commentId);
    if (!comment) {
      throw { statusCode: 404, code: 'COMMENT_NOT_FOUND', message: 'Comment not found' };
    }

    if (comment.userId !== userId && role !== Role.ADMIN) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'You do not have permission to delete this comment' };
    }

    await interactionRepository.deleteComment(commentId);
    return { message: 'Comment deleted successfully' };
  }
}

export const interactionService = new InteractionService();
