'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Company } from '@/types/company';
import toast from 'react-hot-toast';

interface CompanyFormProps {
  initialData?: Company;
  onSubmitSuccess: () => void;
  token: string | null;
}

export default function CompanyForm({ initialData, onSubmitSuccess, token }: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Company>({
    defaultValues: initialData,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const onSubmit = async (data: Company) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/companies', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save company');
      }

      toast.success(isEditing ? 'Company updated successfully' : 'Company created successfully');
      onSubmitSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Company Name *
        </label>
        <input
          type="text"
          {...register('name', { required: 'Company name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="document" className="block text-sm font-medium text-gray-700">
          Document (CNPJ/Tax ID) *
        </label>
        <input
          type="text"
          {...register('document', { required: 'Document is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.document && (
          <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address *
        </label>
        <input
          type="text"
          {...register('address', { required: 'Address is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting
            ? (isEditing ? 'Updating...' : 'Creating...')
            : (isEditing ? 'Update Company' : 'Create Company')}
        </button>
      </div>
    </form>
  );
}
