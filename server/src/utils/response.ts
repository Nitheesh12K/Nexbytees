import { Response } from 'express';
import { ApiResponse, ApiErrorResponse, PaginationMeta } from '../types';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  pagination?: PaginationMeta
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(pagination ? { pagination } : {}),
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: any
): Response {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
  return res.status(statusCode).json(body);
}
