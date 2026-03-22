import { Router } from 'express';
import passport from 'passport';
import {
  signUp,
  signIn,
  refreshAccessToken,
  logout,
  logoutAll,
  getCurrentUser,
  googleAuthCallback,
  completeProfile,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Email / password auth
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', authMiddleware, logout);
router.post('/logout-all', authMiddleware, logoutAll);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/complete-profile', authMiddleware, completeProfile);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/google/failure`,
  }),
  googleAuthCallback
);

export default router;
