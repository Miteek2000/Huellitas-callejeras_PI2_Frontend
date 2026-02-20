import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  className = '',
  disabled,
  ...props 
}) => {
  return (
    <label className={`flex items-center space-x-2 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
      <input 
        type="checkbox"
        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed ${className}`}
        disabled={disabled}
        {...props}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};
