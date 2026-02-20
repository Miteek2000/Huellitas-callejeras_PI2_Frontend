import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  className = '',
  ...props 
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input 
        type="checkbox"
        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
        {...props}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};
