import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { AuthRequest } from '../middleware/auth';

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }
    const result = await orderService.checkout(userId, shippingAddress);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const orders = await orderService.getOrdersByUser(userId);
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
