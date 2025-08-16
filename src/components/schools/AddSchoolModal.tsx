import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSchool, clearCreateError } from '../../store/slices/schoolSlices';
import { fetchCountries } from '../../store/slices/countriesSlice';
import { fetchCities } from '../../store/slices/citySlice';
import type { RootState, AppDispatch } from '../../store';
import { X, Plus, Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { showToast } from '../../store/slices/toastSlice';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { createLoading, createError } = useSelector((state: RootState) => state.school);
  const { countries } = useSelector((state: RootState) => state.countries);
  const { cities } = useSelector((state: RootState) => state.city);

  useEffect(() => {
    if (isOpen && countries.length === 0) {
      dispatch(fetchCountries());
    }
    if (isOpen && cities.length === 0) {
      dispatch(fetchCities({ page: 1, pageSize: 100 }));
    }
  }, [isOpen, countries.length, dispatch, cities.length]);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    address: '',
    latitude: 0,
    longitude: 0,
    cityId: '',
    countryId: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createSchool(formData));
    if (!createError) {
      dispatch(showToast({ message: t('notifications.schoolCreatedSuccess'), type: "success" }));
      setFormData({
        name: '',
        nameEn: '',
        address: '',
        latitude: 0,
        longitude: 0,
        cityId: '',
        countryId: '',
      });
      onClose();
    } else {
      dispatch(showToast({ message: t('notifications.schoolCreatedError'), type: "error" }));
    }
  };

  const handleClose = () => {
    dispatch(clearCreateError());
    setFormData({
      name: '',
      nameEn: '',
      address: '',
      latitude: 0,
      longitude: 0,
      cityId: '',
      countryId: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('school.form.title')}>
      {createError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{createError}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('school.form.nameAr')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder={t('school.form.enterNameAr')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('school.form.nameEn')}
            </label>
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder={t('school.form.enterNameEn')}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('school.form.address')}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder={t('school.form.enterAddress')}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('school.form.latitude')}
            </label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder={t('school.form.enterLatitude')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('school.form.longitude')}
            </label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder={t('school.form.enterLongitude')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('school.form.countryId')}</label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white"
              required
            >
              <option value="">{t('school.form.selectCountry')}</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('school.form.cityId')}</label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white"
              required
            >
              <option value="">{t('school.form.selectCity')}</option>
              {cities
                .filter(city => !formData.countryId || city.countryId === formData.countryId)
                .map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-dark-200">
          <button
            type="submit"
            disabled={createLoading}
            className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {createLoading ? t('school.form.adding') : t('school.form.addSchool')}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSchoolModal; 