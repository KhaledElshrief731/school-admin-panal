import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createAd, clearCreateError } from '../../store/slices/adsSlice';
import { showToast } from '../../store/slices/toastSlice';
import { CreateAd } from '../../types/ads';

interface AddAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAdModal: React.FC<AddAdModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { createLoading, createError } = useSelector((state: RootState) => state.ads);

  const [formData, setFormData] = useState<CreateAd>({
    title: { ar: '', en: '', ku: '' },
    description: { ar: '', en: '', ku: '' },
    type: 'APP_ADS',
    image: '',
    startDate: '',
    endDate: '',
  });
  // 👇 Updated helper function (at the top or where it's defined)
  const formatToDatetimeLocal = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };


  const currentLanguage = i18n.language as 'ar' | 'en' | 'ku';

  const handleInputChange = (field: keyof CreateAd, lang?: string, value?: string) => {
    if (lang && (field === 'title' || field === 'description')) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value || ''
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.ar || !formData.title.en || !formData.title.ku) {
      dispatch(showToast({
        message: t('ads.validation.titleRequired'),
        type: 'error'
      }));
      return;
    }

    if (!formData.description.ar || !formData.description.en || !formData.description.ku) {
      dispatch(showToast({
        message: t('ads.validation.descriptionRequired'),
        type: 'error'
      }));
      return;
    }

    // Removed date validation as per user's request - dates are now optional

    try {
      // Convert dates to ISO format if they exist
      const adDataToSend = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };

      await dispatch(createAd(adDataToSend)).unwrap();

      // Show success toast
      dispatch(showToast({
        message: t('ads.success.created'),
        type: 'success'
      }));

      onClose();
      setFormData({
        title: { ar: '', en: '', ku: '' },
        description: { ar: '', en: '', ku: '' },
        type: 'APP_ADS',
        image: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      // Error is handled by Redux, but we can show a generic error toast
      dispatch(showToast({
        message: t('ads.error.createFailed'),
        type: 'error'
      }));
    }
  };

  const handleClose = () => {
    dispatch(clearCreateError());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-300 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{t('ads.modal.createTitle')}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">{t('ads.modal.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('ads.modal.titleAr')}
                </label>
                <input
                  type="text"
                  value={formData.title.ar}
                  onChange={(e) => handleInputChange('title', 'ar', e.target.value)}
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('ads.modal.titleArPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('ads.modal.titleEn')}
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => handleInputChange('title', 'en', e.target.value)}
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('ads.modal.titleEnPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('ads.modal.titleKu')}
                </label>
                <input
                  type="text"
                  value={formData.title.ku}
                  onChange={(e) => handleInputChange('title', 'ku', e.target.value)}
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('ads.modal.titleKuPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Description Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">{t('ads.modal.description')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('ads.modal.descriptionAr')}
                </label>
                <textarea
                  value={formData.description.ar}
                  onChange={(e) => handleInputChange('description', 'ar', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={t('ads.modal.descriptionArPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('ads.modal.descriptionEn')}
                </label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => handleInputChange('description', 'en', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={t('ads.modal.descriptionEnPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('ads.modal.descriptionKu')}
                </label>
                <textarea
                  value={formData.description.ku}
                  onChange={(e) => handleInputChange('description', 'ku', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={t('ads.modal.descriptionKuPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Image Field */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('ads.modal.image')}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => handleInputChange('image', undefined, e.target.value)}
                className="flex-1 px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('ads.modal.imagePlaceholder')}
              />
              <button
                type="button"
                className="px-4 py-2 bg-dark-200 text-gray-300 rounded-lg hover:bg-dark-100 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {t('ads.modal.upload')}
              </button>
            </div>
          </div> */}
          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('ads.modal.startDate')}
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={formatToDatetimeLocal(formData.startDate)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('ads.modal.endDate')}
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={formatToDatetimeLocal(formData.endDate)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-dark-200 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {createError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{createError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-300 bg-dark-200 rounded-lg hover:bg-dark-100 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {createLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('common.creating')}
                </>
              ) : (
                t('ads.modal.create')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdModal;
