import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateCustomer } from '../utils/dynamodb';
import { validateUpdateCustomer } from '../utils/validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
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

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const updateData = JSON.parse(event.body);
    const validationErrors = validateUpdateCustomer(updateData);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ errors: validationErrors }),
      };
    }

    const customer = await updateCustomer(customerId, updateData);

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
    console.error('Error updating customer:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
