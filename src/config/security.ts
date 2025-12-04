import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './env';

const corsOptions: CorsOptions = {
    origin: env.FRONTEND_ORIGIN ?? true,
    credentials: true,
};

export const securityMiddleware = {
    helmet: helmet(),
    cors: cors(corsOptions),
    rateLimiter: rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    }),
};