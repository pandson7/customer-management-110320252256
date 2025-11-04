# Technical Design Document

## System Overview

The Customer Information Management System is a full-stack web application built with React frontend and Node.js backend, using DynamoDB for data persistence. The system follows a serverless architecture pattern deployed on AWS using CDK.

## Architecture Components

### Frontend Layer
- **Technology**: React.js
- **Hosting**: Local development server
- **Responsibilities**: 
  - User interface for CRUD operations
  - Form validation and user feedback
  - API communication with backend services

### Backend Layer
- **Technology**: Node.js with Express framework
- **Runtime**: AWS Lambda functions
- **Responsibilities**:
  - REST API endpoints for customer operations
  - Business logic and data validation
  - DynamoDB integration

### Data Layer
- **Technology**: Amazon DynamoDB
- **Table Design**:
  - Table Name: `customers`
  - Partition Key: `customerId` (String)
  - Attributes: name, email, phone, address, registrationDate

## API Design

### REST Endpoints

#### GET /customers
- **Purpose**: Retrieve all customer records
- **Response**: Array of customer objects
- **Status Codes**: 200 (success), 500 (server error)

#### GET /customers/{customerId}
- **Purpose**: Retrieve specific customer record
- **Response**: Customer object
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

#### POST /customers
- **Purpose**: Create new customer record
- **Request Body**: Customer object (name, email, phone, address)
- **Response**: Created customer with generated ID and registration date
- **Status Codes**: 201 (created), 400 (validation error), 500 (server error)

#### PUT /customers/{customerId}
- **Purpose**: Update existing customer record
- **Request Body**: Updated customer object
- **Response**: Updated customer object
- **Status Codes**: 200 (success), 404 (not found), 400 (validation error), 500 (server error)

#### DELETE /customers/{customerId}
- **Purpose**: Delete customer record
- **Response**: Success confirmation
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

## Data Model

### Customer Entity
```json
{
  "customerId": "uuid-string",
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "phone": "string (required)",
  "address": "string (required)",
  "registrationDate": "ISO 8601 datetime string"
}
```

## DynamoDB Table Schema

### Table Configuration
- **Table Name**: customers
- **Partition Key**: customerId (String)
- **Billing Mode**: On-demand
- **Encryption**: Server-side encryption enabled

### Access Patterns
1. **Get all customers**: Scan operation (acceptable for prototype)
2. **Get customer by ID**: GetItem operation using customerId
3. **Create customer**: PutItem operation with generated customerId
4. **Update customer**: UpdateItem operation using customerId
5. **Delete customer**: DeleteItem operation using customerId

## Security Considerations

### Data Validation
- Server-side validation for all input fields
- Email format validation using regex
- Phone number format validation
- Required field validation

### Error Handling
- Graceful error handling for all API endpoints
- User-friendly error messages
- Proper HTTP status codes

## Deployment Architecture

### Infrastructure as Code
- **Tool**: AWS CDK (TypeScript)
- **Resources**:
  - DynamoDB table with appropriate permissions
  - Lambda functions for API endpoints
  - API Gateway for REST API exposure
  - IAM roles with least privilege access

### Development Environment
- Local React development server
- Local testing of Lambda functions
- DynamoDB local for development testing

## Performance Considerations

### Frontend
- Component-based architecture for reusability
- State management for efficient re-renders
- Form validation to reduce server requests

### Backend
- Efficient DynamoDB queries using partition keys
- Connection pooling for database connections
- Proper error handling and logging

## Sequence Diagrams

### Create Customer Flow
```
User -> Frontend: Fill customer form
Frontend -> Frontend: Validate input
Frontend -> API Gateway: POST /customers
API Gateway -> Lambda: Invoke create function
Lambda -> DynamoDB: PutItem
DynamoDB -> Lambda: Success response
Lambda -> API Gateway: Return created customer
API Gateway -> Frontend: 201 response
Frontend -> User: Display success message
```

### Read Customer Flow
```
User -> Frontend: Request customer list
Frontend -> API Gateway: GET /customers
API Gateway -> Lambda: Invoke list function
Lambda -> DynamoDB: Scan operation
DynamoDB -> Lambda: Return customer list
Lambda -> API Gateway: Return customers array
API Gateway -> Frontend: 200 response
Frontend -> User: Display customer table
```

### Update Customer Flow
```
User -> Frontend: Edit customer form
Frontend -> Frontend: Validate input
Frontend -> API Gateway: PUT /customers/{id}
API Gateway -> Lambda: Invoke update function
Lambda -> DynamoDB: UpdateItem
DynamoDB -> Lambda: Success response
Lambda -> API Gateway: Return updated customer
API Gateway -> Frontend: 200 response
Frontend -> User: Display success message
```

### Delete Customer Flow
```
User -> Frontend: Click delete button
Frontend -> User: Show confirmation dialog
User -> Frontend: Confirm deletion
Frontend -> API Gateway: DELETE /customers/{id}
API Gateway -> Lambda: Invoke delete function
Lambda -> DynamoDB: DeleteItem
DynamoDB -> Lambda: Success response
Lambda -> API Gateway: Return success
API Gateway -> Frontend: 200 response
Frontend -> User: Display success message
```
