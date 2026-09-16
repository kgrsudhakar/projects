interface WorkflowInput {
  orderId: string;
  customerId: string;
  inventoryChecked?: boolean;
  [key: string]: unknown;
}

export const handler = async (input: WorkflowInput) => {
  console.log(`Charging payment for order ${input.orderId}`);

  // Simulated payment charge - in reality this would call Stripe/a payment
  // processor, ideally with an idempotency key equal to the orderId so a
  // Step Functions retry doesn't double-charge the customer.
  const paymentSucceeded = true;

  if (!paymentSucceeded) {
    throw new Error(`Payment failed for order ${input.orderId}`);
  }

  return {
    ...input,
    paymentCharged: true,
  };
};
