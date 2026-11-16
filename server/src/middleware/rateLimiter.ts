import { Request, Response, NextFunction } from 'express';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

/**
 * Lightweight zero-dependency in-memory rate limiter middleware.
 * Protects public form endpoints and authentication routes from automated abuse.
 */
export const createRateLimiter = (options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) => {
  const buckets = new Map<string, RateLimitBucket>();

  return (req: Request, res: Response, next: NextFunction): void => {
    // Skip rate limiting during automated local test runs
    if (process.env.NODE_ENV === 'test') {
      next();
      return;
    }

    const now = Date.now();
    const clientIp =
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0].trim()
        : req.ip) || 'unknown';

    const key = `${clientIp}:${req.baseUrl}${req.path}`;
    const existing = buckets.get(key);

    if (!existing || now > existing.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }

    if (existing.count >= options.maxRequests) {
      const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfterSeconds));
      res.status(429).json({
        success: false,
        message:
          options.message ||
          'Too many requests from this IP address. Please wait a moment and try again.',
      });
      return;
    }

    existing.count += 1;
    next();
  };
};
