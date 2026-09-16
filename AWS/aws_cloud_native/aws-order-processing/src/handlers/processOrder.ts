import {
  SQSHandler
} from "aws-lambda";

import {
  OrderService
} from "../services/order.service.js";

const orderService =
  new OrderService();

export const handler:
  SQSHandler =
  async (event) => {

    for (
      const record of event.Records
    ) {

      try {

        const eventBridgeEvent =
          JSON.parse(record.body);

        const detail =
          JSON.parse(
            eventBridgeEvent.detail
          );

        const orderId =
          detail.orderId;

        console.log(
          "Processing order:",
          orderId
        );

        await orderService.processOrder(
          orderId
        );

      } catch (error) {

        console.error(
          "Order processing failed",
          error
        );

        throw error;
      }
    }
  };