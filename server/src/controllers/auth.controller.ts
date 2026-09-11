import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const result = await authService.register(req.body, userAgent, ipAddress);
      sendSuccess(res, result, 'Account created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const result = await authService.login(req.body, userAgent, ipAddress);
      sendSuccess(res, result, 'Logged in successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip;

      const tokens = await authService.refresh(refreshToken, userAgent, ipAddress);
      sendSuccess(res, tokens, 'Token refreshed successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      sendSuccess(res, { loggedOut: true }, 'Logged out successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      sendSuccess(res, result, 'Password reset instruction processed', 200);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, newPassword } = req.body;
      const result = await authService.resetPassword(email, newPassword);
      sendSuccess(res, result, 'Password reset successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getCurrentUser(req.user!.id);
      sendSuccess(res, user, 'User profile retrieved', 200);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
