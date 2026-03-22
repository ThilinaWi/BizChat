import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, isTokenBlacklisted } from '../utils/jwt';
import User from '../models/User';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authentication required. Please provide a valid token');
    }

    const token = authHeader.substring(7);
    
    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new AuthenticationError('Token has been invalidated. Please sign in again');
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    } as any;

    next();
  } catch (error) {
    next(error);
  }
};
