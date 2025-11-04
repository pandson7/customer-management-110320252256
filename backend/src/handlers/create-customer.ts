import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createCustomer } from '../utils/dynamodb';
import { validateCreateCustomer } from '../utils/validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const customerData = JSON.parse(event.body);
    const validationErrors = validateCreateCustomer(customerData);

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ errors: validationErrors }),
      };
    }

    const customer = await createCustomer(customerData);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(customer),
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
