export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
