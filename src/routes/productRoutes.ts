import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  getCategories,
  deleteCategory,
} from '../controllers/productController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Rutas administrativas protegidas
router.post('/', authenticateToken, requireAdmin, createProduct);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);
router.post('/categories', authenticateToken, requireAdmin, createCategory);
router.delete('/categories/:id', authenticateToken, requireAdmin, deleteCategory);

export default router;
