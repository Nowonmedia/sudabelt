import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../models';
import { signAdminJwt, verifyPassword } from '../utils/auth.utils';
import { ADMIN_COOKIE_NAME, requireAdminAuth } from '../middleware/auth.middleware';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20,
  message: 'Too many login attempts. Please wait 15 minutes before trying again.',
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .transform((v) => v.toLowerCase()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(4, 'Password must be at least 4 characters'),
});

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * POST /api/v1/auth/login
 * Authenticates admin against User collection or environment admin credentials.
 * Returns signed 7-day JWT in both httpOnly cookie and Bearer token response.
 */
router.post('/login', loginRateLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    let authenticatedUser: {
      id: string;
      email: string;
      name: string;
      role: 'superadmin' | 'admin' | 'editor';
    } | null = null;

    // 1. Check User collection in MongoDB first (gracefully fallback if DB not seeded with user)
    const dbUser = await User.findOne({ email, isActive: true }).exec().catch(() => null);
    if (dbUser && verifyPassword(password, dbUser.passwordHash)) {
      if (typeof dbUser.save === 'function') {
        dbUser.lastLoginAt = new Date();
        await dbUser.save().catch(() => null);
      } else {
        await User.findByIdAndUpdate(dbUser._id, { lastLoginAt: new Date() }).catch(() => null);
      }

      authenticatedUser = {
        id: String(dbUser._id),
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role as 'superadmin' | 'admin' | 'editor',
      };
    }

    // 2. Fallback to environment admin variables (Always has superadmin role)
    if (!authenticatedUser) {
      const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@sudabelt.com').toLowerCase().trim();
      const envAdminPassword =
        process.env.ADMIN_PASSWORD_HASH ||
        process.env.ADMIN_PASSWORD ||
        'SudabeltAdmin2026!';
      const envAdminName = process.env.ADMIN_NAME || 'Sudabelt Administrator';

      if (email === envAdminEmail && verifyPassword(password, envAdminPassword)) {
        authenticatedUser = {
          id: 'env-admin-01',
          email: envAdminEmail,
          name: envAdminName,
          role: 'superadmin',
        };
      }
    }

    if (!authenticatedUser) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const token = signAdminJwt(authenticatedUser);

    res.cookie(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SEVEN_DAYS_MS,
      path: '/',
    });

    res.status(200).json({
      success: true,
      token,
      expiresIn: '7d',
      user: authenticatedUser,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/logout
 * Clears active httpOnly session cookie.
 */
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: '/' });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

/**
 * GET /api/v1/auth/me
 * Verifies active session token and returns current admin identity.
 */
router.get('/me', requireAdminAuth, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.adminUser,
  });
});

export default router;
