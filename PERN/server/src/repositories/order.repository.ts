import prisma from '../config/prisma';

export const orderRepository = {
  async create(data: {
    userId: string;
    totalAmount: number;
    shippingAddress: string;
    stripePaymentId?: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    return await prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        stripePaymentId: data.stripePaymentId,
        items: {
          create: data.items,
        },
      },
      include: { items: true },
    });
  },
  async findByUserId(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  async findById(id: string) {
    return await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  },
  async updateStatus(id: string, status: any) {
    return await prisma.order.update({
      where: { id },
      data: { status },
    });
  },
};
