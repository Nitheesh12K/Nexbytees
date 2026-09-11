import { Router } from 'express';
import authRoutes from './auth.routes';
import newsRoutes from './news.routes';
import userRoutes from './user.routes';
import uploadRoutes from './upload.routes';
import adminRoutes from './admin.routes';
import notificationRoutes from './notification.routes';
import { checkDatabaseConnection } from '../database/prisma';
import { sendSuccess } from '../utils/response';

const router = Router();

// Health Check
router.get('/health', async (req, res) => {
  const dbConnected = await checkDatabaseConnection();
  sendSuccess(res, {
    status: 'online',
    platform: 'NEXBYTEES Intelligence Backend',
    version: '1.0.0',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Mounted Sub-Routers
router.use('/auth', authRoutes);
router.use('/news', newsRoutes);
router.use('/users', userRoutes);
router.use('/uploads', uploadRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

export default router;
