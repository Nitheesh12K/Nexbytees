import { userRepository } from '../repositories/user.repository';
import { interactionRepository } from '../repositories/interaction.repository';
import { uploadRepository } from '../repositories/upload.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { NotificationType } from '@prisma/client';

export class UserService {
  async getProfile(username: string, currentUserId?: string) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      isFollowing = await interactionRepository.isFollowing(currentUserId, user.id);
    }

    return {
      ...user,
      isFollowing,
    };
  }

  async updateProfile(userId: string, data: { name?: string; bio?: string; techInterests?: string[]; profileImage?: string }) {
    const user = await userRepository.update(userId, data);
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  async getSavedStories(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const { saved, total } = await interactionRepository.getSavedStories(userId, skip, limit);

    return {
      stories: saved.map((s) => ({
        ...s.newsArticle,
        savedAt: s.createdAt,
      })),
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getUserUploads(userId: string) {
    return uploadRepository.findByUserId(userId);
  }

  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw { statusCode: 400, code: 'CANNOT_FOLLOW_SELF', message: 'You cannot follow yourself' };
    }

    const targetUser = await userRepository.findById(followingId);
    if (!targetUser) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'User to follow does not exist' };
    }

    const alreadyFollowing = await interactionRepository.isFollowing(followerId, followingId);

    if (alreadyFollowing) {
      await interactionRepository.unfollowUser(followerId, followingId);
      return { following: false, message: `Unfollowed @${targetUser.username}` };
    } else {
      await interactionRepository.followUser(followerId, followingId);

      // Create notification
      const follower = await userRepository.findById(followerId);
      await notificationRepository.create({
        userId: followingId,
        type: NotificationType.FOLLOW,
        title: 'New Follower',
        message: `@${follower?.username || 'Someone'} started following your technology intelligence briefings.`,
        relatedUserId: followerId,
      });

      return { following: true, message: `Now following @${targetUser.username}` };
    }
  }

  async getFollowers(userId: string) {
    const records = await interactionRepository.getFollowers(userId);
    return records.map((r) => r.follower);
  }

  async getFollowing(userId: string) {
    const records = await interactionRepository.getFollowing(userId);
    return records.map((r) => r.following);
  }
}

export const userService = new UserService();
