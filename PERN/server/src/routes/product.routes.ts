import { Router } from 'express';
import {
  createProduct, getProducts, getProductById, updateProduct, deleteProduct,
  createCategory, getCategories
} from '../controllers/product.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/categories', getCategories);

// Admin routes
router.post('/products', authMiddleware, roleMiddleware('ADMIN'), createProduct);
router.patch('/products/:id', authMiddleware, roleMiddleware('ADMIN'), updateProduct);
router.delete('/products/:id', authMiddleware, roleMiddleware('ADMIN'), deleteProduct);
router.post('/categories', authMiddleware, roleMiddleware('ADMIN'), createCategory);

export default router;
