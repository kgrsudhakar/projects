import * as cdk from "aws-cdk-lib";

import {
  Stack,
  StackProps
} from "aws-cdk-lib";

import {
  Construct
} from "constructs";

import * as lambda from
  "aws-cdk-lib/aws-lambda";

import * as apigateway from
  "aws-cdk-lib/aws-apigateway";

import * as dynamodb from
  "aws-cdk-lib/aws-dynamodb";

import * as sqs from
  "aws-cdk-lib/aws-sqs";

import * as eventbridge from
  "aws-cdk-lib/aws-events";

import * as targets from
  "aws-cdk-lib/aws-events-targets";

import * as lambdaEventSources from
  "aws-cdk-lib/aws-lambda-event-sources";

import * as s3 from
  "aws-cdk-lib/aws-s3";

export class OrderStack
  extends Stack {

  constructor(
    scope: Construct,
    id: string,
    props?: StackProps
  ) {

    super(
      scope,
      id,
      props
    );

    /*
     * DynamoDB
     */

    const orderTable =
      new dynamodb.Table(
        this,
        "Orders",
        {
          partitionKey: {
            name: "orderId",
            type:
              dynamodb.AttributeType.STRING
          },

          billingMode:
            dynamodb.BillingMode
              .PAY_PER_REQUEST
        }
      );

    /*
     * S3
     */

    const bucket =
      new s3.Bucket(
        this,
        "OrderFiles"
      );

    /*
     * SQS
     */

    const queue =
      new sqs.Queue(
        this,
        "OrderProcessingQueue"
      );

    /*
     * EventBridge
     */

    const eventBus =
      new eventbridge.EventBus(
        this,
        "OrderEventBus"
      );

    /*
     * Create Order Lambda
     */

    const createOrderLambda =
      new lambda.Function(
        this,
        "CreateOrderLambda",
        {
          runtime:
            lambda.Runtime.NODEJS_22_X,

          handler:
            "createOrder.handler",

          code:
            lambda.Code.fromAsset(
              "dist/src/handlers"
            ),

          environment: {
            ORDER_TABLE:
              orderTable.tableName,

            EVENT_BUS_NAME:
              eventBus.eventBusName
          }
        }
      );

    /*
     * Permissions
     */

    orderTable.grantReadWriteData(
      createOrderLambda
    );

    eventBus.grantPutEventsTo(
      createOrderLambda
    );

    /*
     * API Gateway
     */

    const api =
      new apigateway.RestApi(
        this,
        "OrderApi"
      );

    const orders =
      api.root.addResource(
        "orders"
      );

    orders.addMethod(
      "POST",
      new apigateway.LambdaIntegration(
        createOrderLambda
      )
    );

    /*
     * EventBridge -> SQS
     */

    new eventbridge.Rule(
      this,
      "OrderCreatedRule",
      {
        eventBus,

        eventPattern: {
          source: [
            "order.service"
          ],

          detailType: [
            "OrderCreated"
          ]
        },

        targets: [
          new targets.SqsQueue(
            queue
          )
        ]
      }
    );

    /*
     * Worker Lambda
     */

    const processOrderLambda =
      new lambda.Function(
        this,
        "ProcessOrderLambda",
        {
          runtime:
            lambda.Runtime.NODEJS_22_X,

          handler:
            "processOrder.handler",

          code:
            lambda.Code.fromAsset(
              "dist/src/handlers"
            ),

          environment: {
            ORDER_TABLE:
              orderTable.tableName
          }
        }
      );

    orderTable.grantReadWriteData(
      processOrderLambda
    );

    processOrderLambda.addEventSource(
      new lambdaEventSources
        .SqsEventSource(queue)
    );
  }
}

const app = new cdk.App();

new OrderStack(
  app,
  "OrderProcessingStack"
);