import { orderRepository } from '../repositories/order.repository';
import { cartRepository } from '../repositories/cart.repository';
import { paymentService } from './payment.service';

export const orderService = {
  async checkout(userId: string, shippingAddress: string) {
    const cartItems = await cartRepository.getCartByUserId(userId);
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    // 1. Create Stripe Payment Intent
    const paymentIntent = await paymentService.createPaymentIntent(totalAmount);

    // 2. Create Order in database
    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await orderRepository.create({
      userId,
      totalAmount,
      shippingAddress,
      stripePaymentId: paymentIntent.id,
      items: orderItems,
    });

    // 3. (Optional) Reduce stock for all items
    // In a real app, you'd do this in a transaction.

    // 4. Clear the cart
    await cartRepository.clearCart(userId);

    return { order, paymentIntent };
  },

  async getOrdersByUser(userId: string) {
    return await orderRepository.findByUserId(userId);
  },

  async getOrderById(id: string) {
    return await orderRepository.findById(id);
  },
};
