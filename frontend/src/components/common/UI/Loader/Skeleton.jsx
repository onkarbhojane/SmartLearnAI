import React from 'react';

export const Skeleton = ({ 
  className = '', 
  variant = 'text',
  height,
  width 
}) => {
  const baseStyles = 'animate-pulse bg-gray-200 rounded';
  
  const variants = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: '',
  };

  const styles = {
    height: height,
    width: width
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
      `}
      style={styles}
    />
  );
};