import { DynamoDBStreamHandler } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const eventBridge = new EventBridgeClient({});

// Fires whenever a new item is written to the Orders table.
// Republishes it as a clean domain event on the EventBridge bus so that
// SQS/SNS consumers don't need to know anything about DynamoDB Streams format.
export const handler: DynamoDBStreamHandler = async (event) => {
  const entries = event.Records.filter((r) => r.eventName === 'INSERT' && r.dynamodb?.NewImage).map(
    (r) => {
      const order = unmarshall(r.dynamodb!.NewImage as any);
      return {
        Source: 'order.service',
        DetailType: 'OrderCreated',
        Detail: JSON.stringify(order),
        EventBusName: process.env.EVENT_BUS_NAME,
      };
    }
  );

  if (entries.length === 0) {
    return;
  }

  await eventBridge.send(new PutEventsCommand({ Entries: entries }));
  console.log(`Published ${entries.length} OrderCreated event(s) to EventBridge`);
};
