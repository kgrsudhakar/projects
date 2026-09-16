import { SNSHandler } from 'aws-lambda';

// In a real system this would call SES (email), SNS mobile push, or a
// third-party provider like Twilio. Kept simple here so the flow is easy
// to trace end-to-end.
export const handler: SNSHandler = async (event) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message);
    const orderId = message.detail?.orderId ?? message.orderId;
    console.log(`Notifying customer about order ${orderId}`);
    // e.g. await sesClient.send(new SendEmailCommand({...}))
  }
};
