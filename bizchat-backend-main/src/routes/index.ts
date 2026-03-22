import { Router } from 'express';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import eventRoutes from './eventRoutes';
import ticketRoutes from './ticketRoutes';
import bookingRoutes from './bookingRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/events', eventRoutes);
router.use('/tickets', ticketRoutes);
router.use('/bookings', bookingRoutes);

export default router;
