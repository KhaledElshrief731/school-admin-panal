import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedStatus } from '../../utils/i18nUtils';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  localize?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'default',
  size = 'md',
  localize = true
}) => {
  const { t } = useTranslation();
  
  const displayStatus = localize ? getLocalizedStatus(status, t) : status;
  
  const getVariantClasses = () => {
    const variants = {
      success: 'bg-success-600/20 text-success-400',
      warning: 'bg-warning-600/20 text-warning-400',
      error: 'bg-error-600/20 text-error-400',
      info: 'bg-primary-600/20 text-primary-400',
      default: 'bg-gray-600/20 text-gray-400',
    };
    
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    };
    
    return sizes[size];
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${getVariantClasses()}
      ${getSizeClasses()}
    `}>
      {displayStatus}
    </span>
  );
};

export default StatusBadge;