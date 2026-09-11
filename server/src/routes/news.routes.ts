import { Router } from 'express';
import { newsController } from '../controllers/news.controller';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { authenticate, optionalAuthenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import {
  createNewsSchema,
  updateNewsSchema,
  newsQuerySchema,
  createCommentSchema,
} from '../validators';

const router = Router();

// Public & optional auth news endpoints
router.get('/', optionalAuthenticate, validateQuery(newsQuerySchema), newsController.getNews);
router.get('/:slug', optionalAuthenticate, newsController.getArticleBySlug);
router.post('/:id/share', newsController.shareArticle);

// Editorial & admin article CRUD
router.post(
  '/',
  authenticate,
  authorize(Role.EDITOR, Role.ADMIN),
  validateBody(createNewsSchema),
  newsController.createArticle
);
router.patch(
  '/:id',
  authenticate,
  authorize(Role.EDITOR, Role.ADMIN),
  validateBody(updateNewsSchema),
  newsController.updateArticle
);
router.delete('/:id', authenticate, authorize(Role.ADMIN), newsController.deleteArticle);

// Interactions (Likes & Saves)
router.post('/:id/save', authenticate, newsController.toggleSave);
router.delete('/:id/save', authenticate, newsController.toggleSave);
router.post('/:id/like', authenticate, newsController.toggleLike);
router.delete('/:id/like', authenticate, newsController.toggleLike);

// Commentary
router.get('/:id/comments', newsController.getComments);
router.post('/:id/comments', authenticate, validateBody(createCommentSchema), newsController.addComment);
router.delete('/comments/:id', authenticate, newsController.deleteComment);

export default router;
