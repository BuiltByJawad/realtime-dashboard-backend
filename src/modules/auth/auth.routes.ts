import { Router } from 'express';
import { loginHandler, meHandler, logoutHandler } from './auth.controller';
import { validate } from '../../core/middleware/validate';
import { loginSchema } from './auth.validator';
import { authJwt } from '../../core/middleware/authJwt';

const router = Router();

router.post('/login', validate(loginSchema, 'body'), loginHandler);
router.get('/me', authJwt, meHandler);
router.post('/logout', authJwt, logoutHandler);

export default router;