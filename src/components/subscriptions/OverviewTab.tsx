import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, LineChart, PieChart, BarChart3, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUserSubscriptionsStats } from '../../store/slices/subscriptionSlice';

const userGrowthData = [
  { month: 'يناير', users: 2000 },
  { month: 'فبراير', users: 1800 },
  { month: 'مارس', users: 1600 },
  { month: 'أبريل', users: 1400 },
  { month: 'مايو', users: 1200 },
  { month: 'يونيو', users: 1100 }
];

const subscriptionPlanData = [
  { name: 'فردي', value: 30, color: '#6366f1' },
  { name: 'مدرسية', value: 45, color: '#22c55e' },
  { name: 'مؤسسة', value: 15, color: '#f59e0b' },
  { name: 'مخصص', value: 10, color: '#ef4444' }
];

const revenueData = [
  { month: 'يناير', subscriptions: 4500, renewals: 2000 },
  { month: 'فبراير', users: 4200, renewals: 1800 },
  { month: 'مارس', subscriptions: 3900, renewals: 1600 },
  { month: 'أبريل', subscriptions: 4100, renewals: 1400 },
  { month: 'مايو', subscriptions: 3800, renewals: 1200 },
  { month: 'يونيو', subscriptions: 4000, renewals: 1300 }
];

const OverviewTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userSubscriptionsStats, userSubscriptionsStatsLoading, userSubscriptionsStatsError } = useAppSelector(state => state.subscription);

  useEffect(() => {
    dispatch(fetchUserSubscriptionsStats());
  }, [dispatch]);

  const statsCards = [
    {
      title: 'إجمالي الاشتراكات',
      subtitle: 'الاشتراكات النشطة',
      value: userSubscriptionsStats ? userSubscriptionsStats.total : '—',
      change: '+12.5%',
      isPositive: true,
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-blue-600'
    },
    {
      title: 'الإيرادات الشهرية',
      subtitle: 'القيمة الحالية',
      value: userSubscriptionsStats ? `${userSubscriptionsStats.monthlyTotalAmount} د.ج` : '—',
      change: '+8.3%',
      isPositive: true,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-600'
    },
    {
      title: 'المدفوعات المعلقة',
      subtitle: 'بحاجة للمراجعة',
      value: userSubscriptionsStats ? `${userSubscriptionsStats.monthlyPendingAmount} د.ج` : '—',
      change: '+5.2%',
      isPositive: false,
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-yellow-600'
    },
    {
      title: 'إجمالي العمولات',
      subtitle: 'المدفوعات الصادرة',
      value: '$12,345',
      change: '+15.7%',
      isPositive: true,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-purple-600'
    }
  ];

  const loading = userSubscriptionsStatsLoading;
  const error = userSubscriptionsStatsError;

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center h-16">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.color} rounded-xl p-6 text-white relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                {card.icon}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{card.value}</div>
                <div className="text-sm opacity-90">{card.title}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm flex items-center gap-1 ${card.isPositive ? 'text-green-200' : 'text-red-200'}`}>
                <TrendingUp className={`w-4 h-4 ${!card.isPositive ? 'rotate-180' : ''}`} />
                {card.change}
              </span>
              <span className="text-sm opacity-75">{card.subtitle}</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
          </motion.div>
        ))}
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="bg-dark-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">نمو المستخدمين</h3>
            <LineChart className="w-5 h-5 text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsLineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#6366f1' }} />
            </RechartsLineChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <span className="text-blue-400 text-sm">المستخدمين</span>
          </div>
        </div>
        {/* Subscription Plans Pie Chart */}
        <div className="bg-dark-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">الاشتراكات حسب الخطة</h3>
            <PieChart className="w-5 h-5 text-green-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie data={subscriptionPlanData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                {subscriptionPlanData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {subscriptionPlanData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-400">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
        {/* Revenue Chart */}
        <div className="bg-dark-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">الإيرادات عبر الزمن</h3>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="subscriptions" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="renewals" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-400">الاشتراكات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">التجديدات</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab; 