import React from 'react';
import { useTranslation } from 'react-i18next';

interface Tab {
  name: string;
  count: number | null;
}

interface NotificationTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

const NotificationTabs: React.FC<NotificationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 mb-6 border-b border-dark-200 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabChange(tab.name)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === tab.name
              ? 'bg-primary-600 text-white'
              : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
          }`}
        >
          <span>{tab.name}</span>
          {tab.count !== null && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default NotificationTabs;