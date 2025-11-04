import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Customer, CreateCustomerRequest, ValidationError } from '../types/Customer';
import { apiService } from '../services/api';

interface CustomerFormProps {
  isEdit?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();
  
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (isEdit && customerId) {
      loadCustomer();
    }
  }, [isEdit, customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const customer = await apiService.getCustomer(customerId!);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      if (isEdit && customerId) {
        await apiService.updateCustomer(customerId, formData);
      } else {
        await apiService.createCustomer(formData);
      }
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.errors) {
            setValidationErrors(errorData.errors);
          } else {
            setError(err.message);
          }
        } catch {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(err => err.field !== name));
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find(err => err.field === fieldName)?.message;
  };

  if (loading && isEdit) return <div className="loading">Loading customer...</div>;

  return (
    <div className="customer-form">
      <h1>{isEdit ? 'Edit Customer' : 'Add New Customer'}</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={getFieldError('name') ? 'error' : ''}
            required
          />
          {getFieldError('name') && <span className="field-error">{getFieldError('name')}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={getFieldError('email') ? 'error' : ''}
            required
          />
          {getFieldError('email') && <span className="field-error">{getFieldError('email')}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={getFieldError('phone') ? 'error' : ''}
            required
          />
          {getFieldError('phone') && <span className="field-error">{getFieldError('phone')}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={getFieldError('address') ? 'error' : ''}
            rows={3}
            required
          />
          {getFieldError('address') && <span className="field-error">{getFieldError('address')}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : (isEdit ? 'Update Customer' : 'Create Customer')}
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
