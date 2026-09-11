import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { sendError } from '../utils/response';
import { ENV } from '../config/env';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || ['field'];
      sendError(
        res,
        'CONFLICT',
        `A record with this ${target.join(', ')} already exists`,
        409,
        { fields: target }
      );
      return;
    }

    if (err.code === 'P2025') {
      sendError(res, 'NOT_FOUND', 'Requested resource was not found', 404);
      return;
    }
  }

  // Payload Too Large
  if (err.type === 'entity.too.large' || err.code === 'LIMIT_FILE_SIZE') {
    sendError(res, 'PAYLOAD_TOO_LARGE', 'Uploaded file or payload exceeds maximum allowed size', 413);
    return;
  }

  // Syntax Error in JSON Body
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'BAD_REQUEST', 'Malformed JSON in request body', 400);
    return;
  }

  // Custom Service Errors with statusCode
  if (err && typeof err.statusCode === 'number') {
    sendError(
      res,
      err.code || 'BAD_REQUEST',
      err.message || 'Operation failed',
      err.statusCode,
      err.details
    );
    return;
  }

  // Default Internal Error
  console.error('[Unhandled Error]:', err);

  sendError(
    res,
    'INTERNAL_SERVER_ERROR',
    'An unexpected internal error occurred on the server',
    500,
    ENV.NODE_ENV === 'development' ? { message: err.message, stack: err.stack } : undefined
  );
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 'ENDPOINT_NOT_FOUND', `Route ${req.method} ${req.originalUrl} does not exist`, 404);
}
