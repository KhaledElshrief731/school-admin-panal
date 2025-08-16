import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchSchoolById, updateSchool, clearUpdateError } from '../store/slices/schoolSlices';
import type { RootState, AppDispatch } from '../store';
import DeleteSchoolModal from '../components/schools/DeleteSchoolModal';
import { ArrowLeft, Edit, Save, X, Trash2 } from 'lucide-react';

const SchoolDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSchool, selectedSchoolLoading, selectedSchoolError, updateLoading, updateError } = useSelector(
    (state: RootState) => state.school
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    address: '',
    latitude: 0,
    longitude: 0,
    cityId: '',
    countryId: '',
  });

  useEffect(() => {
    if (id) dispatch(fetchSchoolById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedSchool) {
      setFormData({
        name: selectedSchool.name || '',
        nameEn: selectedSchool.nameEn || '',
        address: selectedSchool.address || '',
        latitude: selectedSchool.latitude || 0,
        longitude: selectedSchool.longitude || 0,
        cityId: selectedSchool.cityId || '',
        countryId: selectedSchool.countryId || '',
      });
    }
  }, [selectedSchool]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await dispatch(updateSchool({ id, data: formData }));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    dispatch(clearUpdateError());
    if (selectedSchool) {
      setFormData({
        name: selectedSchool.name || '',
        nameEn: selectedSchool.nameEn || '',
        address: selectedSchool.address || '',
        latitude: selectedSchool.latitude || 0,
        longitude: selectedSchool.longitude || 0,
        cityId: selectedSchool.cityId || '',
        countryId: selectedSchool.countryId || '',
      });
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  if (selectedSchoolLoading) return (
    <div className="p-6">
      <div className="bg-dark-300 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-dark-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  if (selectedSchoolError) return (
    <div className="p-6">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <p className="text-red-400">{t('school.details.error')}: {selectedSchoolError}</p>
      </div>
    </div>
  );
  
  if (!selectedSchool) return (
    <div className="p-6">
      <div className="bg-dark-300 rounded-xl p-6 text-center">
        <p className="text-gray-400">{t('school.details.noData')}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/school')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('school.details.back')}
          </button>
          <h1 className="text-2xl font-bold text-white">{selectedSchool.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
                {t('school.details.edit')}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t('school.details.delete')}
              </button>
            </>
          )}
        </div>
      </div>

      {updateError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">{updateError}</p>
        </div>
      )}

      {isEditing ? (
        <div className="bg-dark-300 rounded-xl p-6">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('school.form.cityId')}
                </label>
                <input
                  type="text"
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder={t('school.form.enterCityId')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('school.form.countryId')}
                </label>
                <input
                  type="text"
                  name="countryId"
                  value={formData.countryId}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder={t('school.form.enterCountryId')}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-dark-200">
              <button
                type="submit"
                disabled={updateLoading}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {updateLoading ? t('school.details.saving') : t('school.details.saveChanges')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                {t('school.details.cancel')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-dark-300 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">{t('school.details.schoolInfo')}</h3>
              <div className="space-y-4">
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('school.details.nameAr')}:</span>
                  <p className="font-medium text-white">{selectedSchool.name}</p>
                </div>
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('school.details.nameEn')}:</span>
                  <p className="font-medium text-white">{selectedSchool.nameEn}</p>
                </div>
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('school.details.address')}:</span>
                  <p className="font-medium text-white">{selectedSchool.address}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">{t('school.details.geographicLocation')}</h3>
              <div className="space-y-4">
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('school.details.latitude')}:</span>
                  <p className="font-medium text-white">{selectedSchool.latitude}</p>
                </div>
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('school.details.longitude')}:</span>
                  <p className="font-medium text-white">{selectedSchool.longitude}</p>
                </div>
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('school.details.placeId')}:</span>
                  <p className="font-medium text-gray-300 text-sm">{selectedSchool.placeId}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-dark-200">
            <h3 className="text-lg font-semibold mb-4 text-white">{t('school.details.additionalInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-b border-dark-200 pb-3">
                <span className="text-sm text-gray-400 block mb-1">{t('school.details.cityId')}:</span>
                <p className="font-medium text-gray-300 text-sm">{selectedSchool.cityId}</p>
              </div>
              <div className="border-b border-dark-200 pb-3">
                <span className="text-sm text-gray-400 block mb-1">{t('school.details.countryId')}:</span>
                <p className="font-medium text-gray-300 text-sm">{selectedSchool.countryId}</p>
              </div>
              <div className="border-b border-dark-200 pb-3">
                <span className="text-sm text-gray-400 block mb-1">{t('school.details.creationDate')}:</span>
                <p className="font-medium text-gray-300 text-sm">{new Date(selectedSchool.createdAt).toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteSchoolModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        school={selectedSchool}
      />
    </div>
  );
};

export default SchoolDetails;
