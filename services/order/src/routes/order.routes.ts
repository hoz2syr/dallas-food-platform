import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const router = Router();
const controller = new OrderController();

router.post('/', (req, res) => controller.createOrder(req, res));
router.get('/', (req, res) => controller.getOrders(req, res));
router.put('/:id/status', (req, res) => controller.updateOrderStatus(req, res));

export default router;
