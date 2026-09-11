import { Role, NewsDomain, NewsStatus } from '@prisma/client';
import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface NewsQueryFilters {
  domain?: NewsDomain;
  tag?: string;
  search?: string;
  sort?: 'latest' | 'trending' | 'views';
  status?: NewsStatus;
  page?: number;
  limit?: number;
}
