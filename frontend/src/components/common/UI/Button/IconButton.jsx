import React from 'react';

export const IconButton = ({ 
  icon, 
  onClick, 
  className = '', 
  disabled = false,
  size = 'md',
  variant = 'ghost',
  ...props 
}) => {
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };
  
  const variants = {
    ghost: 'text-gray-600 hover:bg-gray-100',
    primary: 'text-blue-600 hover:bg-blue-100',
    danger: 'text-red-600 hover:bg-red-100'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${sizes[size]}
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};