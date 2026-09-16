import {
  PutCommand,
  GetCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

import { dynamoDb } from "../clients/dynamodb.client.js";
import { Order } from "../types/order.js";

const TABLE_NAME = process.env.ORDER_TABLE!;

export class OrderRepository {

  async create(order: Order): Promise<void> {

    await dynamoDb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: order
      })
    );
  }

  async findById(
    orderId: string
  ): Promise<Order | undefined> {

    const result = await dynamoDb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          orderId
        }
      })
    );

    return result.Item as Order | undefined;
  }

  async updateStatus(
    orderId: string,
    status: Order["status"]
  ): Promise<void> {

    await dynamoDb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          orderId
        },
        UpdateExpression:
          "SET #status = :status",
        ExpressionAttributeNames: {
          "#status": "status"
        },
        ExpressionAttributeValues: {
          ":status": status
        }
      })
    );
  }
}