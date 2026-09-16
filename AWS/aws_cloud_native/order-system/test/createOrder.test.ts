import { APIGatewayProxyEvent } from 'aws-lambda';

// Mock the DynamoDB client BEFORE importing the handler
jest.mock('@aws-sdk/lib-dynamodb', () => {
  const actual = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...actual,
    DynamoDBDocumentClient: {
      from: () => ({ send: jest.fn().mockResolvedValue({}) }),
    },
  };
});

import { handler } from '../lambda/createOrder';

function buildEvent(body: unknown): APIGatewayProxyEvent {
  return {
    body: JSON.stringify(body),
  } as unknown as APIGatewayProxyEvent;
}

describe('createOrder Lambda', () => {
  it('returns 400 when body is missing', async () => {
    const result: any = await handler({} as any, {} as any, {} as any);
    expect(result.statusCode).toBe(400);
  });

  it('returns 400 when items array is empty', async () => {
    const event = buildEvent({ customerId: 'cust-1', items: [] });
    const result: any = await handler(event, {} as any, {} as any);
    expect(result.statusCode).toBe(400);
  });

  it('returns 400 when an item has an invalid qty', async () => {
    const event = buildEvent({
      customerId: 'cust-1',
      items: [{ productId: 'p-1', qty: 0 }],
    });
    const result: any = await handler(event, {} as any, {} as any);
    expect(result.statusCode).toBe(400);
  });

  it('creates an order successfully with valid input', async () => {
    const event = buildEvent({
      customerId: 'cust-1',
      items: [{ productId: 'p-1', qty: 2 }],
    });
    const result: any = await handler(event, {} as any, {} as any);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(201);
    expect(body.customerId).toBe('cust-1');
    expect(body.status).toBe('PENDING');
    expect(body.orderId).toBeDefined();
  });
});
