import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityById, updateCity } from '../../store/slices/citySlice';
import type { RootState, AppDispatch } from '../../store';
import { ArrowLeft } from 'lucide-react';
import DeleteCityModal from '../../components/cities/DeleteCityModal';
import { showToast } from '../../store/slices/toastSlice';

const CityDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedCity, selectedCityLoading, selectedCityError } = useSelector((state: RootState) => state.city);
  const { countries } = useSelector((state: RootState) => state.countries);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...selectedCity });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchCityById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedCity) setFormData({ ...selectedCity });
  }, [selectedCity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('lessPricePerKilometer.') || name.startsWith('lessStudentFee.')) {
      const [key, sub] = name.split('.') as ['lessPricePerKilometer' | 'lessStudentFee', 'min' | 'max'];
      setFormData(prev => ({
        ...prev,
        [key]: { ...prev[key], [sub]: Number(value) },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      const payload = {
        lessPricePerKilometer: {
          min: formData.lessPricePerKilometer?.min ?? 0,
          max: formData.lessPricePerKilometer?.max ?? 0,
        },
        lessStudentFee: {
          min: formData.lessStudentFee?.min ?? 0,
          max: formData.lessStudentFee?.max ?? 0,
        },
      };
      const result = await dispatch(updateCity({ id, data: payload }));
      if (updateCity.fulfilled.match(result)) {
        dispatch(showToast({ message: t('common.updatedSuccessfully'), type: 'success' }));
        setIsEditing(false);
      }
    }
  };

  if (selectedCityLoading) return <div className="p-6">{t('common.loading')}</div>;
  if (selectedCityError) return <div className="p-6 text-red-500">{selectedCityError}</div>;
  if (!selectedCity) return <div className="p-6 text-gray-400">{t('common.noData')}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/city')}
        className="flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        {t('common.back')}
      </button>

      <div className="bg-dark-300 rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-2">
          {selectedCity.name}
          <span className="text-base font-normal text-gray-400">({selectedCity.nameEn})</span>
        </h1>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-dark-400 rounded-lg p-4">
            <div className="text-gray-400 mb-1 font-semibold">{t('cities.pricePerKm')}</div>
            <div className="text-white text-lg font-bold">
              {selectedCity.lessPricePerKilometer?.min} - {selectedCity.lessPricePerKilometer?.max}
            </div>
          </div>
          <div className="bg-dark-400 rounded-lg p-4">
            <div className="text-gray-400 mb-1 font-semibold">{t('cities.studentFee')}</div>
            <div className="text-white text-lg font-bold">
              {selectedCity.lessStudentFee?.min} - {selectedCity.lessStudentFee?.max}
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-400 rounded-lg p-4">
                <label className="block text-gray-400 mb-1 font-semibold">
                  {t('cities.pricePerKm')} ({t('cities.min')})
                </label>
                <input
                  type="number"
                  name="lessPricePerKilometer.min"
                  value={formData.lessPricePerKilometer?.min ?? ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-dark-300 border border-dark-200 text-white"
                  step="any"
                  required
                />
                <label className="block text-gray-400 mb-1 font-semibold mt-2">
                  {t('cities.pricePerKm')} ({t('cities.max')})
                </label>
                <input
                  type="number"
                  name="lessPricePerKilometer.max"
                  value={formData.lessPricePerKilometer?.max ?? ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-dark-300 border border-dark-200 text-white"
                  step="any"
                  required
                />
              </div>

              <div className="bg-dark-400 rounded-lg p-4">
                <label className="block text-gray-400 mb-1 font-semibold">
                  {t('cities.studentFee')} ({t('cities.min')})
                </label>
                <input
                  type="number"
                  name="lessStudentFee.min"
                  value={formData.lessStudentFee?.min ?? ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-dark-300 border border-dark-200 text-white"
                  step="any"
                  required
                />
                <label className="block text-gray-400 mb-1 font-semibold mt-2">
                  {t('cities.studentFee')} ({t('cities.max')})
                </label>
                <input
                  type="number"
                  name="lessStudentFee.max"
                  value={formData.lessStudentFee?.max ?? ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-dark-300 border border-dark-200 text-white"
                  step="any"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                {t('common.saveChanges')}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-bold transition-colors m-3"
            >
              {t('common.edit')}
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              {t('cities.deleteCity')}
            </button>
          </>
        )}
      </div>

      <DeleteCityModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        city={selectedCity}
      />
    </div>
  );
};

export default CityDetails;
