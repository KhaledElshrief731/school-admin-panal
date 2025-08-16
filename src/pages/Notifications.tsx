import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../hooks/useNotifications';
import { showToast } from '../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import type { CreateNotificationRequest } from '../store/slices/notificationsSlice';
import { fetchNotifications } from '../store/slices/notificationsSlice';
import {
  NotificationsList,
  AddNotificationForm,
  NotificationTabs,
  NotificationStats
} from '../components/notifications';

const Notifications: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    createNewNotification,
    createLoading,
    createError,
    createSuccess,
    clearErrors,
    clearSuccess
  } = useNotifications();

  const { notifications, loading, error } = useAppSelector((state) => state.notifications);

  const [activeTab, setActiveTab] = useState(t('notifications.allNotifications'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const mappedNotifications = notifications.map(notification => ({
    id: notification.id,
    title: notification.title[i18n.language as keyof typeof notification.title] || notification.title.ar,
    content: notification.description[i18n.language as keyof typeof notification.description] || notification.description.ar,
    type: (notification.type === 'APP_NOTIFICATION' ? 'system' : 'info') as 'system' | 'warning' | 'info',
    date: new Date(notification.createdAt).toLocaleDateString(
      i18n.language === 'ar' ? 'ar-EG' : i18n.language === 'ku' ? 'ku-IQ' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    ),
    category: notification.type === 'APP_NOTIFICATION'
      ? t('notifications.stats.system')
      : t('ads.tableHeader'),
    status: 'unread' as const,
    priority: 'medium' as const,
    recipient: t('notifications.stats.total')
  }));

  const [notificationForm, setNotificationForm] = useState({
    titleAr: '',
    titleEn: '',
    titleKu: '',
    descriptionAr: '',
    descriptionEn: '',
    descriptionKu: '',
    type: 'APP_NOTIFICATION' as 'APP_NOTIFICATION' | 'APP_ADS',
    image: '',
    startDate: '',
    endDate: ''
  });

  const handleFormChange = (field: string, value: string) => {
    setNotificationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData: CreateNotificationRequest = {
      title: {
        ar: notificationForm.titleAr,
        en: notificationForm.titleEn,
        ku: notificationForm.titleKu
      },
      description: {
        ar: notificationForm.descriptionAr,
        en: notificationForm.descriptionEn,
        ku: notificationForm.descriptionKu
      },
      type: notificationForm.type
    };

    if (notificationForm.image.trim()) {
      requestData.image = notificationForm.image;
    }

    if (notificationForm.type === 'APP_ADS') {
      if (notificationForm.startDate) {
        requestData.startDate = notificationForm.startDate;
      }
      if (notificationForm.endDate) {
        requestData.endDate = notificationForm.endDate;
      }
    }

    try {
      await createNewNotification(requestData);
      dispatch(showToast({ message: t('notifications.success.created'), type: 'success' }));

      setNotificationForm({
        titleAr: '',
        titleEn: '',
        titleKu: '',
        descriptionAr: '',
        descriptionEn: '',
        descriptionKu: '',
        type: 'APP_NOTIFICATION',
        image: '',
        startDate: '',
        endDate: ''
      });

      setActiveTab(t('notifications.allNotifications'));

      dispatch(fetchNotifications({
        page: currentPage,
        pageSize,
        type: 'APP_NOTIFICATION'
      }));
    } catch (error) {
      dispatch(showToast({ message: t('notifications.error.createFailed'), type: 'error' }));
    }
  };

  useEffect(() => {
    dispatch(fetchNotifications({
      page: currentPage,
      pageSize,
      type: 'APP_NOTIFICATION'
    }));
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    if (createError) {
      const timer = setTimeout(() => clearErrors(), 5000);
      return () => clearTimeout(timer);
    }
  }, [createError, clearErrors]);

  useEffect(() => {
    if (createSuccess) {
      const timer = setTimeout(() => clearSuccess(), 3000);
      return () => clearTimeout(timer);
    }
  }, [createSuccess, clearSuccess]);

  const tabs = [
    { name: t('notifications.allNotifications'), count: mappedNotifications.length },
    { name: t('notifications.addNew'), count: null }
  ];

  const notificationStats = {
    totalNotifications: mappedNotifications.length,
    unreadCount: mappedNotifications.filter(n => n.status === 'unread').length,
    highPriorityCount: mappedNotifications.filter(n => n.priority === 'medium').length,
    systemNotifications: mappedNotifications.filter(n => n.type === 'system').length
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === mappedNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(mappedNotifications.map(notif => notif.id));
    }
  };

  const handleDeleteSelected = () => {
    console.log('Delete selected notifications:', selectedNotifications);
    setSelectedNotifications([]);
  };

  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit notification:', id);
  };

  const handleView = (id: string) => {
    console.log('View notification:', id);
  };

  const handleResetForm = () => {
    setNotificationForm({
      titleAr: '',
      titleEn: '',
      titleKu: '',
      descriptionAr: '',
      descriptionEn: '',
      descriptionKu: '',
      type: 'APP_NOTIFICATION',
      image: '',
      startDate: '',
      endDate: ''
    });
  };

  const filteredNotifications = mappedNotifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('notifications.title')}</h1>
          <p className="text-gray-400 mt-1">{t('notifications.subtitle')}</p>
        </div>
        <button
          onClick={() => dispatch(fetchNotifications({
            page: currentPage,
            pageSize,
            type: 'APP_NOTIFICATION'
          }))}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {t('notifications.refreshButton')}
        </button>
      </div>

      <div className="bg-dark-300 rounded-xl p-6">
        <NotificationStats {...notificationStats} />

        <NotificationTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === t('notifications.allNotifications') && (
          <>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">{t('notifications.loading')}</p>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <p className="text-red-400">{t('notifications.error')}: {error}</p>
              </div>
            ) : (
              <NotificationsList
                notifications={filteredNotifications}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedNotifications={selectedNotifications}
                onSelectNotification={handleSelectNotification}
                onSelectAll={handleSelectAll}
                onDeleteSelected={handleDeleteSelected}
                onMarkAsRead={handleMarkAsRead}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={(id) => console.log('Delete', id)}
              />
            )}
          </>
        )}

        {activeTab === t('notifications.addNew') && (
          <AddNotificationForm
            formData={notificationForm}
            onFormChange={handleFormChange}
            onSubmit={handleCreateNotification}
            onReset={handleResetForm}
            loading={createLoading}
            error={createError}
          />
        )}
      </div>
    </div>
  );
};

export default Notifications;
