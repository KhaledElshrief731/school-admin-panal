import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Eye, MousePointer, Clock, AlertCircle } from 'lucide-react';
import { Ad } from '../../types/ads';

interface AdsStatsProps {
  ads: Ad[];
}

const AdsStats: React.FC<AdsStatsProps> = ({ ads }) => {
  const { t } = useTranslation();

  const calculateStats = () => {
    const now = new Date();
    
    const activeAds = ads.filter(ad => {
      const start = new Date(ad.startDate);
      const end = new Date(ad.endDate);
      return now >= start && now <= end;
    }).length;

    const scheduledAds = ads.filter(ad => {
      const start = new Date(ad.startDate);
      return now < start;
    }).length;

    const expiredAds = ads.filter(ad => {
      const end = new Date(ad.endDate);
      return now > end;
    }).length;

    const totalAds = ads.length;

    return {
      totalAds,
      activeAds,
      scheduledAds,
      expiredAds,
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: t('ads.stats.totalAds'),
      value: stats.totalAds,
      icon: BarChart3,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
    },
    {
      title: t('ads.stats.activeAds'),
      value: stats.activeAds,
      icon: Eye,
      color: 'bg-green-500',
      textColor: 'text-green-500',
    },
    {
      title: t('ads.stats.scheduledAds'),
      value: stats.scheduledAds,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
    },
    {
      title: t('ads.stats.expiredAds'),
      value: stats.expiredAds,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-dark-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-white">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdsStats;
