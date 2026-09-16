interface OrderItem {
  productId: string;
  qty: number;
}

interface WorkflowInput {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  [key: string]: unknown;
}

// A Step Functions task Lambda: receives the state's input, returns the
// output that becomes the input to the NEXT state in the chain.
export const handler = async (input: WorkflowInput) => {
  console.log(`Checking inventory for order ${input.orderId}`);

  // Simulated inventory check - in reality this would query DynamoDB/RDS.
  const allInStock = input.items.every((item) => item.qty <= 100);

  if (!allInStock) {
    throw new Error(`Insufficient inventory for order ${input.orderId}`);
  }

  return {
    ...input,
    inventoryChecked: true,
  };
};
