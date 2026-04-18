'use client';

import React from 'react';
import { sanitizeInput } from '@/utils/sanitize';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  label, 
  error, 
  className = '',
  onChange,
  ...props 
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(event.target.value);
    if (sanitizedValue !== event.target.value) {
      event.target.value = sanitizedValue;
    }
    // Sanitize input before propagating to handlers/state.
    onChange?.(event);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea 
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:border-[#194566] focus:ring-2 focus:ring-[#194566] focus:ring-opacity-20 resize-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
