import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, RotateCcw } from 'lucide-react';

interface AdsFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

const AdsFilters: React.FC<AdsFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'all', label: t('ads.filters.all') },
    { value: 'active', label: t('ads.filters.active') },
    { value: 'scheduled', label: t('ads.filters.scheduled') },
    { value: 'expired', label: t('ads.filters.expired') },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder={t('ads.filters.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-dark-200 text-white placeholder-gray-400"
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-dark-200 text-white"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <button
          onClick={onReset}
          className="px-4 py-2 text-gray-300 bg-dark-100 hover:bg-dark-200 rounded-lg flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('ads.filters.reset')}
        </button>
      </div>
    </div>
  );
};

export default AdsFilters;
