import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  verifyBooking,
  getBookingByReference,
  getAllBookings,
  getBookingStats,
} from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../constants/roles';

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

// ── User routes ──────────────────────────────────────────────────
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.post('/:id/cancel', cancelBooking);

// ── Manager routes ───────────────────────────────────────────────
router.post('/:id/verify', requireRole(UserRole.MANAGER, UserRole.ADMIN), verifyBooking);
router.get(
  '/reference/:reference',
  requireRole(UserRole.MANAGER, UserRole.ADMIN),
  getBookingByReference
);
router.get(
  '/manage/all',
  requireRole(UserRole.MANAGER, UserRole.ADMIN),
  getAllBookings
);
router.get(
  '/manage/stats/:eventId',
  requireRole(UserRole.MANAGER, UserRole.ADMIN),
  getBookingStats
);

export default router;
