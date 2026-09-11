import dotenv from 'dotenv';
import path from 'path';

// Load .env from current directory or server directory
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  APP_URL: process.env.APP_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/nexbytees?schema=public',
  DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL || '',

  SUPABASE: {
    URL: process.env.SUPABASE_URL || '',
    ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'nexbytees_super_secret_access_jwt_key_2026_production',
    ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'nexbytees_super_secret_refresh_jwt_key_2026_production',
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  SECURITY: {
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '200', 10),
    AUTH_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || (process.env.NODE_ENV === 'development' ? '500' : '10'), 10),
  },

  UPLOAD: {
    PROVIDER: process.env.UPLOAD_STORAGE_PROVIDER || 'local',
    MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
    UPLOAD_DIR: path.resolve(process.cwd(), 'uploads'),
    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
      API_KEY: process.env.CLOUDINARY_API_KEY || '',
      API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    },
    S3: {
      BUCKET: process.env.AWS_S3_BUCKET || '',
      ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
      SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
      REGION: process.env.AWS_REGION || 'us-east-1',
    },
  },

  AI: {
    PROVIDER: process.env.AI_PROVIDER || 'disabled',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  },

  NEWS_API: {
    PROVIDER: process.env.NEWS_PROVIDER || 'disabled',
    API_KEY: process.env.NEWS_API_KEY || '',
  },
};
