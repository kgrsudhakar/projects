import { productRepository } from "../repositories/product.repository.js";
import { AppError } from "../utils/AppError.js";

/**
 * SERVICE LAYER
 * -------------
 * This is where BUSINESS LOGIC lives - validation of business rules
 * (not input shape, that's the validator's job), orchestration between
 * repositories, and anything that isn't "talk HTTP" or "talk storage".
 *
 * Controllers should stay thin and just call these methods.
 * This layer is also what other services (like order-service) would
 * call directly if it were imported as a package, OR what a GraphQL
 * resolver calls later - meaning we write this logic ONCE and reuse
 * it across REST and GraphQL.
 */
class ProductService {
  async listProducts(filters) {
    return productRepository.findAll(filters);
  }

  async getProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) throw AppError.notFound(`Product ${id} not found`);
    return product;
  }

  async createProduct(data) {
    if (data.price <= 0) {
      throw AppError.badRequest("Price must be greater than 0");
    }
    return productRepository.create(data);
  }

  async updateProduct(id, data) {
    const updated = await productRepository.update(id, data);
    if (!updated) throw AppError.notFound(`Product ${id} not found`);
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productRepository.delete(id);
    if (!deleted) throw AppError.notFound(`Product ${id} not found`);
    return { deleted: true };
  }

  /**
   * Used later by order-service (via HTTP call) when an order is placed.
   * Business rule: never allow stock to go negative.
   */
  async reserveStock(id, quantity) {
    const result = await productRepository.decrementStock(id, quantity);
    if (!result) throw AppError.notFound(`Product ${id} not found`);
    if (result.insufficientStock) {
      throw AppError.conflict(
        `Insufficient stock for product ${id}: requested ${quantity}, available ${result.product.stock}`
      );
    }
    return result.product;
  }
}

export const productService = new ProductService();
