import { Response, NextFunction } from 'express';
import { notificationRepository } from '../repositories/notification.repository';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class NotificationController {
  async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 30;
      const skip = (page - 1) * limit;

      const { notifications, unreadCount } = await notificationRepository.findByUserId(req.user!.id, skip, limit);
      sendSuccess(res, { notifications, unreadCount }, undefined, 200);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await notificationRepository.markAsRead(id, req.user!.id);
      sendSuccess(res, { read: true }, 'Notification marked as read', 200);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationRepository.markAllAsRead(req.user!.id);
      sendSuccess(res, { allRead: true }, 'All notifications marked as read', 200);
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
