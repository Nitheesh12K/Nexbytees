import { z } from 'zod';
import { NewsDomain, NewsStatus, Role } from '@prisma/client';

// ================= AUTH VALIDATORS =================
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// ================= NEWS VALIDATORS =================
export const createNewsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(300),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  imageUrl: z.string().url('Invalid image URL'),
  sourceName: z.string().min(2, 'Source name is required').max(100),
  sourceUrl: z.string().url('Invalid source URL'),
  domain: z.nativeEnum(NewsDomain, { errorMap: () => ({ message: 'Invalid technology domain' }) }),
  tags: z.array(z.string()).default([]),
  status: z.nativeEnum(NewsStatus).optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

export const newsQuerySchema = z.object({
  domain: z.nativeEnum(NewsDomain).optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'trending', 'views']).optional().default('latest'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// ================= USER VALIDATORS =================
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  techInterests: z.array(z.string()).optional(),
  profileImage: z.string().url().optional(),
});

export const updatePreferencesSchema = z.object({
  preferredDomains: z.array(z.nativeEnum(NewsDomain)).optional(),
  preferredTags: z.array(z.string()).optional(),
  preferredLanguage: z.string().max(10).optional(),
  theme: z.enum(['dark', 'light']).optional(),
});

export const updateRoleSchema = z.object({
  role: z.nativeEnum(Role, { errorMap: () => ({ message: 'Invalid user role' }) }),
});

// ================= UPLOAD VALIDATORS =================
export const createUploadSchema = z.object({
  title: z.string().min(5).max(300),
  description: z.string().min(10).max(1000),
  content: z.string().min(20),
  imageUrl: z.string().url(),
  sourceName: z.string().min(2).max(100),
  sourceUrl: z.string().url(),
  domain: z.nativeEnum(NewsDomain),
  tags: z.array(z.string()).default([]),
});

export const updateUploadSchema = createUploadSchema.partial();

export const rejectUploadSchema = z.object({
  rejectionReason: z.string().min(5, 'Rejection reason is required').max(500),
});

// ================= COMMENT VALIDATORS =================
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
  parentCommentId: z.string().uuid().optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000),
});
