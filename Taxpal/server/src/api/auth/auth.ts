import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from './user.model';

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    userId: string;
    _id?: any;
    name?: string;
    email?: string;
    country?: string;
    income_bracket?: 'low' | 'middle' | 'high';
  } & Record<string, any>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

function extractToken(req: Request): string | null {
  const header = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
  if (header && /^Bearer\s+/i.test(header)) return header.split(' ')[1];
  const cookie = (req as any).cookies?.token;
  if (cookie) return cookie;
  return null;
}

function getUserIdFromPayload(payload: JwtPayload | string): string | null {
  if (typeof payload === 'string') return null;
  return (payload.userId as string) || (payload.id as string) || (payload.sub as string) || null;
}

export const authenticateToken = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) { res.status(401).json({ message: 'Access token required' }); return; }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const uid = getUserIdFromPayload(decoded);
    if (!uid) { res.status(401).json({ message: 'Invalid token payload' }); return; }

    const user = await User.findById(uid).select('-password').lean();
    if (!user) { res.status(401).json({ message: 'Invalid token' }); return; }

    req.user = { ...user, id: String(user._id), userId: String(user._id) };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
  if (!token) { res.status(401).json({ message: 'No token' }); return; }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const uid = getUserIdFromPayload(decoded);
    if (!uid) { res.status(401).json({ message: 'Invalid token payload' }); return; }

    req.user = { id: String(uid), userId: String(uid) };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
