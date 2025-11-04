import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getCustomers } from '../utils/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const customers = await getCustomers();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(customers),
    };
  } catch (error) {
    console.error('Error getting customers:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
