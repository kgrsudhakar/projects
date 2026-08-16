import { orderRepository } from "../repositories/order.repository.js";
import { userServiceClient } from "../clients/userServiceClient.js";
import { productServiceClient } from "../clients/productServiceClient.js";
import { AppError } from "../utils/AppError.js";

/**
 * ORCHESTRATION LAYER
 * --------------------
 * This is the core of "microservices are harder than a monolith."
 * Placing an order requires data AND a write from two other services.
 * In a monolith this would be a single DB transaction. Across
 * services, we don't get that for free - so this method is doing
 * manual orchestration:
 *
 *   1. Verify the user exists (read from user-service)
 *   2. For each item: fetch product details, then reserve stock
 *      (read + write to product-service)
 *   3. Compute total ourselves, save the order locally
 *
 * KNOWN FLAW (intentional, for learning): if reserving stock for
 * item #2 fails after item #1 already succeeded, item #1's stock
 * stays decremented even though no order gets created - a partial
 * failure leaving the system inconsistent. Fixing this properly
 * needs either a saga (compensating transactions) or an event-driven
 * flow instead of these direct synchronous calls - that's exactly
 * what Day 3 (circuit breakers/retries) and Day 4 (async events)
 * exist to address. For now, we at least attempt a best-effort
 * rollback so you can see the shape of the problem.
 */
class OrderService {
  async placeOrder({ userId, items }) {
    // Step 1: verify the user exists. Fail fast before touching
    // product-service at all if the user is invalid.
    await userServiceClient.getUserById(userId);

    const reservedItems = []; // track what succeeded, for rollback on failure
    const orderItems = [];
    let total = 0;

    try {
      for (const { productId, quantity } of items) {
        // Read product details (price, title) first
        const product = await productServiceClient.getProductById(productId);

        // Then attempt to reserve stock (this is the risky write)
        await productServiceClient.reserveStock(productId, quantity);
        reservedItems.push({ productId, quantity });

        orderItems.push({
          productId,
          title: product.title,
          quantity,
          unitPrice: product.price,
        });
        total += product.price * quantity;
      }
    } catch (err) {
      // Best-effort compensation: put back stock we already reserved.
      // Note this is NOT atomic and can itself fail - a real saga
      // pattern (Day 4) handles this far more robustly.
      await this.#compensate(reservedItems);
      throw err;
    }

    const order = await orderRepository.create({
      userId,
      items: orderItems,
      total: Math.round(total * 100) / 100,
    });

    return order;
  }

  async #compensate(reservedItems) {
    for (const { productId, quantity } of reservedItems) {
      try {
        await productServiceClient.releaseStock(productId, quantity);
      } catch {
        // If compensation itself fails, this is now a data
        // inconsistency that needs manual/alerting-based recovery -
        // exactly the kind of failure mode async event sourcing
        // avoids by design.
      }
    }
  }

  async getOrder(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw AppError.notFound(`Order ${id} not found`);
    return order;
  }

  async listOrdersForUser(userId) {
    return orderRepository.findByUserId(userId);
  }

  async listAllOrders() {
    return orderRepository.findAll();
  }
}

export const orderService = new OrderService();
