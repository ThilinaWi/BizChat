import { Router } from 'express';
import {
  getTicketsByEvent,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getAllTickets,
} from '../controllers/ticketController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../constants/roles';

const router = Router();

// Public routes
router.get('/event/:eventId', getTicketsByEvent);
router.get('/:id', getTicketById);

// Manager & Admin routes
router.use(authMiddleware);
router.use(requireRole(UserRole.MANAGER, UserRole.ADMIN));

router.get('/', getAllTickets);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;
