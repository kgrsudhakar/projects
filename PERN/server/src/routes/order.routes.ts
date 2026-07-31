import { Router } from 'express';
import { checkout, getMyOrders, getOrderById } from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/checkout', checkout);
router.get('/me', getMyOrders);
router.get('/:id', getOrderById);

export default router;
