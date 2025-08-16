import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchAds } from '../store/slices/adsSlice';
import {
  AdsHeader,
  AdsFilters,
  AdsStats,
  AddAdModal,
} from '../components/ads';
import Table, { TableColumn } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import { Ad } from '../types/ads';
import { Eye, Trash2 } from 'lucide-react';

const Ads: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { ads, loading, error, totalItems, totalPages } = useSelector(
    (state: RootState) => state.ads
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAds({ page: currentPage, pageSize, type: 'APP_ADS' }));
  }, [dispatch, currentPage, pageSize]);

  const handleView = (id: string) => { console.log('View ad:', id); };
  const handleDelete = (id: string) => { console.log('Delete ad:', id); };
  const handleAddNew = () => { setIsAddModalOpen(true); };
  const handleSearchChange = (value: string) => { setSearchTerm(value); setCurrentPage(1); };
  const handleStatusChange = (value: string) => { setStatusFilter(value); setCurrentPage(1); };
  const handleReset = () => { setSearchTerm(''); setStatusFilter('all'); setCurrentPage(1); };
  const handlePageChange = (page: number) => { setCurrentPage(page); };

  const filteredAds = ads.filter(ad => {
    const matchesSearch =
      ad.title.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.title.ku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.ku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = (() => {
      if (statusFilter === 'all') return true;

      const now = new Date();
      const start = ad.startDate ? new Date(ad.startDate) : null;
      const end = ad.endDate ? new Date(ad.endDate) : null;

      if (statusFilter === 'active') {
        return start && end && now >= start && now <= end;
      } else if (statusFilter === 'scheduled') {
        return start && now < start;
      } else if (statusFilter === 'expired') {
        return end && now > end;
      }
      return true;
    })();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (startDate?: string, endDate?: string) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && now < start) return 'bg-yellow-100 text-yellow-800';
    if (end && now > end) return 'bg-red-100 text-red-800';
    if (start && end && now >= start && now <= end) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (startDate?: string, endDate?: string) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && now < start) return t('ads.status.scheduled');
    if (end && now > end) return t('ads.status.expired');
    if (start && end && now >= start && now <= end) return t('ads.status.active');
    return t('ads.status.unknown');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    // Format date according to current language
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : i18n.language === 'ku' ? 'ku-IQ' : 'en-US');
  };

  const tableColumns: TableColumn<Ad>[] = [
    {
      key: 'title',
      title: t('ads.table.title'),
             render: (_, record) => {
         const currentLanguage = i18n.language as 'ar' | 'en' | 'ku';
         return (
           <div className="text-sm font-medium text-white">
             {record.title[currentLanguage] || record.title.en}
           </div>
         );
       }
    },
    {
      key: 'description',
      title: t('ads.table.description'),
             render: (_, record) => {
         const currentLanguage = i18n.language as 'ar' | 'en' | 'ku';
         return (
           <div className="text-sm text-gray-300 max-w-xs truncate">
             {record.description[currentLanguage] || record.description.en}
           </div>
         );
       }
    },
    {
      key: 'startDate',
      title: t('ads.table.startDate'),
      render: (_, record) => (
        <span className="text-sm text-gray-300">
          {formatDate(record.startDate)}
        </span>
      )
    },
    {
      key: 'endDate',
      title: t('ads.table.endDate'),
      render: (_, record) => (
        <span className="text-sm text-gray-300">
          {formatDate(record.endDate)}
        </span>
      )
    },
    {
      key: 'status',
      title: t('ads.table.status'),
      render: (_, record) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.startDate, record.endDate)}`}>
          {getStatusText(record.startDate, record.endDate)}
        </span>
      )
    },
    {
      key: 'actions',
      title: t('ads.table.actions'),
      render: (_, record) => (
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => handleView(record.id)}
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
            title={t('common.view')}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
            title={t('common.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  if (loading && ads.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error && ads.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchAds({ page: 1, pageSize, type: 'APP_ADS' }))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <AdsHeader onAddNew={handleAddNew} />
             <div className="bg-dark-300 rounded-xl p-6 space-y-6">
         <div className="flex items-center justify-between">
           <h2 className="text-xl font-semibold text-white">{t('ads.tableHeader')}</h2>
         </div>
        <AdsFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onReset={handleReset}
        />
        <AdsStats ads={ads} />
        <Table
          columns={tableColumns}
          data={filteredAds}
          loading={loading}
          emptyText={t('pagination.noData')}
          rowKey="id"
        />
                 <div className="flex items-center justify-between">
           <div className="text-sm text-gray-300">
             {t('pagination.showing')} {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredAds.length)} {t('pagination.of')} {filteredAds.length} {t('pagination.results')}
           </div>
                     <Pagination
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={handlePageChange}
           />
         </div>
       </div>
       
       <AddAdModal
         isOpen={isAddModalOpen}
         onClose={() => setIsAddModalOpen(false)}
       />
     </div>
   );
 };

export default Ads;