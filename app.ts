#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CustomerManagementStack } from './lib/customer-management-stack';

const app = new cdk.App();
new CustomerManagementStack(app, 'CustomerManagementStack110320252256', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
