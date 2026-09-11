import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { uploadService } from '../services/upload.service';
import { newsSyncService } from '../services/news-sync.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AdminController {
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await adminService.getUsers(page, limit);
      sendSuccess(res, result.users, undefined, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await adminService.updateUserRole(id, req.body.role);
      sendSuccess(res, updated, 'User role updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await adminService.deleteUser(id);
      sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }

  async getArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await adminService.getArticles(page, limit);
      sendSuccess(res, result.articles, undefined, 200, {
        currentPage: page,
        pageSize: limit,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / limit) || 1,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateArticleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await adminService.updateArticleStatus(id, req.body.status);
      sendSuccess(res, updated, 'Article status updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await adminService.deleteArticle(id);
      sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }

  async getPendingUploads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await uploadService.getPendingUploads(page, limit);
      sendSuccess(res, result.uploads, undefined, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async approveUpload(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await uploadService.approveUpload(id);
      sendSuccess(res, result, 'Upload approved and published to news feed', 200);
    } catch (error) {
      next(error);
    }
  }

  async rejectUpload(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const { rejectionReason } = req.body;
      const result = await uploadService.rejectUpload(id, rejectionReason);
      sendSuccess(res, result, 'Upload rejected with feedback provided to author', 200);
    } catch (error) {
      next(error);
    }
  }

  async syncNews(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 15;
      const result = await newsSyncService.syncNews(limit);
      sendSuccess(res, result, 'News synchronization process completed', 200);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
