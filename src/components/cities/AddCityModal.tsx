import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCity } from '../../store/slices/citySlice';
import { fetchCountries } from '../../store/slices/countriesSlice';
import type { RootState, AppDispatch } from '../../store';
import { X, Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { showToast } from '../../store/slices/toastSlice';

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCityModal: React.FC<AddCityModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { createLoading, createError } = useSelector((state: RootState) => state.city);
  const { countries } = useSelector((state: RootState) => state.countries);

  useEffect(() => {
    if (isOpen && countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [isOpen, countries.length, dispatch]);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    countryId: '',
    lessPricePerKilometer: { min: 0, max: 0 },
    lessStudentFee: { min: 0, max: 0 },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('lessPricePerKilometer.') || name.startsWith('lessStudentFee.')) {
      const [key, sub] = name.split('.') as ['lessPricePerKilometer' | 'lessStudentFee', 'min' | 'max'];
      setFormData((prev) => ({
        ...prev,
        [key]: { ...prev[key], [sub]: Number(value) }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      nameEn: formData.nameEn,
      countryId: formData.countryId,
      lessPricePerKilometer: {
        min: formData.lessPricePerKilometer.min,
        max: formData.lessPricePerKilometer.max,
        average: 0,
      },
      lessStudentFee: {
        min: formData.lessStudentFee.min,
        max: formData.lessStudentFee.max,
        average: 0,
      },
    };
    await dispatch(createCity(payload));
    if (!createError) {
      dispatch(showToast({ message: "تمت إضافة المدينة بنجاح", type: "success" }));
      setFormData({
        name: '',
        nameEn: '',
        countryId: '',
        lessPricePerKilometer: { min: 0, max: 0 },
        lessStudentFee: { min: 0, max: 0 },
      });
      onClose();
    } else {
      dispatch(showToast({ message: "حدث خطأ أثناء الإضافة", type: "error" }));
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة مدينة جديدة">
      {createError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{createError}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">اسم المدينة (عربي) *</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">اسم المدينة (إنجليزي) *</label>
            <input type="text" name="nameEn" value={formData.nameEn} onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">الدولة</label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleInputChange}
              className="w-full p-3 bg-dark-400 border border-dark-200 rounded-lg text-white"
            >
              <option value="">اختر الدولة</option>
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">سعر/كم (أقل/أعلى)</label>
            <div className="flex gap-2">
              <input type="number" name="lessPricePerKilometer.min" value={formData.lessPricePerKilometer.min}
                onChange={handleInputChange} className="w-1/2 p-2 bg-dark-400 border border-dark-200 rounded-lg text-white" placeholder="أقل" />
              <input type="number" name="lessPricePerKilometer.max" value={formData.lessPricePerKilometer.max}
                onChange={handleInputChange} className="w-1/2 p-2 bg-dark-400 border border-dark-200 rounded-lg text-white" placeholder="أعلى" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">رسوم طالب (أقل/أعلى)</label>
            <div className="flex gap-2">
              <input type="number" name="lessStudentFee.min" value={formData.lessStudentFee.min}
                onChange={handleInputChange} className="w-1/2 p-2 bg-dark-400 border border-dark-200 rounded-lg text-white" placeholder="أقل" />
              <input type="number" name="lessStudentFee.max" value={formData.lessStudentFee.max}
                onChange={handleInputChange} className="w-1/2 p-2 bg-dark-400 border border-dark-200 rounded-lg text-white" placeholder="أعلى" />
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6 border-t border-dark-200">
          <button type="submit" disabled={createLoading}
            className="flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors">
            <Save className="w-4 h-4" />
            {createLoading ? 'جاري الإضافة...' : 'إضافة المدينة'}
          </button>
          <button type="button" onClick={onClose}
            className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
            <X className="w-4 h-4" />
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCityModal;
