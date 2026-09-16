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

      if (!event.body) {
        return error(
          "Request body is required",
          400
        );
      }

      const request =
        JSON.parse(event.body);

      const order =
        await orderService.createOrder(
          request
        );

      return success(
        order,
        201
      );

    } catch (err) {

      console.error(
        "Create order failed",
        err
      );

      return error(
        "Unable to create order",
        500
      );
    }
  };