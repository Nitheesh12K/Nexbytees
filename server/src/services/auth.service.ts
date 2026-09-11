import { userRepository } from '../repositories/user.repository';
import { tokenRepository } from '../repositories/token.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken } from '../utils/jwt';
import { prisma } from '../database/prisma';
import { AuthUser } from '../types';

export class AuthService {
  async register(data: { name: string; username: string; email: string; password: string }, userAgent?: string, ipAddress?: string) {
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw { statusCode: 409, code: 'EMAIL_EXISTS', message: 'An account with this email already exists' };
    }

    const existingUsername = await userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw { statusCode: 409, code: 'USERNAME_EXISTS', message: 'This username is already taken' };
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name.trim(),
          username: data.username.toLowerCase().trim(),
          email: data.email.toLowerCase().trim(),
          passwordHash,
        },
      });

      // Default user preferences
      await tx.userPreferences.create({
        data: {
          userId: newUser.id,
          preferredDomains: [],
          preferredTags: [],
        },
      });

      return newUser;
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    const accessToken = signAccessToken(authUser);
    const refreshToken = signRefreshToken(authUser);

    // Store refresh token session in database
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await tokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent,
      ipAddress,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: { email: string; password: string }, userAgent?: string, ipAddress?: string) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    const accessToken = signAccessToken(authUser);
    const refreshToken = signRefreshToken(authUser);

    // Save refresh session
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await tokenRepository.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent,
      ipAddress,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        techInterests: user.techInterests,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string, userAgent?: string, ipAddress?: string) {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw { statusCode: 401, code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is expired or invalid' };
    }

    const tokenHash = hashToken(refreshToken);
    const storedToken = await tokenRepository.findByTokenHash(tokenHash);

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw { statusCode: 401, code: 'SESSION_EXPIRED', message: 'Session has expired or was revoked. Please log in again.' };
    }

    // Revoke old refresh token (Token Rotation!)
    await tokenRepository.revoke(tokenHash);

    const user = storedToken.user;
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    const newAccessToken = signAccessToken(authUser);
    const newRefreshToken = signRefreshToken(authUser);

    // Save new rotated session
    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await tokenRepository.create({
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt,
      userAgent,
      ipAddress,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await tokenRepository.revoke(tokenHash).catch(() => {});
    }
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    // Don't reveal whether user exists for security
    if (!user) {
      return { message: 'If an account exists with this email, a password reset instruction has been processed.' };
    }

    // Return friendly status
    return {
      message: 'If an account exists with this email, a password reset instruction has been processed.',
      resetAvailable: true,
    };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'No account found with this email' };
    }

    const passwordHash = await hashPassword(newPassword);
    await userRepository.updatePassword(user.id, passwordHash);

    // Revoke all existing sessions on password reset for security
    await tokenRepository.revokeAllUserTokens(user.id);

    return { message: 'Password has been reset successfully. Please log in with your new password.' };
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'User not found' };
    }

    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();
