import { Router } from 'express';
import { DeliveryController } from '../controllers/DeliveryController';

const router = Router();
const controller = new DeliveryController();

router.get('/order/:orderId', controller.getDeliveryByOrderId.bind(controller));
router.put('/trip/:tripId/status', controller.updateDeliveryStatus.bind(controller));
router.get('/status/:status', controller.getDeliveriesByStatus.bind(controller));

export default router;
