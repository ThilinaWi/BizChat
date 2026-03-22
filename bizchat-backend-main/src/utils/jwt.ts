import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ITokenPayload } from '../types';
import { UserRole } from '../constants/roles';
import RefreshToken from '../models/RefreshToken';
import TokenBlacklist from '../models/TokenBlacklist';
import { AuthenticationError } from './errors';
import { log } from './logger';

export const generateAccessToken = (userId: string, role: UserRole): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
  }

  const payload: ITokenPayload = { userId, role };
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const saveRefreshToken = async (
  userId: string,
  token: string
): Promise<void> => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  
  const expiresInMs = parseExpiration(expiresIn);
  const expiresAt = new Date(Date.now() + expiresInMs);

  await RefreshToken.create({
    userId,
    token,
    expiresAt,
  });
};

export const verifyAccessToken = (token: string): ITokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
  }

  // Let JsonWebTokenError / TokenExpiredError propagate naturally so the
  // errorHandler can return distinct messages ("Token has expired" vs "Invalid token")
  const decoded = jwt.verify(token, secret) as ITokenPayload;
  return decoded;
};

export const verifyRefreshToken = async (token: string): Promise<string> => {
  const refreshToken = await RefreshToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  if (!refreshToken) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  return refreshToken.userId;
};

export const deleteRefreshToken = async (token: string): Promise<void> => {
  await RefreshToken.deleteOne({ token });
};

export const deleteAllUserRefreshTokens = async (userId: string): Promise<void> => {
  await RefreshToken.deleteMany({ userId });
};

const parseExpiration = (expiresIn: string): number => {
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  return value * units[unit];
};

// Token Blacklist Functions
export const blacklistToken = async (token: string, userId: string): Promise<void> => {
  try {
    const decoded = jwt.decode(token) as ITokenPayload & { exp: number };
    
    if (!decoded || !decoded.exp) {
      return; // Token is already invalid, no need to blacklist
    }

    const expiresAt = new Date(decoded.exp * 1000);

    await TokenBlacklist.create({
      token,
      userId,
      expiresAt,
    });
  } catch (error) {
    // If token is invalid, we don't need to blacklist it
    log.warn('Failed to blacklist token', { error: (error as Error).message });
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const blacklistedToken = await TokenBlacklist.findOne({ token });
  return !!blacklistedToken;
};

export const blacklistAllUserTokens = async (userId: string): Promise<void> => {
  // Note: This is a placeholder. In a real-world scenario, you would need to track
  // all active access tokens for a user, which requires additional infrastructure.
  // For now, we'll just delete all refresh tokens and blacklist on logout.
  await deleteAllUserRefreshTokens(userId);
};
