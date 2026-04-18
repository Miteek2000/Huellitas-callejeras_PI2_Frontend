'use client';

import React from 'react';
import { sanitizeInput } from '@/utils/sanitize';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  allowedPattern?: RegExp;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '',
  allowedPattern,
  onChange,
  ...props 
}) => {
  const defaultBg = className.includes('bg-') ? '' : 'bg-[#FFFFFF]';
  const defaultBorder = className.includes('border-') ? '' : 'border-none';

  const filterAllowed = (value: string) => {
    if (!allowedPattern) return value;
    const safePattern = new RegExp(
      allowedPattern.source,
      allowedPattern.flags.replace('g', '')
    );
    return Array.from(value).filter((char) => safePattern.test(char)).join('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(event.target.value);
    const filteredValue = filterAllowed(sanitizedValue);
    if (filteredValue !== event.target.value) {
      event.target.value = filteredValue;
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
      <input 
        className={`w-full px-4 py-2 rounded-lg ${defaultBg} ${defaultBorder} text-black focus:outline-none focus:border-[#194566] focus:ring-2 focus:ring-[#194566] focus:ring-opacity-20 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300 
          autofill:bg-inherit autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]
          ${error ? 'border-red-500 !border !border-solid' : ''} ${className}`}
        onChange={handleChange}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
