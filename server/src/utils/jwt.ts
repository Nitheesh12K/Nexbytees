import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../config/env';
import { AuthUser } from '../types';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signAccessToken(user: AuthUser): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, ENV.JWT.ACCESS_SECRET, {
    expiresIn: ENV.JWT.ACCESS_EXPIRES_IN as any,
  });
}

export function signRefreshToken(user: AuthUser): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, ENV.JWT.REFRESH_SECRET, {
    expiresIn: ENV.JWT.REFRESH_EXPIRES_IN as any,
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT.ACCESS_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT.REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
