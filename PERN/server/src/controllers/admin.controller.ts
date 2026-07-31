import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { orderRepository } from '../repositories/order.repository';
import { productService, categoryService } from '../services/product.service';
import prisma from '../config/prisma';

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
    });

    res.json({
      userCount,
      productCount,
      orderCount,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await userRepository.update(id, { role });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderRepository.updateStatus(id, status);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
