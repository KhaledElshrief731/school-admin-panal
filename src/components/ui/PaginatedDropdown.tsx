import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

interface PaginatedDropdownProps<T> {
  fetchOptions: (params: { page: number; search: string }) => Promise<{ data: T[]; hasMore: boolean }>;
  renderOption: (option: T, isSelected: boolean) => React.ReactNode;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string | number;
  onSelect: (option: T) => void;
  value?: T | null;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function PaginatedDropdown<T>({
  fetchOptions,
  renderOption,
  getOptionLabel,
  getOptionValue,
  onSelect,
  value = null,
  placeholder = 'اختر...',
  disabled = false,
  className = '',
}: PaginatedDropdownProps<T>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch options
  const loadOptions = useCallback(async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    const currentPage = reset ? 1 : page;
    try {
      const result = await fetchOptions({ page: currentPage, search });
      setOptions(prev => reset ? result.data : [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(currentPage + 1);
    } finally {
      setLoading(false);
    }
  }, [fetchOptions, page, search, hasMore, loading]);

  // Handle search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      setOptions([]);
      loadOptions(true);
    }, 400);
    setSearchTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Initial load when opened
  useEffect(() => {
    if (open) {
      setPage(1);
      setHasMore(true);
      setOptions([]);
      loadOptions(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 40 && hasMore && !loading) {
      loadOptions();
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`w-full bg-dark-200 border border-dark-100 rounded-lg px-3 py-2 text-left text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
      >
        <span>
        {value ? getOptionLabel(value) : <span className="text-gray-400">{placeholder}</span>}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-dark-300 border border-dark-100 rounded-lg shadow-lg max-h-72 overflow-hidden">
          <div className="p-2 border-b border-dark-200">
            <input
              type="text"
              className="w-full bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="بحث..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div
            className="overflow-y-auto max-h-56"
            style={{ minHeight: 80 }}
            onScroll={handleScroll}
            ref={listRef}
          >
            {options.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-400">لا توجد بيانات</div>
            )}
            {options.map(option => {
              const isSelected = !!value && getOptionValue(option) === getOptionValue(value);
              return (
                <div
                  key={getOptionValue(option)}
                  className={`cursor-pointer px-4 py-2 hover:bg-primary-600/20 ${isSelected ? 'bg-primary-600/30' : ''}`}
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                >
                  {renderOption(option, isSelected)}
                </div>
              );
            })}
            {loading && (
              <div className="p-2 text-center text-gray-400">جاري التحميل...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaginatedDropdown;
