import { cartRepository } from '../repositories/cart.repository';

export const cartService = {
  async getCart(userId: string) {
    return await cartRepository.getCartByUserId(userId);
  },
  async addToCart(userId: string, productId: string, quantity: number) {
    return await cartRepository.addItem(userId, productId, quantity);
  },
  async updateCartItem(userId: string, productId: string, quantity: number) {
    return await cartRepository.updateQuantity(userId, productId, quantity);
  },
  async removeFromCart(userId: string, productId: string) {
    return await cartRepository.removeItem(userId, productId);
  },
  async clearCart(userId: string) {
    return await cartRepository.clearCart(userId);
  },
};
