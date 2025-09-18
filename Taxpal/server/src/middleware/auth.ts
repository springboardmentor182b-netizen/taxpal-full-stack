import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// ────────────────────────────────────────────────────────────────
// Shared type for requests that carry authenticated user info
// ────────────────────────────────────────────────────────────────
export interface AuthedRequest extends Request {
  user?: any;   // can be full user doc or { id: string }, depending on middleware
}

// ────────────────────────────────────────────────────────────────
// 1) Existing middleware – loads the full User document
//    Use this when you need all user details on req.user
// ────────────────────────────────────────────────────────────────
export const authenticateToken = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// ────────────────────────────────────────────────────────────────
// 2) New lightweight middleware – attaches only { id }
//    Use this when you only need the user’s ID for quick checks
// ────────────────────────────────────────────────────────────────
export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string; userId?: string };
    // prefer decoded.userId if your JWT stores it that way
    req.user = { id: decoded.id || decoded.userId };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
