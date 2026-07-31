import { Router } from 'express';
import {
  getCart, addToCart, updateCartItem, removeFromCart, clearCart
} from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/item/:productId', updateCartItem);
router.delete('/item/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
