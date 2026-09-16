import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

// Client is created OUTSIDE the handler so it's reused across warm invocations
// (avoids re-establishing a connection on every single request).
const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface OrderItem {
  productId: string;
  qty: number;
}

interface OrderRequest {
  customerId: string;
  items: OrderItem[];
}

interface Order {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

function jsonResponse(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return jsonResponse(400, { error: 'Request body is required' });
    }

    const request: OrderRequest = JSON.parse(event.body);

    if (!request.customerId || !Array.isArray(request.items) || request.items.length === 0) {
      return jsonResponse(400, { error: 'customerId and a non-empty items array are required' });
    }

    for (const item of request.items) {
      if (!item.productId || typeof item.qty !== 'number' || item.qty <= 0) {
        return jsonResponse(400, { error: 'Each item needs a productId and a positive qty' });
      }
    }

    const order: Order = {
      orderId: randomUUID(),
      customerId: request.customerId,
      items: request.items,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    await ddbClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: order,
      })
    );

    console.log(`Order created: ${order.orderId} for customer ${order.customerId}`);

    return jsonResponse(201, order);
  } catch (err) {
    console.error('createOrder failed', err);
    return jsonResponse(500, { error: 'Internal server error' });
  }
};
