import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface WorkflowInput {
  orderId: string;
  createdAt: string;
  paymentCharged?: boolean;
  [key: string]: unknown;
}

// Final step of the workflow: persists the outcome back to DynamoDB.
export const handler = async (input: WorkflowInput) => {
  console.log(`Updating status for order ${input.orderId}`);

  const status = input.paymentCharged ? 'COMPLETED' : 'FAILED';

  await ddbClient.send(
    new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { orderId: input.orderId, createdAt: input.createdAt },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': status },
    })
  );

  return { ...input, status };
};
