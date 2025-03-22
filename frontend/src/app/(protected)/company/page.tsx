'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Company } from '@/types/company';
import CompanyForm from '@/components/CompanyForm';
import toast from 'react-hot-toast';

export default function CompanyPage() {
  const { token } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompany = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/companies', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status !== 404) {
          throw new Error('Failed to fetch company details');
        }
        return;
      }

      const data = await response.json();
      setCompany(data);
    } catch (error) {
      toast.error('Error fetching company details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {company ? 'Company Details' : 'Register Your Company'}
            </h2>
          </div>
          <div className="px-6 py-4">
            <CompanyForm
              initialData={company || undefined}
              onSubmitSuccess={fetchCompany}
              token={token}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
