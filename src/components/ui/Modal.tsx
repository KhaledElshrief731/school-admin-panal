import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClass?: string; // e.g., "max-w-2xl"
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, widthClass = "max-w-2xl" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-dark-300 rounded-xl w-full ${widthClass} max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 border-b border-dark-200 flex items-center justify-between">
          {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal; 