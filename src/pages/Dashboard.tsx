import React, { useState } from 'react';
import { Users, School, CreditCard, Award, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import QuickAccess from '../components/dashboard/QuickAccess';
import { motion } from 'framer-motion';
import { useStats } from '../hooks/useStats';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(t('dashboard.monthly'));
  const { dashboardStats, loading, error, refreshStats } = useStats();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-gray-400 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={refreshStats}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {t('dashboard.refresh')}
          </button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('dashboard.totalUsers')}
          value={loading ? "..." : dashboardStats?.totalUsers?.toLocaleString() || "0"}
          icon={<Users className="h-5 w-5 text-white" />}
          percentageChange={8}
          color="primary"
        />
        <StatsCard
          title={t('dashboard.totalSchools')}
          value={loading ? "..." : dashboardStats?.totalSchools?.toLocaleString() || "0"}
          icon={<School className="h-5 w-5 text-white" />}
          percentageChange={5}
          color="secondary"
        />
        <StatsCard
          title={t('dashboard.activeSubscriptions')}
          value={loading ? "..." : dashboardStats?.subscriptions?.paid?.toLocaleString() || "0"}
          icon={<CreditCard className="h-5 w-5 text-white" />}
          percentageChange={-3}
          color="accent"
        />
        <StatsCard
          title={t('dashboard.pendingSubscriptions')}
          value={loading ? "..." : dashboardStats?.subscriptions?.pending?.toLocaleString() || "0"}
          icon={<Award className="h-5 w-5 text-white" />}
          percentageChange={12}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RevenueChart 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
        <QuickAccess />
      </div>
    </div>
  );
};

export default Dashboard;