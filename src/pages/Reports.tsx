import React from 'react';
import { useTranslation } from 'react-i18next';

const Reports: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('pages.reportsPage')}</h1>
      <div className="bg-dark-300 rounded-lg p-6">
        <p className="text-gray-400">{t('pages.reportsSubtitle')}</p>
      </div>
    </div>
  );
};

export default Reports;