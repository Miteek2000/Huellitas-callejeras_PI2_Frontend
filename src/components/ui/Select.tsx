import React from 'react';
import Image from 'next/image';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  icon?: string;
  iconAlt?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error,
  options,
  icon,
  iconAlt = 'icon',
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Image src={icon} alt={iconAlt} width={20} height={20} />
          </div>
        )}
        <select 
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-10 py-2 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:border-[#194566] focus:ring-2 focus:ring-[#194566] focus:ring-opacity-20 appearance-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300 ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
