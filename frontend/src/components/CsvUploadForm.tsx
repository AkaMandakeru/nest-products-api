'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

interface CsvUploadFormProps {
  onUploadSuccess: () => void;
  token: string | null;
}

export default function CsvUploadForm({ onUploadSuccess, token }: CsvUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) {
      toast.error('Please select a CSV file');
      return;
    }

    const file = fileInput.files[0];
    if (file.type !== 'text/csv') {
      toast.error('Please upload a valid CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);

    try {
      const response = await fetch('http://localhost:3000/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload CSV');
      }

      fileInput.value = '';
      onUploadSuccess();
      toast.success('Products imported successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSV File *
          </label>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              focus:outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload a CSV file with product data
          </p>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </form>
    </div>
  );
}
