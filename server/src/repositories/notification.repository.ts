import { prisma } from '../database/prisma';
import { NotificationType, Notification } from '@prisma/client';

export class NotificationRepository {
  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedArticleId?: string;
    relatedUserId?: string;
  }): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  async findByUserId(userId: string, skip: number = 0, take: number = 30) {
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return { notifications, unreadCount };
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

export const notificationRepository = new NotificationRepository();
