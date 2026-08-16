import { z } from "zod";

/**
 * VALIDATION LAYER
 * ----------------
 * This checks the SHAPE of incoming data (types, required fields,
 * ranges). This is different from business rules in the service layer
 * (e.g. "price > 0" for money logic could live here too, but rules
 * that depend on OTHER data, like stock levels, belong in the service).
 */
export const createProductSchema = z.object({
  title: z.string().min(1, "title is required").max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive("price must be positive"),
  stock: z.number().int().nonnegative("stock cannot be negative"),
  category: z.string().min(1).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const reserveStockSchema = z.object({
  quantity: z.number().int().positive(),
});
