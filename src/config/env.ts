import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().default('4000'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string().email(),
    FIREBASE_PRIVATE_KEY: z.string(),
    FRONTEND_ORIGIN: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success)
{
    console.error('Invalid environment variables', parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;