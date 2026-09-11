import { Response, NextFunction } from 'express';
import { newsService } from '../services/news.service';
import { interactionService } from '../services/interaction.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class NewsController {
  async getNews(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const result = await newsService.getNews(req.query as any, currentUserId);
      sendSuccess(res, result.articles, undefined, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getArticleBySlug(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const slug = String(req.params.slug);
      const article = await newsService.getArticleBySlug(slug, currentUserId);
      sendSuccess(res, article, undefined, 200);
    } catch (error) {
      next(error);
    }
  }

  async createArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const article = await newsService.createArticle({
        ...req.body,
        authorId: req.user?.id,
      });
      sendSuccess(res, article, 'Article created and published successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const article = await newsService.updateArticle(id, req.body, req.user!);
      sendSuccess(res, article, 'Article updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await newsService.deleteArticle(id, req.user!);
      sendSuccess(res, { deleted: true }, 'Article deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async shareArticle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await newsService.shareArticle(id);
      sendSuccess(res, result, 'Article shared', 200);
    } catch (error) {
      next(error);
    }
  }

  async toggleSave(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await interactionService.toggleSave(req.user!.id, id);
      sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await interactionService.toggleLike(req.user!.id, id);
      sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const comments = await interactionService.getComments(id);
      sendSuccess(res, comments, undefined, 200);
    } catch (error) {
      next(error);
    }
  }

  async addComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const { content, parentCommentId } = req.body;
      const comment = await interactionService.addComment(req.user!.id, id, content, parentCommentId);
      sendSuccess(res, comment, 'Comment added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await interactionService.deleteComment(id, req.user!.id, req.user!.role);
      sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const newsController = new NewsController();
