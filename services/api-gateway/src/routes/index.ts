import { Router } from 'express';
import authRoutes from './auth.routes';
import proxyRoutes from './proxy.routes';

const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1', proxyRoutes);

export default router;
