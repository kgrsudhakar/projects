# Serverless Order Processing System

A working AWS CDK (TypeScript) project demonstrating: Lambda, API Gateway, Step Functions,
SQS, SNS, EventBridge, DynamoDB (+ Streams), S3, Cognito, IAM least-privilege, KMS,
CloudWatch alarms, X-Ray tracing, and a GitHub Actions CI/CD pipeline.

## Architecture

```
Client -> Cognito Auth -> API Gateway -> Lambda(createOrder) -> DynamoDB
                                                                    |
                                                          (DynamoDB Streams)
                                                                    v
                                                    Lambda(streamToEventBridge)
                                                                    v
                                                            EventBridge Bus
                                                          /                \
                                                    SQS Queue          SNS Topic
                                                         v                  v
                                              Lambda(processOrder)   Lambda(notifyUser)
                                                         v
                                              Step Functions Workflow
                                              CheckInventory -> ChargePayment -> UpdateOrderStatus
```

## Prerequisites

- Node.js 20+
- An AWS account + credentials configured (`aws configure`)
- AWS CDK CLI: `npm install -g aws-cdk` (or just use `npx cdk`)

## Setup

```bash
npm install

# One-time per AWS account/region (only needed the first time you use CDK there)
npx cdk bootstrap
```

## Run tests

```bash
npm test
```

## Deploy

```bash
npm run build
npx cdk synth      # (optional) preview the generated CloudFormation
npx cdk deploy
```

After deploy, CDK prints outputs including:
- `ApiUrl` — your API Gateway base URL
- `UserPoolId` / `UserPoolClientId` — for creating a Cognito test user
- `OrdersTableName` — the DynamoDB table name

## Try it out

### 1. Create a Cognito test user

```bash
aws cognito-idp sign-up \
  --client-id <UserPoolClientId> \
  --username test@example.com \
  --password "TestPass123!"

aws cognito-idp admin-confirm-sign-up \
  --user-pool-id <UserPoolId> \
  --username test@example.com
```

### 2. Get an auth token

```bash
aws cognito-idp initiate-auth \
  --client-id <UserPoolClientId> \
  --auth-flow USER_PASSWORD_AUTH \
  --auth-parameters USERNAME=test@example.com,PASSWORD="TestPass123!"
```

Copy the `IdToken` from the response.

### 3. Create an order

```bash
curl -X POST <ApiUrl>orders \
  -H "Authorization: <IdToken>" \
  -H "Content-Type: application/json" \
  -d '{"customerId":"cust-1","items":[{"productId":"p-1","qty":2}]}'
```

### 4. Watch it flow through the system

- **CloudWatch Logs** for each Lambda (`createOrder`, `streamToEventBridge`, `processOrder`,
  `notifyUser`, the three Step Functions task Lambdas)
- **Step Functions console** — see the `order-processing-workflow` execution graph light up
- **DynamoDB console** — the order's `status` field moves from `PENDING` -> `COMPLETED`

## Clean up

```bash
npx cdk destroy
```

## Project structure

```
order-system/
├── bin/order-system.ts          # CDK app entry point
├── lib/order-system-stack.ts    # all infrastructure (the whole architecture lives here)
├── lambda/
│   ├── createOrder.ts           # API Gateway -> writes to DynamoDB
│   ├── streamToEventBridge.ts   # DynamoDB Streams -> EventBridge
│   ├── processOrder.ts          # SQS -> starts Step Functions execution
│   ├── notifyUser.ts            # SNS -> notification stub
│   ├── checkInventory.ts        # Step Functions task 1
│   ├── chargePayment.ts         # Step Functions task 2
│   └── updateOrderStatus.ts     # Step Functions task 3
├── test/createOrder.test.ts     # sample Jest unit test
├── .github/workflows/deploy.yml # CI/CD pipeline (build, test, deploy via OIDC)
├── cdk.json
├── tsconfig.json
└── package.json
```

## Notes on production-readiness

This is an interview/learning reference, not a production system as-is. Before shipping:

- Switch `RemovalPolicy.DESTROY` / `autoDeleteObjects: true` to `RETAIN` for prod data stores
- Add idempotency checks (e.g., a `processedOrderIds` table) in `processOrder.ts`
- Add real payment-provider and inventory-service integration (currently simulated)
- Add per-environment config (dev/staging/prod) and deploy the stack into separate AWS accounts
- Add MFA on the Cognito User Pool
- Add API Gateway request validation/throttling and WAF if public-facing
