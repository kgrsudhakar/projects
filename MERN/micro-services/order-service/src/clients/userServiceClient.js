import { AppError } from "../utils/AppError.js";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:4002";
const TIMEOUT_MS = 3000;

/**
 * SERVICE CLIENT PATTERN
 * ----------------------
 * This is the ONLY place in order-service that knows user-service's
 * base URL or HTTP shape. If user-service's API changes, you fix it
 * here, not scattered across the codebase. This is also the natural
 * place to later add: retries, circuit breakers, request tracing
 * headers (Day 3), or swap HTTP for gRPC/message-queue calls entirely.
 *
 * Notice the pattern of translating network failures into our own
 * AppError types - the order.service.js caller doesn't need to know
 * or care whether the failure was a timeout, a 404, or a crash.
 */
export const userServiceClient = {
  async getUserById(userId) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response;
    try {
      response = await fetch(`${USER_SERVICE_URL}/api/users/${userId}`, {
        signal: controller.signal,
      });
    } catch (err) {
      // Network error, DNS failure, or timeout (AbortError) all land here
      throw AppError.upstreamUnavailable(
        "user-service",
        `Could not reach user-service: ${err.message}`
      );
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 404) {
      throw AppError.badRequest(`User ${userId} does not exist`);
    }
    if (!response.ok) {
      throw AppError.upstreamUnavailable(
        "user-service",
        `user-service returned unexpected status ${response.status}`
      );
    }

    const body = await response.json();
    return body.data;
  },
};
