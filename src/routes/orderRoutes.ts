import { Router } from 'express';
import {
  createCheckout,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.post('/checkout', createCheckout);
router.get('/my-orders', getMyOrders);

// Rutas de administración de órdenes
router.get('/', requireAdmin, getAllOrdersAdmin);
router.get('/admin', requireAdmin, getAllOrdersAdmin);
router.patch('/:id/status', requireAdmin, updateOrderStatus);
router.patch('/admin/:id/status', requireAdmin, updateOrderStatus);

export default router;
