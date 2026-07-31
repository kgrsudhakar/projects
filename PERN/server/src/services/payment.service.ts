import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2024-10-28', // Use the latest API version
});

export const paymentService = {
  async createPaymentIntent(amount: number, currency = 'usd') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      automatic_payment_methods: { enabled: true },
    });
    return paymentIntent;
  },
  async confirmPayment(paymentIntentId: string) {
    // In a real scenario, you'd use a webhook to confirm payment.
    // For a simple API, we can just fetch the payment intent status.
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  },
};
