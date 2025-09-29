import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../../api/auth/User';

// ────────────────────────────────────────────────────────────────
// Shared type for requests that carry authenticated user info
// ────────────────────────────────────────────────────────────────
export interface AuthedRequest extends Request {
  user?: { id: string } & any; // keep 'any' to allow full user doc when desired
}

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────
function extractToken(req: Request): string | null {
  const header = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
  if (header && /^Bearer\s+/i.test(header)) return header.split(' ')[1];
  // Optional: cookie support if your app uses cookies
  const cookie = (req as any).cookies?.token;
  if (cookie) return cookie;
  return null;
}

function getUserIdFromPayload(payload: JwtPayload | string): string | null {
  if (typeof payload === 'string') return null;
  return (payload.userId as string) || (payload.id as string) || (payload.sub as string) || null;
}

// ────────────────────────────────────────────────────────────────
/** 1) Full user loader – attaches the full User doc (minus password). */
// ────────────────────────────────────────────────────────────────
export const authenticateToken = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req);
  if (!token) { res.status(401).json({ message: 'Access token required' }); return; }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;
    const uid = getUserIdFromPayload(decoded);
    if (!uid) { res.status(401).json({ message: 'Invalid token payload' }); return; }

    const user = await User.findById(uid).select('-password');
    if (!user) { res.status(401).json({ message: 'Invalid token' }); return; }

    // Mongoose documents expose .id (string) virtual; controllers can use req.user.id
    req.user = user;
    next();
  } catch {
    // Always 401 (avoid 403/redirects so front-end can handle consistently)
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ────────────────────────────────────────────────────────────────
/** 2) Lightweight auth – attaches only { id } for faster paths. */
// ────────────────────────────────────────────────────────────────
export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const token = extractToken(req);
  if (!token) { res.status(401).json({ message: 'No token' }); return; }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;
    const uid = getUserIdFromPayload(decoded);
    if (!uid) { res.status(401).json({ message: 'Invalid token payload' }); return; }

    req.user = { id: uid };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
