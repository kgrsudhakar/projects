import { Construct } from 'constructs';
import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
} from 'aws-cdk-lib';

import { Table, AttributeType, BillingMode, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';
import { Bucket, BucketEncryption, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Key } from 'aws-cdk-lib/aws-kms';
import { UserPool, UserPoolClient, AccountRecovery } from 'aws-cdk-lib/aws-cognito';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { SqsQueue, SnsTopic } from 'aws-cdk-lib/aws-events-targets';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, Tracing, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource, SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import {
  RestApi,
  LambdaIntegration,
  CognitoUserPoolsAuthorizer,
  AuthorizationType,
} from 'aws-cdk-lib/aws-apigateway';
import {
  StateMachine,
  DefinitionBody,
  Chain,
} from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Alarm, ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';

export class OrderSystemStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ------------------------------------------------------------------
    // STEP 2: DynamoDB table (design around access pattern: get orders
    // for a customer, sorted by creation time)
    // ------------------------------------------------------------------
    const ordersTable = new Table(this, 'OrdersTable', {
      tableName: 'Orders',
      partitionKey: { name: 'orderId', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      pointInTimeRecovery: true,
      removalPolicy: RemovalPolicy.DESTROY, // dev only - use RETAIN in prod
    });

    // ------------------------------------------------------------------
    // STEP 3: S3 bucket for invoices, encrypted with a customer-managed KMS key
    // ------------------------------------------------------------------
    const kmsKey = new Key(this, 'InvoiceKmsKey', {
      enableKeyRotation: true,
      removalPolicy: RemovalPolicy.DESTROY, // dev only
    });

    const invoiceBucket = new Bucket(this, 'InvoiceBucket', {
      encryption: BucketEncryption.KMS,
      encryptionKey: kmsKey,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY, // dev only
      autoDeleteObjects: true,               // dev only
    });

    // ------------------------------------------------------------------
    // STEP 4: Cognito User Pool for authentication
    // ------------------------------------------------------------------
    const userPool = new UserPool(this, 'OrderUserPool', {
      userPoolName: 'order-system-users',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY, // dev only
    });

    const userPoolClient = new UserPoolClient(this, 'OrderUserPoolClient', {
      userPool,
      authFlows: { userPassword: true, userSrp: true },
      generateSecret: false,
    });

    // ------------------------------------------------------------------
    // STEP 7: Event-driven backbone - SQS, SNS, EventBridge
    // ------------------------------------------------------------------
    const orderDlq = new Queue(this, 'OrderDLQ', { queueName: 'order-dlq' });

    const orderQueue = new Queue(this, 'OrderQueue', {
      queueName: 'order-processing-queue',
      visibilityTimeout: Duration.seconds(30),
      deadLetterQueue: { queue: orderDlq, maxReceiveCount: 3 },
    });

    const orderTopic = new Topic(this, 'OrderTopic', {
      topicName: 'order-notifications',
    });

    const orderBus = new EventBus(this, 'OrderEventBus', {
      eventBusName: 'order-event-bus',
    });

    new Rule(this, 'OrderCreatedRule', {
      eventBus: orderBus,
      ruleName: 'order-created-fanout',
      eventPattern: {
        source: ['order.service'],
        detailType: ['OrderCreated'],
      },
      targets: [new SqsQueue(orderQueue), new SnsTopic(orderTopic)],
    });

    // ------------------------------------------------------------------
    // Lambda functions (Step Functions workflow tasks)
    // Defined first so we can reference them in the state machine below.
    // ------------------------------------------------------------------
    const commonEnv = {
      TABLE_NAME: ordersTable.tableName,
      EVENT_BUS_NAME: orderBus.eventBusName,
    };

    const checkInventoryFn = new NodejsFunction(this, 'CheckInventoryFn', {
      entry: 'lambda/checkInventory.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
      environment: commonEnv,
    });

    const chargePaymentFn = new NodejsFunction(this, 'ChargePaymentFn', {
      entry: 'lambda/chargePayment.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
      environment: commonEnv,
    });

    const updateOrderStatusFn = new NodejsFunction(this, 'UpdateOrderStatusFn', {
      entry: 'lambda/updateOrderStatus.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
      environment: commonEnv,
    });
    ordersTable.grantReadWriteData(updateOrderStatusFn);

    // ------------------------------------------------------------------
    // STEP 9: Step Functions - orchestrate the order workflow
    // ------------------------------------------------------------------
    const checkInventoryStep = new LambdaInvoke(this, 'CheckInventoryStep', {
      lambdaFunction: checkInventoryFn,
      outputPath: '$.Payload',
    });

    const chargePaymentStep = new LambdaInvoke(this, 'ChargePaymentStep', {
      lambdaFunction: chargePaymentFn,
      outputPath: '$.Payload',
    });

    const updateOrderStatusStep = new LambdaInvoke(this, 'UpdateOrderStatusStep', {
      lambdaFunction: updateOrderStatusFn,
      outputPath: '$.Payload',
    });

    const definition: Chain = checkInventoryStep
      .next(chargePaymentStep)
      .next(updateOrderStatusStep);

    const orderWorkflow = new StateMachine(this, 'OrderWorkflow', {
      stateMachineName: 'order-processing-workflow',
      definitionBody: DefinitionBody.fromChainable(definition),
      timeout: Duration.minutes(5),
      tracingEnabled: true,
    });

    // ------------------------------------------------------------------
    // Lambda: processOrder - triggered by SQS, starts the Step Functions workflow
    // ------------------------------------------------------------------
    const processOrderFn = new NodejsFunction(this, 'ProcessOrderFn', {
      entry: 'lambda/processOrder.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: Duration.seconds(15),
      tracing: Tracing.ACTIVE,
      environment: {
        ...commonEnv,
        STATE_MACHINE_ARN: orderWorkflow.stateMachineArn,
      },
    });
    orderWorkflow.grantStartExecution(processOrderFn);
    processOrderFn.addEventSource(new SqsEventSource(orderQueue, { batchSize: 5 }));

    // ------------------------------------------------------------------
    // Lambda: notifyUser - triggered by SNS
    // ------------------------------------------------------------------
    const notifyUserFn = new NodejsFunction(this, 'NotifyUserFn', {
      entry: 'lambda/notifyUser.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
    });
    orderTopic.addSubscription(
      new (require('aws-cdk-lib/aws-sns-subscriptions').LambdaSubscription)(notifyUserFn)
    );

    // ------------------------------------------------------------------
    // Lambda: createOrder - triggered by API Gateway
    // ------------------------------------------------------------------
    const createOrderFn = new NodejsFunction(this, 'CreateOrderFn', {
      entry: 'lambda/createOrder.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
      environment: commonEnv,
    });
    ordersTable.grantWriteData(createOrderFn);
    invoiceBucket.grantPut(createOrderFn);
    kmsKey.grantEncrypt(createOrderFn);

    // DynamoDB Streams -> a small Lambda that republishes to EventBridge
    // (keeps createOrder's Lambda fast and decouples "write" from "notify others")
    const streamToEventBridgeFn = new NodejsFunction(this, 'StreamToEventBridgeFn', {
      entry: 'lambda/streamToEventBridge.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      memorySize: 128,
      timeout: Duration.seconds(10),
      tracing: Tracing.ACTIVE,
      environment: { EVENT_BUS_NAME: orderBus.eventBusName },
    });
    orderBus.grantPutEventsTo(streamToEventBridgeFn);
    streamToEventBridgeFn.addEventSource(
      new DynamoEventSource(ordersTable, {
        startingPosition: StartingPosition.LATEST,
        batchSize: 5,
        retryAttempts: 2,
      })
    );

    // ------------------------------------------------------------------
    // STEP 6: API Gateway with Cognito authorizer
    // ------------------------------------------------------------------
    const api = new RestApi(this, 'OrderApi', {
      restApiName: 'order-system-api',
      deployOptions: { tracingEnabled: true, stageName: 'prod' },
    });

    const authorizer = new CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [userPool],
    });

    const orders = api.root.addResource('orders');
    orders.addMethod('POST', new LambdaIntegration(createOrderFn), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer,
    });

    // ------------------------------------------------------------------
    // STEP 11: Monitoring - CloudWatch alarm on the DLQ
    // ------------------------------------------------------------------
    new Alarm(this, 'DLQAlarm', {
      alarmName: 'order-dlq-has-messages',
      metric: orderDlq.metricApproximateNumberOfMessagesVisible(),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: 'Alerts when orders land in the dead-letter queue and need investigation',
    });

    // ------------------------------------------------------------------
    // Outputs - useful for testing with curl/Postman after `cdk deploy`
    // ------------------------------------------------------------------
    new (require('aws-cdk-lib').CfnOutput)(this, 'ApiUrl', { value: api.url });
    new (require('aws-cdk-lib').CfnOutput)(this, 'UserPoolId', { value: userPool.userPoolId });
    new (require('aws-cdk-lib').CfnOutput)(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new (require('aws-cdk-lib').CfnOutput)(this, 'OrdersTableName', { value: ordersTable.tableName });
  }
}
