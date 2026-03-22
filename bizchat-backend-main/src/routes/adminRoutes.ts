import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  createManager,
} from '../controllers/adminController';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.post('/managers', createManager);
router.get('/users', getAllUsers);
router.get('/users/stats', getUserStats);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
