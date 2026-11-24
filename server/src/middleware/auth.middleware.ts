import { Request, Response, NextFunction } from 'express';
import { AdminTokenPayload, parseCookies, verifyAdminJwt } from '../utils/auth.utils';

declare global {
  namespace Express {
    interface Request {
      adminUser?: {
        id: string;
        email: string;
        name: string;
        role: 'superadmin' | 'admin' | 'editor';
      };
    }
  }
}

export const ADMIN_COOKIE_NAME = 'sbm_admin_token';

/**
 * Middleware protecting all /api/v1/admin/* endpoints and /api/v1/auth/me.
 * Supports Bearer JWT token, httpOnly cookie (`sbm_admin_token`), or `x-admin-key` header.
 */
export const requireAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Check x-admin-key API Token header if configured
  const apiKeyHeader = req.headers['x-admin-key'];
  const configuredApiKey = process.env.ADMIN_API_KEY;
  if (
    typeof apiKeyHeader === 'string' &&
    configuredApiKey &&
    apiKeyHeader === configuredApiKey
  ) {
    req.adminUser = {
      id: 'env-api-key-admin',
      email: process.env.ADMIN_EMAIL || 'admin@sudabelt.com',
      name: 'Sudabelt API Super Admin',
      role: 'superadmin',
    };
    next();
    return;
  }

  // 2. Extract JWT from Authorization: Bearer <token> or httpOnly Cookie
  let token: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies[ADMIN_COOKIE_NAME];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid Bearer token or session cookie.',
    });
    return;
  }

  const decoded: AdminTokenPayload | null = verifyAdminJwt(token);
  if (!decoded) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
    return;
  }

  req.adminUser = {
    id: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
  };

  next();
};

/**
 * Middleware ensuring ONLY Superadmin can manage administrators and critical system configuration.
 */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.adminUser || req.adminUser.role !== 'superadmin') {
    res.status(403).json({
      success: false,
      message: 'Forbidden. Only Superadmin has permission to manage team administrators.',
    });
    return;
  }
  next();
};
