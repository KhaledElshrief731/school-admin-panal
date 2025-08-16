import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCountries } from '../store/slices/countriesSlice';
import type { RootState, AppDispatch } from '../store';

const Country: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { countries, loading, error } = useSelector((state: RootState) => state.countries);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('pages.countryPage')}</h1>
      {loading && <p className="text-gray-400">جاري التحميل...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <ul className="space-y-2">
          {countries.map((country) => (
            <li key={country.id} className="bg-dark-200 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:gap-4">
              <span className="font-bold text-lg">{country.name}</span>
              <span className="text-gray-400 text-sm">{country.nameEn}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Country; 