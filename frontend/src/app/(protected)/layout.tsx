'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyResponse } from '@/types/company';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuth();
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/companies/exists', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to check company status');
        }

        const data: CompanyResponse = await response.json();
        setHasCompany(data.hasCompany);
        if (data.hasCompany && data.company) {
          setCompanyName(data.company.name);
        }

        // Redirect to company registration if no company exists and not already on company page
        if (!data.hasCompany && pathname !== '/company') {
          router.push('/company');
        }
      } catch (error) {
        console.error('Error checking company status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#4A5D5A] text-white min-h-screen">
        <div className="p-4">
          <Link href="/products" className="text-xl font-bold">
            {companyName || 'My Company'}
          </Link>
        </div>
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link
              href="/products"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname === '/products'
                  ? 'bg-[#3B4A48] text-white'
                  : 'text-gray-300 hover:bg-[#3B4A48] hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products
            </Link>
            <Link
              href="/company"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pathname === '/company'
                  ? 'bg-[#3B4A48] text-white'
                  : 'text-gray-300 hover:bg-[#3B4A48] hover:text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m-9 0a2 2 0 012-2v-6a2 2 0 012-2v6a2 2 0 012 2v6a2 2 0 012 2v6a2 2 0 012-2v-6a2 2 0 012-2h2m-6 0h6v4h-6v-4m6 0h-6v4h6v-4" />
              </svg>
              Company
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Top navigation */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end h-16">
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">{user?.name}</span>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
