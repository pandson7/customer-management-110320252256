import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getCustomer } from '../utils/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const customerId = event.pathParameters?.customerId;

    if (!customerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Customer ID is required' }),
      };
    }

    const customer = await getCustomer(customerId);

    if (!customer) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Customer not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(customer),
    };
  } catch (error) {
    console.error('Error getting customer:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
