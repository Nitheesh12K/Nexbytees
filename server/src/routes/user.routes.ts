import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validateBody } from '../middleware/validate.middleware';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { uploadSingleImage } from '../middleware/upload.middleware';
import { updateProfileSchema } from '../validators';

const router = Router();

// Current user protected endpoints
router.get('/me/saved', authenticate, userController.getMySaved);
router.get('/me/uploads', authenticate, userController.getMyUploads);
router.get('/me/followers', authenticate, userController.getFollowers);
router.get('/me/following', authenticate, userController.getFollowing);
router.patch('/me', authenticate, validateBody(updateProfileSchema), userController.updateProfile);
router.post('/me/profile-image', authenticate, uploadSingleImage, userController.uploadProfileImage);

// Social profile & follow actions
router.get('/:username', optionalAuthenticate, userController.getProfile);
router.post('/:id/follow', authenticate, userController.toggleFollow);
router.delete('/:id/follow', authenticate, userController.toggleFollow);

export default router;
