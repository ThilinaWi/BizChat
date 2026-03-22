import { Router } from 'express';
import {
  getPublishedEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
} from '../controllers/eventController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../constants/roles';

const router = Router();

// Public routes
router.get('/public', getPublishedEvents);
router.get('/public/:id', getEventById);

// Manager & Admin routes
router.use(authMiddleware);
router.use(requireRole(UserRole.MANAGER, UserRole.ADMIN));

router.get('/', getAllEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
