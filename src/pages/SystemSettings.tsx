import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GeneralTab, PaymentTab, SecurityTab, BackupTab } from '../components/system-setting';

const SystemSettings: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('العامة');

  const tabs = [
    'العامة',
    'المدفوعات',
    'الأمان',
    'النسخ الاحتياطي'
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'العامة':
        return <GeneralTab />;
      case 'المدفوعات':
        return <PaymentTab />;
      case 'الأمان':
        return <SecurityTab />;
      case 'النسخ الاحتياطي':
        return <BackupTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('pages.systemSettings')}</h1>
          <p className="text-gray-400 mt-1">{t('pages.systemSettingsSubtitle')}</p>
        </div>
      </div>

      <div className="bg-dark-300 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-dark-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 px-6 py-4 text-center font-medium transition-colors
                  ${activeTab === tab
                    ? 'bg-dark-200 text-white border-b-2 border-primary-600'
                    : 'text-gray-400 hover:text-white hover:bg-dark-200/50'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;