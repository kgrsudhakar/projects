import prisma from '../config/prisma';

export const cartRepository = {
  async getCartByUserId(userId: string) {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
  },
  async addItem(userId: string, productId: string, quantity: number) {
    return await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, quantity },
    });
  },
  async updateQuantity(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      return await prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
      });
    }
    return await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
    });
  },
  async removeItem(userId: string, productId: string) {
    return await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  },
  async clearCart(userId: string) {
    return await prisma.cartItem.deleteMany({
      where: { userId },
    });
  },
};
