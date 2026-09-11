import { userRepository } from '../repositories/user.repository';
import { newsRepository } from '../repositories/news.repository';
import { Role, NewsStatus } from '@prisma/client';

export class AdminService {
  async getUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const { users, total } = await userRepository.list(skip, limit);

    return {
      users,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async updateUserRole(userId: string, role: Role) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    const updated = await userRepository.updateRole(userId, role);
    const { passwordHash, ...sanitized } = updated;
    return sanitized;
  }

  async deleteUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    await userRepository.delete(userId);
    return { message: 'User account and associated data removed successfully' };
  }

  async getArticles(page: number = 1, limit: number = 20) {
    return newsRepository.findMany({ page, limit });
  }

  async updateArticleStatus(articleId: string, status: NewsStatus) {
    const article = await newsRepository.findById(articleId);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    return newsRepository.update(articleId, { status });
  }

  async deleteArticle(articleId: string) {
    const article = await newsRepository.findById(articleId);
    if (!article) {
      throw { statusCode: 404, code: 'ARTICLE_NOT_FOUND', message: 'Article not found' };
    }

    await newsRepository.delete(articleId);
    return { message: 'Article removed from platform' };
  }
}

export const adminService = new AdminService();
