import { AppError } from "../utils/AppError.js";

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:4001";
const TIMEOUT_MS = 3000;

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    throw AppError.upstreamUnavailable(
      "product-service",
      `Could not reach product-service: ${err.message}`
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const productServiceClient = {
  async getProductById(productId) {
    const response = await fetchWithTimeout(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);

    if (response.status === 404) {
      throw AppError.badRequest(`Product ${productId} does not exist`);
    }
    if (!response.ok) {
      throw AppError.upstreamUnavailable(
        "product-service",
        `product-service returned unexpected status ${response.status}`
      );
    }
    const body = await response.json();
    return body.data;
  },

  /**
   * Calls product-service's internal reserve-stock endpoint. This is
   * a WRITE across service boundaries - the riskiest kind of call,
   * because if order-service crashes right after this succeeds but
   * before the order is saved, stock is decremented with no order to
   * show for it. (This exact problem is why Day 4 introduces async
   * events/sagas instead of direct synchronous writes like this one.)
   */
  async reserveStock(productId, quantity) {
    const response = await fetchWithTimeout(
      `${PRODUCT_SERVICE_URL}/api/products/${productId}/reserve-stock`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      }
    );

    if (response.status === 409) {
      const body = await response.json();
      throw AppError.conflict(body.error?.message || `Insufficient stock for ${productId}`);
    }
    if (response.status === 404) {
      throw AppError.badRequest(`Product ${productId} does not exist`);
    }
    if (!response.ok) {
      throw AppError.upstreamUnavailable(
        "product-service",
        `product-service returned unexpected status ${response.status}`
      );
    }
    const body = await response.json();
    return body.data;
  },

  /**
   * Compensating action - puts stock back after a reservation needs
   * to be undone (see order.service.js #compensate()).
   */
  async releaseStock(productId, quantity) {
    const response = await fetchWithTimeout(
      `${PRODUCT_SERVICE_URL}/api/products/${productId}/release-stock`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      }
    );
    if (!response.ok) {
      throw AppError.upstreamUnavailable(
        "product-service",
        `product-service returned unexpected status ${response.status} while releasing stock`
      );
    }
    const body = await response.json();
    return body.data;
  },
};
