export function createOrder({ id, userId, items, total }) {
  return {
    id,
    userId,
    items, // [{ productId, title, quantity, unitPrice }]
    total,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
}
