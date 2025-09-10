// Simple validation middleware example
import { Request, Response, NextFunction } from 'express';
export function validateBody(req: Request, res: Response, next: NextFunction) {
  // placeholder validation
  next();
}
