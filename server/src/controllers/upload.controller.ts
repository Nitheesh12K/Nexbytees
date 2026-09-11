import { Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class UploadController {
  async submitUpload(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const upload = await uploadService.submitUpload(req.user!.id, req.body);
      sendSuccess(res, upload, 'Story submitted for editorial review', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMyUploads(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const uploads = await uploadService.getMyUploads(req.user!.id);
      sendSuccess(res, uploads, undefined, 200);
    } catch (error) {
      next(error);
    }
  }

  async updateUpload(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const upload = await uploadService.updateUpload(id, req.user!.id, req.body);
      sendSuccess(res, upload, 'Submission updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteUpload(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await uploadService.deleteUpload(id, req.user!);
      sendSuccess(res, { deleted: true }, 'Submission deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
