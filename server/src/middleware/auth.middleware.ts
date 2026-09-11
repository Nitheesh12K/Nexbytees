import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../database/prisma';
import { sendError } from '../utils/response';

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'UNAUTHORIZED', 'Authentication token required', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    sendError(res, 'TOKEN_EXPIRED_OR_INVALID', 'Invalid or expired authentication token', 401);
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      sendError(res, 'USER_NOT_FOUND', 'User belonging to this token no longer exists', 401);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendError(res, 'INTERNAL_SERVER_ERROR', 'Authentication verification failed', 500);
  }
}

export async function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return next();
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
      },
    });

    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
}

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        'FORBIDDEN',
        'You do not have permission to perform this action',
        403,
        { requiredRoles: allowedRoles, currentRole: req.user.role }
      );
      return;
    }

    next();
  };
}
