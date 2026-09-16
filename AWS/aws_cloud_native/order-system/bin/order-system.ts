#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OrderSystemStack } from '../lib/order-system-stack';

const app = new cdk.App();

// In a real multi-account setup you'd read these from context / env vars
// and deploy this same stack into dev, staging, and prod accounts.
new OrderSystemStack(app, 'OrderSystemStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'Serverless Order Processing System (Lambda, API Gateway, Step Functions, SQS/SNS/EventBridge, DynamoDB, S3, Cognito)',
});
