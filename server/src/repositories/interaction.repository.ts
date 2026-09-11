import { prisma } from '../database/prisma';

export class InteractionRepository {
  // ================= SAVED STORIES =================
  async saveStory(userId: string, newsArticleId: string) {
    return prisma.savedStory.create({
      data: { userId, newsArticleId },
      include: { newsArticle: true },
    });
  }

  async unsaveStory(userId: string, newsArticleId: string) {
    return prisma.savedStory.delete({
      where: {
        userId_newsArticleId: { userId, newsArticleId },
      },
    });
  }

  async isStorySaved(userId: string, newsArticleId: string): Promise<boolean> {
    const record = await prisma.savedStory.findUnique({
      where: { userId_newsArticleId: { userId, newsArticleId } },
    });
    return !!record;
  }

  async getSavedStories(userId: string, skip: number = 0, take: number = 20) {
    const [saved, total] = await Promise.all([
      prisma.savedStory.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          newsArticle: {
            include: {
              author: {
                select: { id: true, name: true, username: true, profileImage: true },
              },
            },
          },
        },
      }),
      prisma.savedStory.count({ where: { userId } }),
    ]);

    return { saved, total };
  }

  // ================= LIKES =================
  async likeStory(userId: string, newsArticleId: string) {
    return prisma.like.create({
      data: { userId, newsArticleId },
    });
  }

  async unlikeStory(userId: string, newsArticleId: string) {
    return prisma.like.delete({
      where: {
        userId_newsArticleId: { userId, newsArticleId },
      },
    });
  }

  async isStoryLiked(userId: string, newsArticleId: string): Promise<boolean> {
    const record = await prisma.like.findUnique({
      where: { userId_newsArticleId: { userId, newsArticleId } },
    });
    return !!record;
  }

  // ================= COMMENTS =================
  async createComment(userId: string, newsArticleId: string, content: string, parentCommentId?: string | null) {
    return prisma.comment.create({
      data: {
        userId,
        newsArticleId,
        content,
        parentCommentId: parentCommentId || null,
      },
      include: {
        user: {
          select: { id: true, name: true, username: true, profileImage: true, role: true },
        },
      },
    });
  }

  async getCommentsByArticle(newsArticleId: string) {
    return prisma.comment.findMany({
      where: {
        newsArticleId,
        parentCommentId: null, // Top-level comments
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, username: true, profileImage: true, role: true },
        },
        replies: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, username: true, profileImage: true, role: true },
            },
          },
        },
      },
    });
  }

  async findCommentById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async updateComment(id: string, content: string) {
    return prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  async deleteComment(id: string) {
    return prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ================= FOLLOWS =================
  async followUser(followerId: string, followingId: string) {
    return prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    return prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const record = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return !!record;
  }

  async getFollowers(userId: string) {
    return prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, name: true, username: true, profileImage: true, bio: true },
        },
      },
    });
  }

  async getFollowing(userId: string) {
    return prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, name: true, username: true, profileImage: true, bio: true },
        },
      },
    });
  }
}

export const interactionRepository = new InteractionRepository();
