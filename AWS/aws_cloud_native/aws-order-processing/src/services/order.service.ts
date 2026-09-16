import { v4 as uuid } from "uuid";

import {
  CreateOrderRequest,
  Order
} from "../types/order.js";

import {
  OrderRepository
} from "../repositories/order.repository.js";

import {
  eventBridgeClient
} from "../clients/eventbridge.client.js";

import {
  PutEventsCommand
} from "@aws-sdk/client-eventbridge";

export class OrderService {

  private repository =
    new OrderRepository();

  async createOrder(
    request: CreateOrderRequest
  ): Promise<Order> {

    const totalAmount =
      request.items.reduce(
        (total, item) =>
          total +
          item.quantity * item.price,
        0
      );

    const order: Order = {
      orderId: uuid(),
      customerId: request.customerId,
      items: request.items,
      totalAmount,
      status: "CREATED",
      createdAt:
        new Date().toISOString()
    };

    await this.repository.create(order);

    await eventBridgeClient.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "order.service",
            DetailType: "OrderCreated",
            EventBusName: process.env.EVENT_BUS_NAME,
            Detail: JSON.stringify(order)
          }
        ]
      })
    );

    return order;
  }

  async getOrder(
    orderId: string
  ): Promise<Order | undefined> {

    return this.repository.findById(
      orderId
    );
  }

  async processOrder(
    orderId: string
  ): Promise<void> {

    await this.repository.updateStatus(
      orderId,
      "PROCESSING"
    );

    /*
      Business Logic

      Payment
      Inventory
      Notification
    */

    await this.repository.updateStatus(
      orderId,
      "COMPLETED"
    );
  }
}