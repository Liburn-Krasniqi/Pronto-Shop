import React from 'react';

interface LoginSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

export const LoginSpinner: React.FC<LoginSpinnerProps> = ({ 
  size = 'medium', 
  color = 'white',
  className = ''
}) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  };

  return (
    <div 
      className={`spinner-border ${sizeClasses[size]} ${className}`}
      style={{ 
        color,
        width: size === 'small' ? '1rem' : size === 'large' ? '3rem' : '1.5rem',
        height: size === 'small' ? '1rem' : size === 'large' ? '3rem' : '1.5rem'
      }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}; 