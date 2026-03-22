import { Request, Response } from 'express';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  ConflictError,
} from '../utils/errors';
import { validateUpdateUserData, validateSignUpData } from '../utils/validation';
import { IUpdateUserRequest, ICreateManagerRequest } from '../types';
import { UserRole } from '../constants/roles';
import { deleteAllUserRefreshTokens } from '../utils/jwt';

// ─── ADMIN: Create a manager account ─────────────────────────────

export const createManager = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, phoneNumber, password }: ICreateManagerRequest =
      req.body;

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

    const manager = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      ...(phoneNumber && { phoneNumber: phoneNumber.trim() }),
      password,
      role: UserRole.MANAGER,
    });

    await manager.save();

    res.status(201).json({
      success: true,
      message: 'Manager account created successfully',
      data: {
        _id: manager._id.toString(),
        firstName: manager.firstName,
        lastName: manager.lastName,
        email: manager.email,
        phoneNumber: manager.phoneNumber,
        role: manager.role,
        createdAt: manager.createdAt!,
        updatedAt: manager.updatedAt!,
      },
    });
  }
);

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.role) {
      query.role = req.query.role;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

export const getUserById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

export const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: IUpdateUserRequest = req.body;

    const validationErrors = validateUpdateUserData(updateData);
    if (validationErrors.length > 0) {
      throw new ValidationError('Validation failed', validationErrors);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (updateData.role && (req.user as any)?.role !== UserRole.ADMIN) {
      throw new AuthorizationError('Only admins can change user roles');
    }

    if (updateData.firstName) user.firstName = updateData.firstName.trim();
    if (updateData.lastName) user.lastName = updateData.lastName.trim();
    if (updateData.phoneNumber) user.phoneNumber = updateData.phoneNumber.trim();
    if (updateData.role) user.role = updateData.role;

    await user.save();

    const updatedUser = await User.findById(id).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if ((req.user as any)?._id === id) {
      throw new AuthorizationError('You cannot delete your own account');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await deleteAllUserRefreshTokens(user._id.toString());
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  }
);

export const getUserStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Use countDocuments per role — CosmosDB for MongoDB does not support $group aggregation
    const [total, users, managers, admins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: UserRole.USER }),
      User.countDocuments({ role: UserRole.MANAGER }),
      User.countDocuments({ role: UserRole.ADMIN }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byRole: {
          [UserRole.USER]: users,
          [UserRole.MANAGER]: managers,
          [UserRole.ADMIN]: admins,
        },
      },
    });
  }
);