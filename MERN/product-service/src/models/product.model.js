/**
 * Product "model" - just the shape of our data.
 * In a real DB-backed service this might be a Mongoose schema,
 * a Prisma model, or a plain TS interface. Keeping it as a factory
 * function here so the repository stays swappable.
 */
export function createProduct({ id, title, description, price, stock, category }) {
  return {
    id,
    title,
    description: description ?? "",
    price,
    stock,
    category: category ?? "uncategorized",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
