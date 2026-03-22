import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../utils/errors';
import { UserRole, hasRequiredRole } from '../constants/roles';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthorizationError('Authentication required');
      }

      const userRole = (req.user as any).role;
      const hasPermission = allowedRoles.some(role => 
        hasRequiredRole(userRole, role)
      );

      if (!hasPermission) {
        throw new AuthorizationError(
          `Access denied. Required role: ${allowedRoles.join(' or ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdmin = requireRole(UserRole.ADMIN);
export const requireManager = requireRole(UserRole.MANAGER);
export const requireUser = requireRole(UserRole.USER);
