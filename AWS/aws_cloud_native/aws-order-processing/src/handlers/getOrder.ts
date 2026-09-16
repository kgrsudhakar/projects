import {
  APIGatewayProxyHandler
} from "aws-lambda";

import {
  OrderService
} from "../services/order.service.js";

import {
  success,
  error
} from "../utils/response.js";

const orderService =
  new OrderService();

export const handler:
  APIGatewayProxyHandler =
  async (event) => {

    try {

      const orderId =
        event.pathParameters?.orderId;

      if (!orderId) {
        return error(
          "Order ID is required",
          400
        );
      }

      const order =
        await orderService.getOrder(
          orderId
        );

      if (!order) {
        return error(
          "Order not found",
          404
        );
      }

      return success(order);

    } catch (err) {

      console.error(
        "Get order failed",
        err
      );

      return error(
        "Unable to get order",
        500
      );
    }
  };