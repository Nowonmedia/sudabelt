import crypto from 'node:crypto';

export interface AdminTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'editor';
  iat: number;
  exp: number;
}

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

const getJwtSecret = (): string =>
  process.env.JWT_SECRET || 'sbm_jwt_secret_key_change_me_in_production';

const base64UrlEncode = (input: Buffer | string): string => {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const base64UrlDecode = (input: string): string => {
  const padLength = (4 - (input.length % 4)) % 4;
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLength);
  return Buffer.from(padded, 'base64').toString('utf8');
};

/**
 * Hashes a plaintext password using Node's native cryptographic scrypt KDF.
 */
export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derivedKey}`;
};

/**
 * Verifies a plaintext password against a stored scrypt hash or constant-time plain match.
 */
export const verifyPassword = (password: string, storedHashOrPlain: string): boolean => {
  if (storedHashOrPlain.startsWith('scrypt$')) {
    const parts = storedHashOrPlain.split('$');
    if (parts.length !== 3) return false;
    const [, salt, originalHash] = parts;
    const derivedBuf = crypto.scryptSync(password, salt, 64);
    const originalBuf = Buffer.from(originalHash, 'hex');
    if (derivedBuf.length !== originalBuf.length) return false;
    return crypto.timingSafeEqual(derivedBuf, originalBuf);
  }

  // Constant-time comparison for environment plaintext fallback
  const a = Buffer.from(password, 'utf8');
  const b = Buffer.from(storedHashOrPlain, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

/**
 * Signs an RFC 7519 HS256 JWT with a 7-day default expiration.
 */
export const signAdminJwt = (
  user: { id: string; email: string; name: string; role: 'superadmin' | 'admin' | 'editor' },
  expiresInSeconds = SEVEN_DAYS_SECONDS
): string => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: AdminTokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(signingInput)
    .digest();

  return `${signingInput}.${base64UrlEncode(signature)}`;
};

/**
 * Verifies an HS256 JWT and returns the decoded AdminTokenPayload.
 */
export const verifyAdminJwt = (token: string): AdminTokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = base64UrlEncode(
      crypto.createHmac('sha256', getJwtSecret()).update(signingInput).digest()
    );

    const sigBufferA = Buffer.from(encodedSignature, 'utf8');
    const sigBufferB = Buffer.from(expectedSignature, 'utf8');
    if (sigBufferA.length !== sigBufferB.length) return null;
    if (!crypto.timingSafeEqual(sigBufferA, sigBufferB)) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminTokenPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

/**
 * Parses cookies from the raw Cookie request header.
 */
export const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, pair) => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const val = decodeURIComponent(pair.slice(idx + 1).trim());
      acc[key] = val;
    }
    return acc;
  }, {});
};
