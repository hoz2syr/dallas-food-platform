import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

const router = Router();
const healthController = new HealthController();

router.get('/health', healthController.getHealth.bind(healthController));
router.get('/metrics', healthController.getMetrics.bind(healthController));
router.get('/ready', (req, res) => res.json({ status: 'ready' }));
router.get('/live', (req, res) => res.json({ status: 'alive' }));

export default router;
