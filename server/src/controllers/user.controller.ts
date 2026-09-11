import { Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { ENV } from '../config/env';

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user?.id;
      const username = String(req.params.username);
      const profile = await userService.getProfile(username, currentUserId);
      sendSuccess(res, profile, undefined, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await userService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, updated, 'Profile updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async uploadProfileImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        sendError(res, 'FILE_MISSING', 'Please upload an image file', 400);
        return;
      }

      // Generate accessible image URL
      const imageUrl = `${ENV.APP_URL}/uploads/${req.file.filename}`;
      const updated = await userService.updateProfile(req.user!.id, { profileImage: imageUrl });

      sendSuccess(res, { profileImage: imageUrl, user: updated }, 'Profile image uploaded successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async getMySaved(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const result = await userService.getSavedStories(req.user!.id, page, limit);
      sendSuccess(res, result.stories, undefined, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getMyUploads(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const uploads = await userService.getUserUploads(req.user!.id);
      sendSuccess(res, uploads, undefined, 200);
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const followers = await userService.getFollowers(req.user!.id);
      sendSuccess(res, followers, undefined, 200);
    } catch (error) {
      next(error);
    }
  }

  async getFollowing(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const following = await userService.getFollowing(req.user!.id);
      sendSuccess(res, following, undefined, 200);
    } catch (error) {
      next(error);
    }
  }

  async toggleFollow(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await userService.toggleFollow(req.user!.id, id);
      sendSuccess(res, result, result.message, 200);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
