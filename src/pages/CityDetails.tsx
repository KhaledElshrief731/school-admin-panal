import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityById, updateCity, deleteCity } from '../store/slices/citySlice';
import type { RootState, AppDispatch } from '../store';
import { ArrowLeft } from 'lucide-react';
import DeleteCityModal from '../components/cities/DeleteCityModal';
import { countries } from '../components/cities/AddCityModal';

const CityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedCity, selectedCityLoading, selectedCityError, deleteLoading, deleteError } = useSelector((state: RootState) => state.city);

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
      const [key, sub] = name.split('.') as ['lessPricePerKilometer' | 'lessStudentFee', 'min' | 'max' | 'average'];
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
    if (id) {
      const payload = {
        ...formData,
        lessPricePerKilometer: {
          min: formData.lessPricePerKilometer?.min ?? 0,
          max: formData.lessPricePerKilometer?.max ?? 0,
          average: formData.lessPricePerKilometer?.average ?? 0,
        },
        lessStudentFee: {
          min: formData.lessStudentFee?.min ?? 0,
          max: formData.lessStudentFee?.max ?? 0,
          average: formData.lessStudentFee?.average ?? 0,
        },
      };
      await dispatch(updateCity({ id, data: payload }));
      setIsEditing(false);
    }
  };

  // Remove handleDelete, use modal instead

  if (selectedCityLoading) return <div className="p-6">جاري التحميل...</div>;
  if (selectedCityError) return <div className="p-6 text-red-500">{selectedCityError}</div>;
  if (!selectedCity) return <div className="p-6 text-gray-400">لا توجد بيانات لهذه المدينة</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/city')}
        className="flex items-center gap-2 text-gray-400 hover:text-primary-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        العودة
      </button>
      <div className="bg-dark-300 rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-2">
          {selectedCity.name}
          <span className="text-base font-normal text-gray-400">({selectedCity.nameEn})</span>
        </h1>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="bg-dark-400 rounded-lg px-4 py-2 text-sm text-gray-300">
            <span className="font-semibold text-primary-400">الدولة:</span> {countries.find((c: {id: string; name: string}) => c.id === selectedCity.countryId)?.name || selectedCity.countryId}
          </div>
          <div className="bg-dark-400 rounded-lg px-4 py-2 text-sm text-gray-300">
            <span className="font-semibold text-primary-400">تاريخ الإنشاء:</span> {new Date(selectedCity.createdAt).toLocaleDateString('ar-SA')}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-dark-400 rounded-lg p-4">
            <div className="text-gray-400 mb-1 font-semibold">سعر/كم</div>
            <div className="text-white text-lg font-bold">
              {selectedCity.lessPricePerKilometer?.min} - {selectedCity.lessPricePerKilometer?.max}
              <span className="text-xs text-gray-400 font-normal ml-2">(متوسط: {selectedCity.lessPricePerKilometer?.average})</span>
            </div>
          </div>
          <div className="bg-dark-400 rounded-lg p-4">
            <div className="text-gray-400 mb-1 font-semibold">رسوم طالب</div>
            <div className="text-white text-lg font-bold">
              {selectedCity.lessStudentFee?.min} - {selectedCity.lessStudentFee?.max}
              <span className="text-xs text-gray-400 font-normal ml-2">(متوسط: {selectedCity.lessStudentFee?.average})</span>
            </div>
          </div>
        </div>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-400 rounded-lg p-4">
                <label className="block text-gray-400 mb-1 font-semibold">سعر/كم (أقل)</label>
                <input
                  type="number"
                  name="lessPricePerKilometer.min"
                  value={formData.lessPricePerKilometer?.min ?? ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-dark-300 border border-dark-200 text-white"
                  step="any"
                  required
                />
                <label className="block text-gray-400 mb-1 font-semibold mt-2">سعر/كم (أعلى)</label>
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
                <label className="block text-gray-400 mb-1 font-semibold">رسوم طالب (أقل)</label>
                <input
                  type="number"
                  name="lessStudentFee.min"
                  value={formData.lessStudentFee?.min ?? ''}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-dark-300 border border-dark-200 text-white"
                  step="any"
                  required
                />
                <label className="block text-gray-400 mb-1 font-semibold mt-2">رسوم طالب (أعلى)</label>
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
              <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">حفظ التغييرات</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">إلغاء</button>
            </div>
          </form>
        ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-bold transition-colors ml-3"
              >
                تعديل
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
              >
                حذف
              </button>
            </>
          )}
      </div>
      <DeleteCityModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        city={selectedCity}
      />
    </div>
  );
};

export default CityDetails;
