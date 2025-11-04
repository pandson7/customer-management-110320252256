import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Customer } from '../types/Customer';
import { apiService } from '../services/api';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await apiService.deleteCustomer(customerId);
      setCustomers(customers.filter(c => c.customerId !== customerId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  if (loading) return <div className="loading">Loading customers...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="customer-list">
      <div className="header">
        <h1>Customer Management</h1>
        <Link to="/customers/new" className="btn btn-primary">Add New Customer</Link>
      </div>

      {customers.length === 0 ? (
        <div className="no-customers">
          <p>No customers found.</p>
          <Link to="/customers/new" className="btn btn-primary">Create your first customer</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{new Date(customer.registrationDate).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/customers/${customer.customerId}`} className="btn btn-secondary">View</Link>
                    <Link to={`/customers/${customer.customerId}/edit`} className="btn btn-secondary">Edit</Link>
                    <button 
                      onClick={() => handleDelete(customer.customerId)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
