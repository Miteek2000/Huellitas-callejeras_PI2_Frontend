import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false,
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-full font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#2c3e50] text-white hover:bg-[#34495e]',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
    outline: 'bg-transparent border-2 border-[#2c3e50] text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
