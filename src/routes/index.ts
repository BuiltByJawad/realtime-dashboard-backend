import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import productRoutes from '../modules/products/products.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';

const router = Router();

router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/analytics', analyticsRoutes);

export default router;