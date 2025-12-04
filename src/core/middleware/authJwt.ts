import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env';
import { AuthUser } from '../../modules/auth/auth.types';

interface TokenPayload extends JwtPayload {
    sub: string;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthUser;
}

const COOKIE_NAME = 'auth_token';

export function authJwt(req: AuthenticatedRequest, res: Response, next: NextFunction)
{
    const token = req.cookies?.[COOKIE_NAME];

    if(!token)
    {
        return res.status(401).json({ success: false, message: 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            name: 'Demo Admin',
            role: decoded.role as 'admin' | 'user',
        };
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}