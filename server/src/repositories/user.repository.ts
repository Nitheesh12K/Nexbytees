import { prisma } from '../database/prisma';
import { Role, User, Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        preferences: true,
        _count: {
          select: {
            articles: true,
            uploads: true,
            followers: true,
            following: true,
            savedStories: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        username: true,
        profileImage: true,
        bio: true,
        techInterests: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            uploads: true,
            followers: true,
            following: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async updateRole(id: string, role: Role): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async list(skip: number, take: number) {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          profileImage: true,
          createdAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }
}

export const userRepository = new UserRepository();
