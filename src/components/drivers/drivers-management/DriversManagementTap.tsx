import React from 'react';
import { useTranslation } from 'react-i18next';
import Table, { TableColumn } from '../../ui/Table';

interface DriversManagementProps {
  driverManagementColumns: TableColumn<any>[];
  driversData: any[]; 
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  cityFilter: string;
  setCityFilter: (v: string) => void;
}

const DriversManagement: React.FC<DriversManagementProps> = ({
  driverManagementColumns,
  driversData,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  cityFilter,
  setCityFilter,
}) => {
  const { t } = useTranslation();
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('اختر...');
    setCityFilter('اختر...');
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl p-6 text-white relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.title}</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
          </div>
        ))}
      </div> */}
      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={t('filters.searchDriver')}
          className="flex-1 bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white min-w-[120px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>{t('table.status')}</option>
          <option>اختر...</option>
          <option>{t('filters.active')}</option>
          <option>{t('filters.suspended')}</option>
        </select>
        <select
          className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white min-w-[120px]"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option>{t('table.city')}</option>
          <option>اختر...</option>
          <option>الرياض</option>
          <option>جدة</option>
          <option>الدمام</option>
          <option> بغداد</option>
        </select>
        <button
          className="bg-dark-200 text-white px-4 py-2 rounded-lg hover:bg-dark-100"
          onClick={handleResetFilters}
        >
          {t('filters.reset')}
        </button>
        <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
          <span>+</span>
          {t('common.add')}
        </button>
      </div>
      <Table
        columns={driverManagementColumns}
        data={driversData}
        rowKey="id"
      />
    </div>
  );
};

export default DriversManagement; 