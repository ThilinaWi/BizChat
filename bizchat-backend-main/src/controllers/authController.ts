import { Request, Response } from 'express';
import User from '../models/User';
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
  deleteAllUserRefreshTokens,
  blacklistToken,
} from '../utils/jwt';
import { validateSignUpData, validateSignInData } from '../utils/validation';
import { ISignUpRequest, ISignInRequest, IAuthResponse } from '../types';
import {
  ValidationError,
  AuthenticationError,
  ConflictError,
} from '../utils/errors';
import { asyncHandler } from '../middleware/errorHandler';

export const signUp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, phoneNumber, password }: ISignUpRequest = req.body;

  const validationErrors = validateSignUpData({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
  });

  if (validationErrors.length > 0) {
    throw new ValidationError('Validation failed', validationErrors);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const user = new User({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    ...(phoneNumber && { phoneNumber: phoneNumber.trim() }),
    password,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please sign in to continue.',
    user: {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    },
  });
});

export const signIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password }: ISignInRequest = req.body;

  const validationErrors = validateSignInData({ email, password });

  if (validationErrors.length > 0) {
    throw new ValidationError('Validation failed', validationErrors);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken();
  await saveRefreshToken(user._id.toString(), refreshToken);

  const userResponse = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    createdAt: user.createdAt!,
    updatedAt: user.updatedAt!,
  };

  const response: IAuthResponse = {
    success: true,
    message: 'Sign in successful',
    accessToken,
    refreshToken,
    user: userResponse,
  };

  res.status(200).json(response);
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const userId = await verifyRefreshToken(refreshToken);
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    await deleteRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken();
    await saveRefreshToken(user._id.toString(), newRefreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }
);

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  // Delete refresh token if provided
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }

  // Blacklist the current access token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const accessToken = authHeader.substring(7);
    // We need userId to blacklist, try to get it from request or decode token
    const userId = req.user ? (req.user as any)._id : null;
    if (userId) {
      await blacklistToken(accessToken, userId);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const logoutAll = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !(req.user as any)._id) {
      throw new AuthenticationError('Authentication required');
    }

    const userId = (req.user as any)._id;
    
    // Delete all refresh tokens
    await deleteAllUserRefreshTokens(userId);

    // Blacklist the current access token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.substring(7);
      await blacklistToken(accessToken, userId);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
    });
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

// ─── Google OAuth callback handler ───────────────────────────────

export const googleAuthCallback = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.user as any;

    if (!user) {
      throw new AuthenticationError('Google authentication failed');
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(user._id.toString(), refreshToken);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // Redirect to frontend with tokens in query params
    // The frontend will extract these and store them
    const redirectUrl = new URL(`${clientUrl}/auth/google/success`);
    redirectUrl.searchParams.set('accessToken', accessToken);
    redirectUrl.searchParams.set('refreshToken', refreshToken);

    res.redirect(redirectUrl.toString());
  }
);

// ─── Complete Google OAuth profile (phone number) ────────────────

export const completeProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const { phoneNumber, firstName, lastName } = req.body;

    if (!phoneNumber) {
      throw new ValidationError('Phone number is required', [
        'Please provide a valid phone number',
      ]);
    }

    const userId = (req.user as any)._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (phoneNumber) user.phoneNumber = phoneNumber.trim();
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      user: {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        googleId: user.googleId,
        avatar: user.avatar,
        createdAt: user.createdAt!,
        updatedAt: user.updatedAt!,
      },
    });
  }
);
