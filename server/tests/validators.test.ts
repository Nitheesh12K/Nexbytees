import {
  registerSchema,
  loginSchema,
  createNewsSchema,
  createCommentSchema,
  createUploadSchema,
} from '../src/validators';
import { NewsDomain } from '@prisma/client';

describe('Zod Validators Unit Tests', () => {
  describe('Register Schema', () => {
    it('should validate correct user registration payload', () => {
      const validData = {
        name: 'Jane Doe',
        username: 'janedoe_tech',
        email: 'jane@example.com',
        password: 'securepassword123',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email and short password', () => {
      const invalidData = {
        name: 'J',
        username: 'jane@invalid!',
        email: 'not-an-email',
        password: 'short',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorFields = result.error.errors.map((e) => e.path[0]);
        expect(errorFields).toContain('name');
        expect(errorFields).toContain('username');
        expect(errorFields).toContain('email');
        expect(errorFields).toContain('password');
      }
    });
  });

  describe('News Article Schema', () => {
    it('should validate correct news article payload', () => {
      const validArticle = {
        title: 'Breakthrough in Neuromorphic Photonics Computing',
        description: 'New optical neuromorphic processor processes 100 trillion operations per second with near-zero latency.',
        content: 'Detailed editorial breakdown of the optical photonic chip developed at research laboratories worldwide...',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        sourceName: 'Photonics Tech Wire',
        sourceUrl: 'https://nexbytees.com/source',
        domain: NewsDomain.AI,
        tags: ['Photonics', 'Neuromorphic', 'AI'],
      };

      const result = createNewsSchema.safeParse(validArticle);
      expect(result.success).toBe(true);
    });

    it('should reject invalid domain enum', () => {
      const invalidArticle = {
        title: 'Title that is long enough',
        description: 'Description that is definitely long enough',
        content: 'Content that is definitely long enough for publication',
        imageUrl: 'https://valid-url.com/image.jpg',
        sourceName: 'Tech News',
        sourceUrl: 'https://valid-url.com',
        domain: 'INVALID_DOMAIN_TYPE',
        tags: [],
      };

      const result = createNewsSchema.safeParse(invalidArticle);
      expect(result.success).toBe(false);
    });
  });

  describe('Comments & Uploads Schema', () => {
    it('should reject empty comment content', () => {
      const result = createCommentSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });

    it('should accept valid upload payload', () => {
      const validUpload = {
        title: 'Community Contribution on RISC-V Silicon',
        description: 'Detailed analysis on open-source hardware cores verified on FPGA testbeds.',
        content: 'Full long-form technical article submission detailing architecture, registers, and test results...',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        sourceName: 'Open Hardware Foundation',
        sourceUrl: 'https://nexbytees.com/riscv',
        domain: NewsDomain.SEMICONDUCTORS,
        tags: ['RISC-V', 'Open Source'],
      };

      const result = createUploadSchema.safeParse(validUpload);
      expect(result.success).toBe(true);
    });
  });
});
