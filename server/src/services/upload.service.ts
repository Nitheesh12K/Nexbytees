import { uploadRepository } from '../repositories/upload.repository';
import { newsService } from './news.service';
import { notificationRepository } from '../repositories/notification.repository';
import { UploadStatus, NewsDomain, NotificationType, Role } from '@prisma/client';
import { AuthUser } from '../types';

export class UploadService {
  async submitUpload(userId: string, data: {
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    sourceName: string;
    sourceUrl: string;
    domain: NewsDomain;
    tags: string[];
  }) {
    const upload = await uploadRepository.create({
      title: data.title,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      sourceName: data.sourceName,
      sourceUrl: data.sourceUrl,
      domain: data.domain,
      tags: data.tags,
      user: { connect: { id: userId } },
    });

    return upload;
  }

  async getMyUploads(userId: string) {
    return uploadRepository.findByUserId(userId);
  }

  async getPendingUploads(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const { uploads, total } = await uploadRepository.findPending(skip, limit);

    return {
      uploads,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async approveUpload(uploadId: string) {
    const upload = await uploadRepository.findById(uploadId);
    if (!upload) {
      throw { statusCode: 404, code: 'UPLOAD_NOT_FOUND', message: 'Upload not found' };
    }

    if (upload.status !== UploadStatus.PENDING) {
      throw { statusCode: 400, code: 'ALREADY_REVIEWED', message: `Upload has already been ${upload.status.toLowerCase()}` };
    }

    // 1. Mark as APPROVED
    const updatedUpload = await uploadRepository.updateStatus(uploadId, UploadStatus.APPROVED);

    // 2. Publish as official NewsArticle
    const article = await newsService.createArticle({
      title: upload.title,
      description: upload.description,
      content: upload.content,
      imageUrl: upload.imageUrl,
      sourceName: upload.sourceName,
      sourceUrl: upload.sourceUrl,
      domain: upload.domain,
      tags: upload.tags,
      authorId: upload.userId,
    });

    // 3. Notify the submitting user
    await notificationRepository.create({
      userId: upload.userId,
      type: NotificationType.UPLOAD,
      title: 'Submission Approved! 🎉',
      message: `Your story "${upload.title}" has been reviewed and published to the NEXBYTEES community wire!`,
      relatedArticleId: article.id,
    });

    return { upload: updatedUpload, article };
  }

  async rejectUpload(uploadId: string, rejectionReason: string) {
    const upload = await uploadRepository.findById(uploadId);
    if (!upload) {
      throw { statusCode: 404, code: 'UPLOAD_NOT_FOUND', message: 'Upload not found' };
    }

    if (upload.status !== UploadStatus.PENDING) {
      throw { statusCode: 400, code: 'ALREADY_REVIEWED', message: `Upload has already been ${upload.status.toLowerCase()}` };
    }

    const updatedUpload = await uploadRepository.updateStatus(uploadId, UploadStatus.REJECTED, rejectionReason);

    // Notify submitting user with feedback
    await notificationRepository.create({
      userId: upload.userId,
      type: NotificationType.UPLOAD,
      title: 'Submission Update',
      message: `Your story "${upload.title}" was not approved for publication. Reason: ${rejectionReason}`,
    });

    return updatedUpload;
  }

  async updateUpload(uploadId: string, userId: string, data: any) {
    const upload = await uploadRepository.findById(uploadId);
    if (!upload) {
      throw { statusCode: 404, code: 'UPLOAD_NOT_FOUND', message: 'Upload not found' };
    }

    if (upload.userId !== userId) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'You can only edit your own submissions' };
    }

    if (upload.status === UploadStatus.APPROVED) {
      throw { statusCode: 400, code: 'CANNOT_EDIT_APPROVED', message: 'Approved articles must be edited through the article editor' };
    }

    return uploadRepository.update(uploadId, data);
  }

  async deleteUpload(uploadId: string, user: AuthUser) {
    const upload = await uploadRepository.findById(uploadId);
    if (!upload) {
      throw { statusCode: 404, code: 'UPLOAD_NOT_FOUND', message: 'Upload not found' };
    }

    if (upload.userId !== user.id && user.role !== Role.ADMIN) {
      throw { statusCode: 403, code: 'FORBIDDEN', message: 'You do not have permission to delete this submission' };
    }

    return uploadRepository.delete(uploadId);
  }
}

export const uploadService = new UploadService();
