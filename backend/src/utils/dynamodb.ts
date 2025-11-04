import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../models/customer';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME!;

export async function createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
  const customer: Customer = {
    customerId: uuidv4(),
    name: customerData.name.trim(),
    email: customerData.email.trim(),
    phone: customerData.phone.trim(),
    address: customerData.address.trim(),
    registrationDate: new Date().toISOString(),
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: customer,
  }));

  return customer;
}

export async function getCustomers(): Promise<Customer[]> {
  const result = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME,
  }));

  return (result.Items as Customer[]) || [];
}

export async function getCustomer(customerId: string): Promise<Customer | null> {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { customerId },
  }));

  return (result.Item as Customer) || null;
}

export async function updateCustomer(customerId: string, updates: UpdateCustomerRequest): Promise<Customer | null> {
  const existingCustomer = await getCustomer(customerId);
  if (!existingCustomer) {
    return null;
  }

  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = typeof value === 'string' ? value.trim() : value;
    }
  });

  if (updateExpressions.length === 0) {
    return existingCustomer;
  }

  await docClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { customerId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  }));

  return await getCustomer(customerId);
}

export async function deleteCustomer(customerId: string): Promise<boolean> {
  const existingCustomer = await getCustomer(customerId);
  if (!existingCustomer) {
    return false;
  }

  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { customerId },
  }));

  return true;
}
