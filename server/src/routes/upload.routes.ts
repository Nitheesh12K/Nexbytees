import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { validateBody } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createUploadSchema, updateUploadSchema } from '../validators';

const router = Router();

router.post('/', authenticate, validateBody(createUploadSchema), uploadController.submitUpload);
router.get('/me', authenticate, uploadController.getMyUploads);
router.patch('/:id', authenticate, validateBody(updateUploadSchema), uploadController.updateUpload);
router.delete('/:id', authenticate, uploadController.deleteUpload);

export default router;
