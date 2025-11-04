import { CreateCustomerRequest, UpdateCustomerRequest } from '../models/customer';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreateCustomer(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    errors.push({ field: 'phone', message: 'Phone is required' });
  }

  if (!data.address || typeof data.address !== 'string' || data.address.trim().length === 0) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  return errors;
}

export function validateUpdateCustomer(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
    errors.push({ field: 'name', message: 'Name must be a non-empty string' });
  }

  if (data.email !== undefined && (typeof data.email !== 'string' || !isValidEmail(data.email))) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (data.phone !== undefined && (typeof data.phone !== 'string' || data.phone.trim().length === 0)) {
    errors.push({ field: 'phone', message: 'Phone must be a non-empty string' });
  }

  if (data.address !== undefined && (typeof data.address !== 'string' || data.address.trim().length === 0)) {
    errors.push({ field: 'address', message: 'Address must be a non-empty string' });
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
