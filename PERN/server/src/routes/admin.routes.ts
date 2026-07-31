import { Router } from 'express';
import {
  getAdminStats, getUsers, updateUserRole, getAllOrders, updateOrderStatus
} from '../controllers/admin.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware, roleMiddleware('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
