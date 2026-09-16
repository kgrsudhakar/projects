I designed a cloud-native Order Processing application using Node.js and TypeScript with AWS serverless services.

The application exposes REST APIs through API Gateway. API Gateway invokes Node.js Lambda functions where the business logic is implemented using a layered architecture consisting of handlers, services, repositories, and AWS client modules.

When an order is created, the Create Order Lambda validates the request, calculates the order total, and stores the order in DynamoDB.

After successfully creating the order, the application publishes an OrderCreated event to EventBridge. EventBridge routes the event to an SQS queue.

A separate Node.js Lambda function consumes messages from SQS and processes the order asynchronously. This decouples order creation from downstream processing and improves scalability and reliability.

The worker Lambda updates the order status in DynamoDB. Failed messages can be handled using retry policies and a Dead Letter Queue.

For file uploads, the backend generates S3 pre-signed URLs so clients can upload files directly to S3 without routing large files through the backend.

Security is implemented using IAM execution roles with least privilege permissions. Lambda functions receive only the required permissions to access DynamoDB, EventBridge, SQS, and S3.

Infrastructure is defined using AWS CDK and TypeScript, making the infrastructure version controlled and repeatable. CloudWatch is used for application logs and monitoring.

This architecture is serverless, event-driven, scalable, and suitable for cloud-native applications.
