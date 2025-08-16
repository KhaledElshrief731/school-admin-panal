import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, School, CreditCard, Clock } from 'lucide-react';
import { useStats } from '../../hooks/useStats';

interface StatsSummaryProps {
  showTitle?: boolean;
  className?: string;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ 
  showTitle = true, 
  className = "" 
}) => {
  const { t } = useTranslation();
  const { dashboardStats, loading, error } = useStats();

  if (error) {
    return (
      <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg ${className}`}>
        {error}
      </div>
    );
  }

  const stats = [
    {
      title: t('dashboard.totalUsers'),
      value: loading ? "..." : dashboardStats?.totalUsers?.toLocaleString() || "0",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: t('dashboard.totalSchools'),
      value: loading ? "..." : dashboardStats?.totalSchools?.toLocaleString() || "0",
      icon: <School className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: t('dashboard.activeSubscriptions'),
      value: loading ? "..." : dashboardStats?.subscriptions?.paid?.toLocaleString() || "0",
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: t('dashboard.pendingSubscriptions'),
      value: loading ? "..." : dashboardStats?.subscriptions?.pending?.toLocaleString() || "0",
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.statistics')}</h3>
          <p className="text-sm text-gray-600">{t('dashboard.overview')}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSummary; 