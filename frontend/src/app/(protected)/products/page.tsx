'use client';

import { useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProductForm from '@/components/ProductForm';
import ProductTable, { ProductTableRef } from '@/components/ProductTable';
import CsvUploadForm from '@/components/CsvUploadForm';

export default function ProductsPage() {
  const tableRef = useRef<ProductTableRef>(null);
  const { token } = useAuth();

  const handleProductCreated = () => {
    tableRef.current?.fetchProducts();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add Single Product</h2>
            </div>
            <ProductForm onProductCreated={handleProductCreated} token={token} />
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Bulk Import Products</h2>
            </div>
            <CsvUploadForm onUploadSuccess={handleProductCreated} token={token} />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Products List</h2>
            </div>
            <ProductTable ref={tableRef} token={token} />
          </div>
        </div>
      </div>
    </main>
  );
}
