import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCities} from '../../store/slices/citySlice';
import type { RootState, AppDispatch } from '../../store';
import type { City as CityType } from '../../store/slices/citySlice';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddCityModal from '../../components/cities/AddCityModal';
import DeleteCityModal from '../../components/cities/DeleteCityModal';

const City: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { cities, loading, error } = useSelector((state: RootState) => state.city);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCityForDelete, setSelectedCityForDelete] = useState<CityType | null>(null);

  useEffect(() => {
    dispatch(fetchCities({ page: 1, pageSize: 10 }));
  }, [dispatch]);


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{t('pages.cityPage')}</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('cities.addCity')}
        </button>
      </div>
      {loading && <p className="text-gray-400">{t('common.loading')}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <ul className="space-y-2">
          {cities.map((city: CityType) => (
            <li key={city.id} className="bg-dark-200 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:gap-4">
              <span className="font-bold text-lg">{city.name}</span>
              <span className="text-gray-400 text-sm">{city.nameEn}</span>
              <button
                className="ml-auto text-primary-500 hover:text-primary-700"
                title="عرض التفاصيل"
                onClick={() => navigate(`/city/${city.id}`)}
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => {
                  setSelectedCityForDelete(city);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <AddCityModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <DeleteCityModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCityForDelete(null);
        }}
        city={selectedCityForDelete}
      />
    </div>
  );
};

export default City; 