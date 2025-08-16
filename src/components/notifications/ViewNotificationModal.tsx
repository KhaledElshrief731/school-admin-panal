import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, User, Tag } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationActions from './NotificationActions';

interface ViewNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationId: string | null;
}

const ViewNotificationModal: React.FC<ViewNotificationModalProps> = ({
  isOpen,
  onClose,
  notificationId
}) => {
  const { t, i18n } = useTranslation();
  const {
    selectedNotification,
    selectedNotificationLoading,
    selectedNotificationError,
    getNotificationById,
    clearSelectedNotificationData
  } = useNotifications();

  React.useEffect(() => {
    if (isOpen && notificationId) {
      getNotificationById(notificationId);
    }
  }, [isOpen, notificationId, getNotificationById]);

  React.useEffect(() => {
    if (!isOpen) {
      clearSelectedNotificationData();
    }
  }, [isOpen, clearSelectedNotificationData]);

  if (!isOpen) return null;

  const handleClose = () => {
    clearSelectedNotificationData();
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      i18n.language === 'ar' ? 'ar-EG' : i18n.language === 'ku' ? 'ku-IQ' : 'en-US',
      { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  const getCurrentLanguageContent = (content: { ar: string; en: string; ku: string }) => {
    const currentLang = i18n.language as 'ar' | 'en' | 'ku';
    return content[currentLang] || content.en || content.ar;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-300 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{t('common.view')} {t('notifications.title')}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {selectedNotificationLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {selectedNotificationError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <p className="text-red-400">{selectedNotificationError}</p>
          </div>
        )}

        {selectedNotification && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-dark-400 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600/20 rounded-lg">
                    <Bell className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {getCurrentLanguageContent(selectedNotification.title)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {selectedNotification.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(selectedNotification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <NotificationActions
                  notificationId={selectedNotification.id}
                  showViewButton={false}
                  size="sm"
                />
              </div>
            </div>

            {/* Content */}
            <div className="bg-dark-400 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">{t('notifications.description')}</h4>
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {getCurrentLanguageContent(selectedNotification.description)}
              </p>
            </div>

            {/* Image */}
            {selectedNotification.image && (
              <div className="bg-dark-400 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">{t('table.image')}</h4>
                <img
                  src={selectedNotification.image}
                  alt="Notification"
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Dates for APP_ADS */}
            {selectedNotification.type === 'APP_ADS' && (selectedNotification.startDate || selectedNotification.endDate) && (
              <div className="bg-dark-400 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">{t('notifications.schedule', 'الجدولة')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedNotification.startDate && (
                    <div>
                      <span className="text-xs text-gray-400">{t('notifications.startDate')}</span>
                      <p className="text-white">{formatDate(selectedNotification.startDate)}</p>
                    </div>
                  )}
                  {selectedNotification.endDate && (
                    <div>
                      <span className="text-xs text-gray-400">{t('notifications.endDate')}</span>
                      <p className="text-white">{formatDate(selectedNotification.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Multi-language Content */}
            <div className="bg-dark-400 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">{t('notifications.allLanguages', 'جميع اللغات')}</h4>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400">{t('notifications.titleArabic')}</span>
                  <p className="text-white">{selectedNotification.title.ar}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">{t('notifications.titleEnglish')}</span>
                  <p className="text-white">{selectedNotification.title.en}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">{t('notifications.titleKurdish')}</span>
                  <p className="text-white">{selectedNotification.title.ku}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNotificationModal;