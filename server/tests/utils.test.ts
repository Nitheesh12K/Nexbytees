import { hashPassword, comparePassword } from '../src/utils/password';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken } from '../src/utils/jwt';
import { createSlug } from '../src/utils/slugify';
import { calculateTrendingScore } from '../src/utils/trending';
import { Role } from '@prisma/client';
import { AuthUser } from '../src/types';

describe('Backend Utilities Unit Tests', () => {
  describe('Password Hashing', () => {
    it('should hash a password and correctly verify it with comparePassword', async () => {
      const rawPassword = 'SuperSecretPassword2026!';
      const hash = await hashPassword(rawPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(rawPassword);

      const isMatch = await comparePassword(rawPassword, hash);
      expect(isMatch).toBe(true);

      const wrongMatch = await comparePassword('WrongPassword123', hash);
      expect(wrongMatch).toBe(false);
    });
  });

  describe('JWT Token Handling', () => {
    const mockUser: AuthUser = {
      id: 'test-user-id-123',
      email: 'alex@nexbytees.com',
      username: 'alex_nex',
      name: 'Alex Rivera',
      role: Role.USER,
    };

    it('should sign and verify valid access tokens', () => {
      const token = signAccessToken(mockUser);
      expect(typeof token).toBe('string');

      const payload = verifyAccessToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toEqual(mockUser.id);
      expect(payload?.email).toEqual(mockUser.email);
      expect(payload?.role).toEqual(mockUser.role);
    });

    it('should sign and verify valid refresh tokens', () => {
      const token = signRefreshToken(mockUser);
      expect(typeof token).toBe('string');

      const payload = verifyRefreshToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toEqual(mockUser.id);
    });

    it('should return null when verifying a malformed token', () => {
      const invalidToken = 'invalid.jwt.token';
      expect(verifyAccessToken(invalidToken)).toBeNull();
      expect(verifyRefreshToken(invalidToken)).toBeNull();
    });

    it('should produce consistent sha256 hashes for database token tracking', () => {
      const token = 'sample-refresh-token';
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);
      expect(hash1).toEqual(hash2);
      expect(hash1.length).toEqual(64);
    });
  });

  describe('Slugify Utility', () => {
    it('should produce URL-safe lowercase slugs with unique collision suffixes', () => {
      const title = 'Quantum Silicon Breakthrough: 10,000 Qubits!';
      const slug = createSlug(title);

      expect(slug).toMatch(/^quantum-silicon-breakthrough-10000-qubits-[a-z0-9]+$/);
    });
  });

  describe('Trending Score with Natural Decay', () => {
    it('should calculate higher scores for articles with high interactions and recent timestamps', () => {
      const freshArticle = {
        views: 1000,
        likes: 200,
        saves: 150,
        shares: 80,
        comments: 60,
        publishedAt: new Date(), // published now
      };

      const oldArticle = {
        views: 1000,
        likes: 200,
        saves: 150,
        shares: 80,
        comments: 60,
        publishedAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // published 72 hours ago
      };

      const freshScore = calculateTrendingScore(freshArticle);
      const oldScore = calculateTrendingScore(oldArticle);

      expect(freshScore).toBeGreaterThan(oldScore);
      expect(freshScore).toBeGreaterThan(0);
      expect(oldScore).toBeGreaterThan(0);
    });
  });
});
