import { randomUUID } from "node:crypto";
import { createProduct } from "../models/product.model.js";

/**
 * REPOSITORY PATTERN
 * ------------------
 * This class is the ONLY place in the app that knows how products are
 * actually stored. Right now it's an in-memory array. Later you could
 * swap this for a Postgres/Mongo implementation and NOTHING in
 * services/controllers/routes would need to change, as long as the
 * method signatures below stay the same.
 *
 * That's the whole point: business logic (service layer) depends on
 * this interface, not on a specific database.
 */
class ProductRepository {
  #store = new Map();

  constructor() {
    // seed with a couple of products so the API is useful immediately
    this.#seed();
  }

  #seed() {
    const seedProducts = [
      { title: "Mechanical Keyboard", description: "Hot-swappable, brown switches", price: 89.99, stock: 42, category: "electronics" },
      { title: "Standing Desk", description: "Electric height adjustable", price: 349.0, stock: 15, category: "furniture" },
      { title: "Wireless Mouse", description: "2.4GHz, ergonomic", price: 24.5, stock: 120, category: "electronics" },
    ];
    for (const p of seedProducts) {
      const id = randomUUID();
      this.#store.set(id, createProduct({ id, ...p }));
    }
  }

  async findAll({ category } = {}) {
    const all = [...this.#store.values()];
    if (category) return all.filter((p) => p.category === category);
    return all;
  }

  async findById(id) {
    return this.#store.get(id) ?? null;
  }

  async create(data) {
    const id = randomUUID();
    const product = createProduct({ id, ...data });
    this.#store.set(id, product);
    return product;
  }

  async update(id, data) {
    const existing = this.#store.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, id, updatedAt: new Date().toISOString() };
    this.#store.set(id, updated);
    return updated;
  }

  async delete(id) {
    return this.#store.delete(id);
  }

  async incrementStock(id, quantity) {
    const existing = this.#store.get(id);
    if (!existing) return null;
    existing.stock += quantity;
    existing.updatedAt = new Date().toISOString();
    this.#store.set(id, existing);
    return existing;
  }

  async decrementStock(id, quantity) {
    const existing = this.#store.get(id);
    if (!existing) return null;
    if (existing.stock < quantity) return { insufficientStock: true, product: existing };
    existing.stock -= quantity;
    existing.updatedAt = new Date().toISOString();
    this.#store.set(id, existing);
    return { product: existing };
  }
}

// Exported as a singleton - in a bigger app you might use a DI container
// instead of a singleton, so it can be mocked more easily in tests.
export const productRepository = new ProductRepository();
