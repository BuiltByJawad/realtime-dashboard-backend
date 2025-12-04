import jwt from "jsonwebtoken";
import { env } from '../../config/env';
import { AuthUser } from './auth.types';

const DEMO_USER_EMAIL = 'admin@example.com';
const DEMO_USER_PASSWORD = 'Admin@123';
const DEMO_USER: AuthUser = {
  id: 'demo-user-1',
  email: DEMO_USER_EMAIL,
  name: 'Demo Admin',
  role: 'admin',
};

export function validateCredentials(email: string, password: string): AuthUser | null {
    if(email === DEMO_USER_EMAIL && password === DEMO_USER_PASSWORD)
    {
        return DEMO_USER;
    }
    return null;
}

export function generateAuthToken(user: AuthUser): string {
    return jwt.sign(  {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1h',
    })
}