import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env';
import { sendError } from '../utils/response';

export const standardRateLimiter = rateLimit({
  windowMs: ENV.SECURITY.RATE_LIMIT_WINDOW_MS,
  max: ENV.SECURITY.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'RATE_LIMIT_EXCEEDED', 'Too many requests, please try again later.', 429);
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV.SECURITY.AUTH_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(
      res,
      'AUTH_RATE_LIMIT_EXCEEDED',
      'Too many login attempts. For security, please try again after 15 minutes.',
      429
    );
  },
});
