import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchContactUs } from '../store/slices/contactUsSlice';
import type { RootState, AppDispatch } from '../store';
import { getLocalizedRole } from '../utils/i18nUtils';
import { MessageCircle, User, Calendar, Phone, MapPin, Trash2, Eye } from 'lucide-react';
import { showToast } from '../store/slices/toastSlice';
import Table, { TableColumn } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import type { ContactUsItem } from '../store/slices/contactUsSlice';
import DeleteContactModal from '../components/contactUs/DeleteContactModal';

const ContactUs: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    contacts,
    loading,
    deleteLoading,
    error,
    totalItems,
    totalPages,
    message
  } = useSelector((state: RootState) => state.contactUs);

  const [showStatusMessage, setShowStatusMessage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedContact, setSelectedContact] = useState<ContactUsItem | null>(null);
  const [selectedContactToDelete, setSelectedContactToDelete] = useState<ContactUsItem | null>(null); // ✅

  useEffect(() => {
    dispatch(fetchContactUs({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    if (message?.arabic || message?.english) {
      setShowStatusMessage(true);
      const timer = setTimeout(() => setShowStatusMessage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message?.arabic, message?.english]);

  useEffect(() => {
    if (error) {
      dispatch(showToast({ message: error, type: 'error' }));
    }
  }, [error, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: TableColumn<ContactUsItem>[] = [
    {
      key: 'name',
      title: t('table.userName'),
      width: '300px',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          {record.User.image && (
            <img
              src={record.User.image.startsWith('/') ? `https://mahfouzapp.com${record.User.image}` : record.User.image}
              alt={record.User.userName}
              className="w-10 h-10 rounded-full object-cover border border-gray-400"
            />
          )}
          <div>
            <div className="font-semibold text-white">{record.name}</div>
            <div className="text-sm text-gray-400 flex items-center gap-1">
              <User className="w-3 h-3" />
              {record.User.userName}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {record.User.region}
            </div>
            <div className="text-xs text-primary-400 font-medium">
              {getLocalizedRole(record.User.role, t)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'contactNumber',
      title: t('table.contactNumber'),
      width: '150px',
      render: (value) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-300 flex items-center gap-2">
            <Phone className="w-3 h-3" />
            {value}
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      title: t('table.reason'),
      width: '150px',
      render: (value) => (
        <span className="text-white px-3 py-1 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      key: 'message',
      title: t('table.message'),
      width: '300px',
      render: (value: string) => {
        const words = value.split(' ');
        const preview = words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-300">{preview}</p>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      title: t('table.date'),
      width: '150px',
      render: (value) => (
        <div>
          <div className="text-sm text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(value).toLocaleDateString('ar-EG')}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString('ar-EG')}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      title: t('table.actions'),
      width: '100px',
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setSelectedContact(record)}
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            title={t('common.view')}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedContactToDelete(record)}
            disabled={deleteLoading}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            title={t('common.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-8xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-8 h-8 text-primary-500" />
        <h1 className="text-3xl font-bold text-white">{t('pages.contactReports')}</h1>
        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {totalItems}
        </span>
      </div>

      {showStatusMessage && message && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 shadow flex flex-col md:flex-row md:items-center md:gap-4 transition-opacity duration-500">
          <span className="font-bold">{message.arabic}</span>
          <span className="text-gray-500 text-sm">{message.english}</span>
        </div>
      )}

      <Table
        columns={columns}
        data={contacts}
        loading={loading}
        emptyText={t('pagination.noData')}
        hoverable={true}
        striped={false}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* View Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-900 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-primary-600">{t('table.reason')}</h2>
            <p className="mb-4">{selectedContact.reason}</p>

            <h2 className="text-xl font-bold mb-2 text-primary-600">{t('table.message')}</h2>
            <p className="mb-6 whitespace-pre-wrap">{selectedContact.message}</p>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedContact(null)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteContactModal
        isOpen={!!selectedContactToDelete}
        onClose={() => setSelectedContactToDelete(null)}
        contact={selectedContactToDelete}
      />
    </div>
  );
};

export default ContactUs;
