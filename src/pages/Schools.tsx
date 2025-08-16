import React from 'react';
import { useTranslation } from 'react-i18next';

const Schools: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('pages.schoolsManagement')}</h1>
      <div className="bg-dark-300 rounded-lg p-6">
        <p className="text-gray-400">{t('pages.schoolsSubtitle')}</p>
      </div>
    </div>
  );
};

export default Schools;