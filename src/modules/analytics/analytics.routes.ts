import { Router } from 'express';
import { getOverviewHandler } from './analytics.controller';
import { authJwt } from '../../core/middleware/authJwt';

const router = Router();

router.use(authJwt);
router.get('/overview', getOverviewHandler);

export default router;