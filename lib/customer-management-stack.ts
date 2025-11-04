import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CustomerManagementStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const customersTable = new dynamodb.Table(this, 'CustomersTable110320252256', {
      tableName: 'customers-110320252256',
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Enable auto scaling
    customersTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    customersTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    // Lambda execution role
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole110320252256', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        DynamoDBAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Scan',
                'dynamodb:Query',
              ],
              resources: [customersTable.tableArn],
            }),
          ],
        }),
      },
    });

    // Lambda Functions
    const createCustomerFunction = new lambda.Function(this, 'CreateCustomerFunction110320252256', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'create-customer.handler',
      code: lambda.Code.fromAsset('backend/dist'),
      role: lambdaRole,
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    const getCustomersFunction = new lambda.Function(this, 'GetCustomersFunction110320252256', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'get-customers.handler',
      code: lambda.Code.fromAsset('backend/dist'),
      role: lambdaRole,
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    const getCustomerFunction = new lambda.Function(this, 'GetCustomerFunction110320252256', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'get-customer.handler',
      code: lambda.Code.fromAsset('backend/dist'),
      role: lambdaRole,
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    const updateCustomerFunction = new lambda.Function(this, 'UpdateCustomerFunction110320252256', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'update-customer.handler',
      code: lambda.Code.fromAsset('backend/dist'),
      role: lambdaRole,
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    const deleteCustomerFunction = new lambda.Function(this, 'DeleteCustomerFunction110320252256', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'delete-customer.handler',
      code: lambda.Code.fromAsset('backend/dist'),
      role: lambdaRole,
      environment: {
        TABLE_NAME: customersTable.tableName,
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'CustomerManagementApi110320252256', {
      restApiName: 'Customer Management API',
      description: 'API for customer management system',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    const customersResource = api.root.addResource('customers');
    const customerResource = customersResource.addResource('{customerId}');

    // API Gateway integrations
    customersResource.addMethod('GET', new apigateway.LambdaIntegration(getCustomersFunction));
    customersResource.addMethod('POST', new apigateway.LambdaIntegration(createCustomerFunction));
    customerResource.addMethod('GET', new apigateway.LambdaIntegration(getCustomerFunction));
    customerResource.addMethod('PUT', new apigateway.LambdaIntegration(updateCustomerFunction));
    customerResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteCustomerFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: customersTable.tableName,
      description: 'DynamoDB Table Name',
    });
  }
}
