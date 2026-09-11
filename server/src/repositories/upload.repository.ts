import { prisma } from '../database/prisma';
import { UserUpload, UploadStatus, Prisma } from '@prisma/client';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class UploadRepository {
  async create(data: Prisma.UserUploadCreateInput): Promise<UserUpload> {
    return prisma.userUpload.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<UserUpload | null> {
    if (!id || !UUID_REGEX.test(id)) {
      return null;
    }
    return prisma.userUpload.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<UserUpload[]> {
    return prisma.userUpload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending(skip: number = 0, take: number = 20) {
    const [uploads, total] = await Promise.all([
      prisma.userUpload.findMany({
        where: { status: UploadStatus.PENDING },
        skip,
        take,
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              profileImage: true,
            },
          },
        },
      }),
      prisma.userUpload.count({ where: { status: UploadStatus.PENDING } }),
    ]);

    return { uploads, total };
  }

  async update(id: string, data: Prisma.UserUploadUpdateInput): Promise<UserUpload> {
    return prisma.userUpload.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: UploadStatus, rejectionReason?: string): Promise<UserUpload> {
    return prisma.userUpload.update({
      where: { id },
      data: {
        status,
        ...(rejectionReason !== undefined ? { rejectionReason } : {}),
      },
    });
  }

  async delete(id: string): Promise<UserUpload> {
    return prisma.userUpload.delete({
      where: { id },
    });
  }
}

export const uploadRepository = new UploadRepository();
