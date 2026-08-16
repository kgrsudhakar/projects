import { randomUUID } from "node:crypto";
import { createUser } from "../models/user.model.js";

/**
 * Same repository pattern as product-service: an in-memory Map today,
 * swappable for a real DB later without touching the service layer.
 */
class UserRepository {
  #store = new Map();
  #emailIndex = new Map(); // email -> id, so we can check uniqueness fast

  async findAll() {
    return [...this.#store.values()];
  }

  async findById(id) {
    return this.#store.get(id) ?? null;
  }

  async findByEmail(email) {
    const id = this.#emailIndex.get(email);
    return id ? this.#store.get(id) : null;
  }

  async create({ name, email, passwordHash, salt }) {
    const id = randomUUID();
    const user = createUser({ id, name, email, passwordHash, salt });
    this.#store.set(id, user);
    this.#emailIndex.set(email, id);
    return user;
  }
}

export const userRepository = new UserRepository();
