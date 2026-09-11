import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { validateBody } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { updateRoleSchema, rejectUploadSchema } from '../validators';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// User Management (Admin only)
router.get('/users', authorize(Role.ADMIN), adminController.getUsers);
router.patch('/users/:id/role', authorize(Role.ADMIN), validateBody(updateRoleSchema), adminController.updateUserRole);
router.delete('/users/:id', authorize(Role.ADMIN), adminController.deleteUser);

// Article Moderation & Sync (Admin & Editor)
router.get('/news', authorize(Role.ADMIN, Role.EDITOR), adminController.getArticles);
router.post('/news/sync', authorize(Role.ADMIN, Role.EDITOR), adminController.syncNews);
router.patch('/news/:id/status', authorize(Role.ADMIN, Role.EDITOR), adminController.updateArticleStatus);
router.delete('/news/:id', authorize(Role.ADMIN), adminController.deleteArticle);

// Upload Submissions Review (Admin & Editor)
router.get('/uploads/pending', authorize(Role.ADMIN, Role.EDITOR), adminController.getPendingUploads);
router.patch('/uploads/:id/approve', authorize(Role.ADMIN, Role.EDITOR), adminController.approveUpload);
router.patch('/uploads/:id/reject', authorize(Role.ADMIN, Role.EDITOR), validateBody(rejectUploadSchema), adminController.rejectUpload);

export default router;
