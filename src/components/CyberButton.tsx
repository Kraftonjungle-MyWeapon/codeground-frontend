
import React from 'react';
import { cn } from '@/lib/utils';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const CyberButton = ({ 
  children, 
  onClick, 
  className, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button'
}: CyberButtonProps) => {
  const baseClasses = 'cyber-button flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'from-cyber-blue to-cyber-purple',
    secondary: 'from-gray-600 to-gray-700',
    danger: 'from-red-500 to-red-600',
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        `bg-gradient-to-r ${variantClasses[variant]}`,
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};

export default CyberButton;
