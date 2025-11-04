import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Customer } from '../types/Customer';
import { apiService } from '../services/api';

const CustomerDetail: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCustomer(customerId!);
      setCustomer(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await apiService.deleteCustomer(customerId!);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  if (loading) return <div className="loading">Loading customer...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!customer) return <div className="error">Customer not found</div>;

  return (
    <div className="customer-detail">
      <div className="header">
        <h1>Customer Details</h1>
        <div className="actions">
          <Link to={`/customers/${customer.customerId}/edit`} className="btn btn-primary">
            Edit Customer
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Customer
          </button>
          <Link to="/" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>

      <div className="customer-info">
        <div className="info-group">
          <label>Name:</label>
          <span>{customer.name}</span>
        </div>

        <div className="info-group">
          <label>Email:</label>
          <span>{customer.email}</span>
        </div>

        <div className="info-group">
          <label>Phone:</label>
          <span>{customer.phone}</span>
        </div>

        <div className="info-group">
          <label>Address:</label>
          <span>{customer.address}</span>
        </div>

        <div className="info-group">
          <label>Registration Date:</label>
          <span>{new Date(customer.registrationDate).toLocaleString()}</span>
        </div>

        <div className="info-group">
          <label>Customer ID:</label>
          <span className="customer-id">{customer.customerId}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
