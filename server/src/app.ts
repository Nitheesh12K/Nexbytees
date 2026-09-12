import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env';
import apiRouter from './routes';
import { standardRateLimiter } from './middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

export function createApp(): Express {
  const app = express();

  // Trust proxy for rate limiting behind reverse proxy / load balancers
  app.set('trust proxy', 1);

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS Configuration
  const allowedOrigins = ENV.SECURITY.CORS_ORIGIN.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          allowedOrigins.includes('*') ||
          origin.endsWith('.vercel.app') ||
          origin.includes('localhost') ||
          ENV.NODE_ENV === 'development'
        ) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static files for uploaded images
  app.use('/uploads', express.static(ENV.UPLOAD.UPLOAD_DIR));

  // Global Rate Limiting
  app.use(ENV.API_PREFIX, standardRateLimiter);

  // Mount API v1 Routes
  app.use(ENV.API_PREFIX, apiRouter);

  // Root redirect/status
  app.get('/', (req, res) => {
    res.json({
      name: 'NEXBYTEES Intelligence Backend',
      version: '1.0.0',
      status: 'operational',
      docs: `${ENV.API_PREFIX}/health`,
    });
  });

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
