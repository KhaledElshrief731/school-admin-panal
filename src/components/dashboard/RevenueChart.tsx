import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useStats } from '../../hooks/useStats';
import { formatMonthlyUsersForChart, formatMonthlySubscriptionsForChart } from '../../utils/dateUtils';

type RevenueChartProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const RevenueChart: React.FC<RevenueChartProps> = ({ activeTab, onTabChange }) => {
  const { t, i18n } = useTranslation();
  const { 
    monthlyUsers, 
    monthlyUsersLoading, 
    monthlyUsersError,
    monthlySubscriptions,
    monthlySubscriptionsLoading,
    monthlySubscriptionsError
  } = useStats();
  
  // Format the data for the chart based on active tab
  const getChartData = () => {
    switch (activeTab) {
      case t('dashboard.users'):
        return monthlyUsers.length > 0 ? formatMonthlyUsersForChart(monthlyUsers, i18n.language) : [];
      case t('dashboard.subscriptions'):
        return monthlySubscriptions.length > 0 ? formatMonthlySubscriptionsForChart(monthlySubscriptions, i18n.language) : [];
      default:
        return monthlyUsers.length > 0 ? formatMonthlyUsersForChart(monthlyUsers, i18n.language) : [];
    }
  };

  const chartData = getChartData();
  const isLoading = monthlyUsersLoading || monthlySubscriptionsLoading;
  const hasError = monthlyUsersError || monthlySubscriptionsError;

  return (
    <div className="bg-dark-300 rounded-xl p-5 h-80">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">{t('dashboard.charts')}</h3>
        <div className="flex rounded-lg overflow-hidden">
          {[t('dashboard.monthly'), t('dashboard.users'), t('dashboard.subscriptions')].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 text-sm ${
                activeTab === tab
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-200 text-gray-400 hover:bg-dark-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {hasError && (
        <div className="flex items-center justify-center h-64">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {monthlyUsersError || monthlySubscriptionsError}
          </div>
        </div>
      )}
      
      {!isLoading && !hasError && (
        <ResponsiveContainer width="100%" height="80%">
          {activeTab === t('dashboard.subscriptions') ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
                domain={[0, 'dataMax + 1']}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1e31',
                  borderColor: '#374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Area
                type="monotone"
                dataKey="paid"
                stroke="#22c55e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPaid)"
                activeDot={{ r: 8 }}
                name={t('common.paid', 'مدفوع')}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPending)"
                activeDot={{ r: 8 }}
                name={t('common.pending', 'معلق')}
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4338ca" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4338ca" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af' }}
                domain={[0, 'dataMax + 1']}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1e31',
                  borderColor: '#374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4338ca"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;