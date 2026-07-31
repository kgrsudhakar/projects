import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { productId, quantity = 1 } = req.body;
    const item = await cartService.addToCart(userId, productId, quantity);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.params;
    const { quantity } = req.body;
    const item = await cartService.updateCartItem(userId, productId, quantity);
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.params;
    await cartService.removeFromCart(userId, productId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    await cartService.clearCart(userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
