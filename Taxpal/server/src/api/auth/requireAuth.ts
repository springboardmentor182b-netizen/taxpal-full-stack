// server/src/api/auth/requireAuth.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// (optional) augment typing so TS knows req.user exists
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
export interface AuthedRequest extends Request {
  user?: { id?: string; userId?: string } & Record<string, any>;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Prefer Authorization header: "Bearer <jwt>"
  const hdr = req.headers.authorization;
  const token = hdr?.startsWith('Bearer ') ? hdr.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: 'Missing token' });

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
  }

  try {
    const payload: any = jwt.verify(token, secret);

    // Normalize an id for downstream code: supports id, _id, userId, or sub
    const normId =
      payload?.id ??
      payload?._id ??
      payload?.userId ??
      payload?.sub;

    if (!normId) {
      return res.status(401).json({ message: 'Token missing user identifier' });
    }

    // Attach a normalized user to the request
    req.user = {
      ...payload,
      id: String(normId),
      userId: String(normId), // convenience for models that expect userId
    };

    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/** Optional: attaches req.user if a valid token exists; otherwise continues */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const hdr = req.headers.authorization;
  const token = hdr?.startsWith('Bearer ') ? hdr.slice(7) : undefined;
  const secret = process.env.JWT_SECRET;
  if (token && secret) {
    try {
      const payload: any = jwt.verify(token, secret);
      const normId = payload?.id ?? payload?._id ?? payload?.userId ?? payload?.sub;
      req.user = normId
        ? { ...payload, id: String(normId), userId: String(normId) }
        : payload;
    } catch { /* ignore */ }
  }
  next();
}
