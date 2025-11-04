import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteCustomer } from '../utils/dynamodb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
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

    const deleted = await deleteCustomer(customerId);

    if (!deleted) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Customer not found' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Customer deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
