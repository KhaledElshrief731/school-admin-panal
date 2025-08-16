import React from 'react';
import { Eye, Edit, Trash2, AlertTriangle, Check, X } from 'lucide-react';

interface ActionButton {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  tooltip?: string;
  disabled?: boolean;
}

interface TableActionsProps {
  actions: ActionButton[];
}

const TableActions: React.FC<TableActionsProps> = ({ actions }) => {
  const getVariantClasses = (variant: string = 'secondary') => {
    const variants = {
      primary: 'text-primary-400 hover:text-primary-300 hover:bg-primary-600/20',
      secondary: 'text-gray-400 hover:text-white hover:bg-dark-100',
      success: 'text-success-400 hover:text-success-300 hover:bg-success-600/20',
      warning: 'text-warning-400 hover:text-warning-300 hover:bg-warning-600/20',
      error: 'text-error-400 hover:text-error-300 hover:bg-error-600/20',
    };
    
    return variants[variant as keyof typeof variants] || variants.secondary;
  };

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled}
          title={action.tooltip}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${getVariantClasses(action.variant)}
            ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};

// Pre-built action components for common use cases
export const ViewAction = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 text-gray-400 hover:text-white rounded-lg bg-dark-200 hover:bg-dark-100 transition-colors"
  >
    <Eye className="w-4 h-4" />
  </button>
);

export const EditAction = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 text-blue-400 hover:text-blue-300 rounded-lg bg-dark-200 hover:bg-dark-100 transition-colors"
  >
    <Edit className="w-4 h-4" />
  </button>
);

export const DeleteAction = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 text-error-400 hover:text-error-300 rounded-lg bg-dark-200 hover:bg-dark-100 transition-colors"
  >
    <Trash2 className="w-4 h-4" />
  </button>
);

export const ApproveAction = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 text-success-400 hover:text-success-300 rounded-lg bg-dark-200 hover:bg-dark-100 transition-colors"
  >
    <Check className="w-4 h-4" />
  </button>
);

export const RejectAction = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 text-error-400 hover:text-error-300 rounded-lg bg-dark-200 hover:bg-dark-100 transition-colors"
  >
    <X className="w-4 h-4" />
  </button>
);

export const SuspendAction = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 text-warning-400 hover:text-warning-300 rounded-lg bg-dark-200 hover:bg-dark-100 transition-colors"
  >
    <AlertTriangle className="w-4 h-4" />
  </button>
);

export default TableActions;