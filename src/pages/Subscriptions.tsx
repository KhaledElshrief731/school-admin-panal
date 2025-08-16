import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, BarChart3, Settings } from 'lucide-react';
import {
  OverviewTab,
  SubscriptionsTab,
  CommissionsTab,
  PaymentsTab,
  SettingsTab
} from '../components/subscriptions';
import { useAppDispatch } from '../hooks/redux';
import { fetchUserSubscriptionsDashboard, fetchUserSubscriptionsStats } from '../store/slices/subscriptionSlice';
import { useTranslation } from 'react-i18next';

const Subscriptions: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const tabs = [
    { key: 'overview', label: t('subscriptions.overview'), icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'subscriptionsList', label: t('subscriptions.subscriptionsList'), icon: <CreditCard className="w-4 h-4" /> },
    { key: 'commissions', label: t('subscriptions.commissions'), icon: <DollarSign className="w-4 h-4" /> },
    { key: 'payments', label: t('subscriptions.payments'), icon: <Settings className="w-4 h-4" /> },
    { key: 'settings', label: t('subscriptions.settings'), icon: <Settings className="w-4 h-4" /> }
  ];

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchUserSubscriptionsDashboard({ page: 1, pageSize: 20 }));
    dispatch(fetchUserSubscriptionsStats());
  }, [dispatch]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'subscriptionsList':
        return <SubscriptionsTab />;
      case 'commissions':
        return <CommissionsTab />;
      case 'payments':
        return <PaymentsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary-500" />
            {t('subscriptions.title')}
          </h1>
          <p className="text-gray-400 mt-1">{t('subscriptions.subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-300 rounded-xl overflow-hidden">
        <div className="border-b border-dark-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-6 py-4 whitespace-nowrap font-medium transition-colors border-b-2
                  ${activeTab === tab.key
                    ? 'bg-dark-200 text-white border-primary-600'
                    : 'text-gray-400 hover:text-white hover:bg-dark-200/50 border-transparent'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
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

export default Subscriptions;
