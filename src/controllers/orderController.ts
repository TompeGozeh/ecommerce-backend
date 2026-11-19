import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { prisma } from '../config/prisma';
import { sendOrderConfirmationEmail } from '../services/mailService';

export const createCheckout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, shippingAddress, phone } = req.body;
    const userId = req.user?.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    let totalAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      totalAmount += Number(product.price) * Number(item.quantity);
      orderItemsData.push({
        productId: product.id,
        quantity: Number(item.quantity),
        price: Number(product.price),
        size: item.size || 'L',
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: userId!,
        totalAmount,
        status: 'PENDING',
        shippingAddress: shippingAddress || '',
        phone: phone || '',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    sendOrderConfirmationEmail(req.user?.email || '', order.id, totalAmount);

    return res.json({ success: true, orderId: order.id, order });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return res.status(500).json({ message: 'Error al procesar el pedido.' });
  }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener compras.' });
  }
};

export const getAllOrdersAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener órdenes administrativas.' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar el estado de la orden.' });
  }
};
