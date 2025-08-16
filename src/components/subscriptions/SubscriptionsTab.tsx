import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import Table, { TableColumn } from '../ui/Table';
import StatusBadge from '../ui/StatusBadge';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUserSubscriptionsDashboard } from '../../store/slices/subscriptionSlice';
import { useEffect } from 'react';

const SubscriptionsTab: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    userSubscriptionsDashboard,
    userSubscriptionsDashboardLoading,
    userSubscriptionsDashboardError,
    userSubscriptionsDashboardTotalItems,
  } = useAppSelector(state => state.subscription);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const statusMap = {
    "نشط": "PAID",
    "معلق": "PENDING",
    "منتهي": "EXPIRED"
  };

  const handleFilterChange = () => {
    dispatch(fetchUserSubscriptionsDashboard({
      page: 1,
      pageSize: 20,
      userName: searchTerm || undefined,
      paidStatus: statusFilter !== 'الكل' ? statusMap[statusFilter as keyof typeof statusMap] : undefined,
      createdAtFrom: dateRange.start || undefined,
      createdAtTo: dateRange.end || undefined,
    }));
  };

  // استدعِ handleFilterChange عند تغيير أي فلتر
  useEffect(() => {
    handleFilterChange();
  }, [searchTerm, statusFilter, dateRange]);

  const subscriptionsData = userSubscriptionsDashboard.map(item => ({
    id: item.id,
    subscriber: item.user?.userName || '',
    plan: item.subscription?.type || '',
    status: item.paidStatus === 'PAID' ? 'نشط' : item.paidStatus === 'PENDING' ? 'معلق' : 'منتهي',
    startDate: item.startDate ? new Date(item.startDate).toLocaleDateString('ar-EG') : '',
    endDate: item.endDate ? new Date(item.endDate).toLocaleDateString('ar-EG') : '',
    price: item.amount ? `${item.amount} د.ج` : '',
    paymentMethod: item.method || '',
    autoRenewal: item.isActive,
  }));

  const columns: TableColumn[] = [

    {
      key: 'subscriber',
      title: t('table.subscriber'),
      sortable: true,
      render: (value) => <span className="font-medium text-white">{value}</span>
    },
    {
      key: 'plan',
      title: t('table.plan'),
      sortable: true,
      render: (value) => <span className="text-gray-300">{value}</span>
    },
    {
      key: 'price',
      title: t('table.price'),
      sortable: true,
      render: (value) => <span className="font-semibold text-green-400">{value}</span>
    },
    {
      key: 'startDate',
      title: t('table.startDate'),
      sortable: true,
      render: (value) => <span className="text-gray-400 text-sm">{value || '-'}</span>
    },
    {
      key: 'endDate',
      title: t('table.endDate'),
      sortable: true,
      render: (value) => <span className="text-gray-400 text-sm">{value || '-'}</span>
    },
    {
      key: 'status',
      title: t('table.status'),
      sortable: true,
      render: (value) => {
        const variant = value === 'نشط' || value === 'Active' ? 'success' : 
                       value === 'منتهي' || value === 'Expired' ? 'error' : 'warning';
        return <StatusBadge status={value} variant={variant as any} localize={true} />;
      }
    },
    {
      key: 'autoRenewal',
      title: t('table.autoRenewal'),
      render: (value) => (
        <div className="flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        </div>
      )
    },
    {
      key: 'paymentMethod',
      title: t('table.paymentMethod'),
      render: (value) => <span className="text-gray-300 text-sm">{value}</span>
    }
  ];

  if (userSubscriptionsDashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (userSubscriptionsDashboardError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {userSubscriptionsDashboardError}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('navigation.subscriptions')}</h2>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          {t('common.add')}
        </button>
      </div>
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('filters.searchPlaceholder')}
            className="w-full bg-dark-400 border border-dark-200 rounded-lg pr-10 pl-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">{t('filters.creationDate')}</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
            className="bg-dark-400 border border-dark-200 rounded-lg px-3 py-2 text-white text-sm w-20 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
            className="bg-dark-400 border border-dark-200 rounded-lg px-3 py-2 text-white text-sm w-20 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">{t('table.status')}</span>
          <select
            className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent min-w-[100px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="الكل">{t('filters.all')}</option>
            <option value="نشط">{t('filters.active')}</option>
            <option value="منتهي">{t('filters.expired')}</option>
            <option value="معلق">{t('filters.pending')}</option>
          </select>
        </div>
        <button
          className="bg-dark-200 hover:bg-dark-100 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('الكل');
            setDateRange({ start: '', end: '' });
          }}
        >
          {t('filters.reset')}
        </button>
      </div>
      {/* Table */}
      <Table
        columns={columns}
        data={subscriptionsData}
        rowKey="id"
        hoverable={true}
        emptyText={t('pagination.noData')}
      />
      {/* Results Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-dark-200">
        <div className="text-sm text-gray-400">
          {t('pagination.showing')} {subscriptionsData.length} {t('pagination.of')} {typeof userSubscriptionsDashboardTotalItems === 'number' ? userSubscriptionsDashboardTotalItems : subscriptionsData.length} {t('pagination.results')}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-dark-200 hover:bg-dark-100 text-white rounded text-sm transition-colors">
            {t('pagination.previous')}
          </button>
          <span className="px-3 py-1 bg-primary-600 text-white rounded text-sm">1</span>
          <button className="px-3 py-1 bg-dark-200 hover:bg-dark-100 text-white rounded text-sm transition-colors">
            {t('pagination.next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsTab; 