'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Customer, CreateCustomerDto } from '@/types/customer';
import CustomerTable from '@/components/CustomerTable';
import CustomerForm from '@/components/CustomerForm';

export default function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3000/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const handleCreateCustomer = async (data: CreateCustomerDto) => {
    try {
      const response = await fetch('http://localhost:3000/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create customer');
      }

      await fetchCustomers();
      setShowForm(false);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateCustomer = async (data: CreateCustomerDto) => {
    if (!selectedCustomer?._id) return;

    try {
      const response = await fetch(
        `http://localhost:3000/customers/${selectedCustomer._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update customer');
      }

      await fetchCustomers();
      setShowForm(false);
      setSelectedCustomer(undefined);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      await fetchCustomers();
    } catch (err) {
      setError('Failed to delete customer');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <button
          onClick={() => {
            setSelectedCustomer(undefined);
            setShowForm(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          New Customer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {selectedCustomer ? 'Edit Customer' : 'New Customer'}
          </h2>
          <CustomerForm
            customer={selectedCustomer}
            onSubmit={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
            onCancel={() => {
              setShowForm(false);
              setSelectedCustomer(undefined);
            }}
          />
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          onEdit={(customer) => {
            setSelectedCustomer(customer);
            setShowForm(true);
          }}
          onDelete={handleDeleteCustomer}
        />
      )}
    </div>
  );
}
