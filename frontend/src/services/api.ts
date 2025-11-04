import { Customer, CreateCustomerRequest } from '../types/Customer';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getCustomers(): Promise<Customer[]> {
    return this.request<Customer[]>('/customers');
  }

  async getCustomer(customerId: string): Promise<Customer> {
    return this.request<Customer>(`/customers/${customerId}`);
  }

  async createCustomer(customer: CreateCustomerRequest): Promise<Customer> {
    return this.request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(customerId: string, customer: Partial<CreateCustomerRequest>): Promise<Customer> {
    return this.request<Customer>(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
  }

  async deleteCustomer(customerId: string): Promise<void> {
    await this.request<void>(`/customers/${customerId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
