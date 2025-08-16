import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolById, updateSchool, clearUpdateError } from '../../store/slices/schoolSlices';
import { showToast } from '../../store/slices/toastSlice';
import type { RootState, AppDispatch } from '../../store';
import DeleteSchoolModal from '../../components/schools/DeleteSchoolModal';
import { ArrowLeft, Edit, Save, X, Trash2 } from 'lucide-react';

const SchoolDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSchool, selectedSchoolLoading, selectedSchoolError, updateLoading, updateError } = useSelector(
    (state: RootState) => state.school
  );
  const countries = useSelector((state: RootState) => state.countries.countries);
  const cities = useSelector((state: RootState) => state.city.cities);

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
      const result = await dispatch(updateSchool({ id, data: formData }));
      if (updateSchool.fulfilled.match(result)) {
        dispatch(showToast({ message: t('schools.saveSuccess'), type: 'success' }));
        setIsEditing(false);
      }
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
        <p className="text-red-400">{t('error')}: {selectedSchoolError}</p>
      </div>
    </div>
  );

  if (!selectedSchool) return (
    <div className="p-6">
      <div className="bg-dark-300 rounded-xl p-6 text-center">
        <p className="text-gray-400">{t('schools.noData')}</p>
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
            {t('common.back')}
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
                {t('common.edit')}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t('common.delete')}
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
                  {t('schools.schoolNameAr')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500"
                  placeholder={t('schools.enterSchoolNameAr')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('schools.schoolNameEn')}
                </label>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500"
                  placeholder={t('schools.enterSchoolNameEn')}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('schools.address')}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500"
                  placeholder={t('schools.enterAddress')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('schools.latitude')}
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500"
                  placeholder={t('schools.enterLatitude')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('schools.longitude')}
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white placeholder-gray-500"
                  placeholder={t('schools.enterLongitude')}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-dark-200">
              <button
                type="submit"
                disabled={updateLoading}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateLoading ? t('schools.saving') : t('schools.saveChanges')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-dark-300 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">{t('schools.schoolInfo')}</h3>
              <div className="space-y-4">
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('schools.schoolNameAr')}:</span>
                  <p className="font-medium text-white">{selectedSchool.name}</p>
                </div>
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('schools.schoolNameEn')}:</span>
                  <p className="font-medium text-white">{selectedSchool.nameEn}</p>
                </div>
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('schools.address')}:</span>
                  <p className="font-medium text-white">{selectedSchool.address}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">{t('schools.geographicLocation')}</h3>
              <div className="space-y-4">
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('schools.latitude')}:</span>
                  <p className="font-medium text-white">{selectedSchool.latitude}</p>
                </div>
                <div className="border-b border-dark-200 pb-3">
                  <span className="text-sm text-gray-400 block mb-1">{t('schools.longitude')}:</span>
                  <p className="font-medium text-white">{selectedSchool.longitude}</p>
                </div>
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
