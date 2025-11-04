# Customer Information Management System

A full-stack web application for managing customer records with complete CRUD operations, built with React frontend, Node.js backend, and DynamoDB for data persistence.

## Features

- Create, read, update, and delete customer records
- Store customer information: name, email, phone, address, registration date
- Responsive web interface
- Data validation and error handling
- Serverless architecture on AWS

## Project Structure

```
customer-management-110320252256/
├── specs/                    # Specification documents
│   ├── requirements.md       # User stories and acceptance criteria
│   ├── design.md            # Technical architecture and design
│   └── tasks.md             # Implementation plan and tasks
├── src/                     # Backend source code
├── tests/                   # Test files
├── cdk-app/                 # AWS CDK infrastructure code
├── frontend/                # React frontend application
├── pricing/                 # Cost analysis and pricing information
├── generated-diagrams/      # Architecture and sequence diagrams
├── qr-code/                 # QR codes for easy access
└── README.md               # This file
```

## Technology Stack

### Frontend
- React.js with TypeScript
- React Router for navigation
- Local development server

### Backend
- Node.js with Express
- AWS Lambda functions
- API Gateway for REST endpoints

### Database
- Amazon DynamoDB
- On-demand billing mode
- Server-side encryption

### Infrastructure
- AWS CDK for Infrastructure as Code
- TypeScript for CDK constructs

## Getting Started

1. Review the specifications in the `specs/` directory
2. Follow the implementation plan in `specs/tasks.md`
3. Set up the development environment
4. Deploy infrastructure using CDK
5. Run the frontend application locally

## API Endpoints

- `GET /customers` - List all customers
- `GET /customers/{id}` - Get specific customer
- `POST /customers` - Create new customer
- `PUT /customers/{id}` - Update existing customer
- `DELETE /customers/{id}` - Delete customer

## Data Model

Customer records include:
- Customer ID (auto-generated)
- Name (required)
- Email (required, validated format)
- Phone (required)
- Address (required)
- Registration Date (auto-generated)

## Development Guidelines

- Follow the spec-driven development approach
- Implement Test-Driven Development (TDD)
- Use absolute file paths for all operations
- Maintain clean code and documentation standards
- Follow AWS security best practices
