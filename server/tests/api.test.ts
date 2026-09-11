import request from 'supertest';
import { createApp } from '../src/app';
import { signAccessToken } from '../src/utils/jwt';
import { Role } from '@prisma/client';
import { AuthUser } from '../src/types';

describe('API Integration Tests', () => {
  const app = createApp();

  describe('Health & Status Endpoints', () => {
    it('GET / should return 200 operational status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('NEXBYTEES Intelligence Backend');
      expect(res.body.status).toBe('operational');
    });

    it('GET /api/v1/health should return health check response', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.platform).toBe('NEXBYTEES Intelligence Backend');
      expect(res.body.data.version).toBe('1.0.0');
    });
  });

  describe('Authentication & Validation', () => {
    it('POST /api/v1/auth/register should return 422 for invalid payloads', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'A',
        email: 'invalid-email',
        password: '123',
      });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(res.body.error.details)).toBe(true);
    });

    it('POST /api/v1/auth/login should return 422 when fields are missing', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'not-an-email',
      });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Authentication & Authorization Middleware', () => {
    it('GET /api/v1/auth/me should reject requests without a Bearer token with 401', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('GET /api/v1/auth/me should reject requests with a malformed token with 401', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer malformed.invalid.token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('TOKEN_EXPIRED_OR_INVALID');
    });

    it('Admin route GET /api/v1/admin/users should reject unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/v1/admin/users');
      expect(res.status).toBe(401);
    });
  });

  describe('404 Handling', () => {
    it('should return standardized 404 JSON for non-existent API routes', async () => {
      const res = await request(app).get('/api/v1/non-existent-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('ENDPOINT_NOT_FOUND');
    });
  });
});
