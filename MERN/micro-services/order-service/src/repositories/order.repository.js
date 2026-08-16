import { randomUUID } from "node:crypto";
import { createOrder } from "../models/order.model.js";

class OrderRepository {
  #store = new Map();

  async create({ userId, items, total }) {
    const id = randomUUID();
    const order = createOrder({ id, userId, items, total });
    this.#store.set(id, order);
    return order;
  }

  async findById(id) {
    return this.#store.get(id) ?? null;
  }

  async findByUserId(userId) {
    return [...this.#store.values()].filter((o) => o.userId === userId);
  }

  async findAll() {
    return [...this.#store.values()];
  }
}

export const orderRepository = new OrderRepository();
