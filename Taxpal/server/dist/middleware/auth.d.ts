import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=auth.d.ts.map