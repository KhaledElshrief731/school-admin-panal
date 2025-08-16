import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, Tag } from 'lucide-react';
import { useAds } from '../../hooks/useAds';
import AdActions from './AdActions';

interface ViewAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string | null;
}

const ViewAdModal: React.FC<ViewAdModalProps> = ({
  isOpen,
  onClose,
  adId
}) => {
  const { t, i18n } = useTranslation();
  const {
    selectedAd,
    selectedAdLoading,
    selectedAdError,
    getAdById,
    clearSelectedAdData
  } = useAds();

  React.useEffect(() => {
    if (isOpen && adId) {
      getAdById(adId);
    }
  }, [isOpen, adId, getAdById]);

  React.useEffect(() => {
    if (!isOpen) {
      clearSelectedAdData();
    }
  }, [isOpen, clearSelectedAdData]);

  if (!isOpen) return null;

  const handleClose = () => {
    clearSelectedAdData();
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
          <h2 className="text-xl font-semibold text-white">{t('common.view')} {t('ads.tableHeader')}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {selectedAdLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {selectedAdError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <p className="text-red-400">{selectedAdError}</p>
          </div>
        )}

        {selectedAd && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-dark-400 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600/20 rounded-lg">
                    <Tag className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {getCurrentLanguageContent(selectedAd.title)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {selectedAd.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(selectedAd.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <AdActions
                  adId={selectedAd.id}
                  showViewButton={false}
                  size="sm"
                />
              </div>
            </div>

            {/* Content */}
            <div className="bg-dark-400 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">{t('ads.modal.description')}</h4>
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {getCurrentLanguageContent(selectedAd.description)}
              </p>
            </div>

            {/* Image */}
            {selectedAd.image && (
              <div className="bg-dark-400 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">{t('ads.modal.image')}</h4>
                <img
                  src={selectedAd.image}
                  alt="Ad"
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Dates */}
            {(selectedAd.startDate || selectedAd.endDate) && (
              <div className="bg-dark-400 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">{t('ads.schedule', 'الجدولة')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedAd.startDate && (
                    <div>
                      <span className="text-xs text-gray-400">{t('ads.modal.startDate')}</span>
                      <p className="text-white">{formatDate(selectedAd.startDate)}</p>
                    </div>
                  )}
                  {selectedAd.endDate && (
                    <div>
                      <span className="text-xs text-gray-400">{t('ads.modal.endDate')}</span>
                      <p className="text-white">{formatDate(selectedAd.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Multi-language Content */}
            <div className="bg-dark-400 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">{t('ads.allLanguages', 'جميع اللغات')}</h4>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-400">{t('ads.modal.titleAr')}</span>
                  <p className="text-white">{selectedAd.title.ar}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">{t('ads.modal.titleEn')}</span>
                  <p className="text-white">{selectedAd.title.en}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">{t('ads.modal.titleKu')}</span>
                  <p className="text-white">{selectedAd.title.ku}</p>
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

export default ViewAdModal;