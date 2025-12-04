import { Request, Response } from 'express';
import { env } from '../../config/env';
import { validateCredentials, generateAuthToken } from './auth.service';
import { AuthUser } from './auth.types';

interface AuthenticatedRequest extends Request {
    user?: AuthUser;
}

const COOKIE_NAME = 'auth_token';

export const loginHandler = (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string, password: string };
    
    const user = validateCredentials(email, password);

    if(!user)
    {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    const token = generateAuthToken(user);

    // In production the frontend runs on a different origin (e.g. Vercel)
    // so we need SameSite "none" + secure cookies to allow the browser
    // to send the auth cookie with cross-site requests.
    const isProd = env.NODE_ENV === 'production';

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 60 * 60 * 1000,
    });

    return res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
};

export const meHandler = (req: AuthenticatedRequest, res: Response) => {
    if(!req.user)
    {
        return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    return res.json({
        success: true,
        user: req.user,
    });
};

export const logoutHandler = (req: Request, res: Response) => {
    const isProd = env.NODE_ENV === 'production';

    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
    });

    return res.json({ success: true });
}