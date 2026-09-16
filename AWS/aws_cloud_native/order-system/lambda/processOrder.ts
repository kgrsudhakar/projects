import { SQSHandler } from 'aws-lambda';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

const sfnClient = new SFNClient({});

// SQS delivers "at-least-once", so this handler must be safe to run twice
// for the same message. Starting a Step Functions execution with a
// deterministic name (based on orderId) makes retries idempotent -
// AWS will reject a duplicate execution name instead of starting a second one.
export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    try {
      const order = JSON.parse(record.body);
      const orderId = order.detail?.orderId ?? order.orderId;

      if (!orderId) {
        console.error('Message missing orderId, skipping', record.body);
        continue;
      }

      console.log(`Starting workflow for order ${orderId}`);

      await sfnClient.send(
        new StartExecutionCommand({
          stateMachineArn: process.env.STATE_MACHINE_ARN,
          name: `order-${orderId}`, // deterministic -> idempotent retries
          input: JSON.stringify(order.detail ?? order),
        })
      );
    } catch (err) {
      // Throwing here causes SQS to redeliver the message (up to maxReceiveCount)
      // before it lands in the dead-letter queue for investigation.
      console.error('Failed to process order message', err);
      throw err;
    }
  }
};
