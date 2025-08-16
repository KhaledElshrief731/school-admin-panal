import React from 'react';
import { useTranslation } from 'react-i18next';
import Table, { TableColumn } from '../../ui/Table';


interface DriversApprovalsProps {
  driversData: any[]; 
  approvalsColumns: TableColumn<any>[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  cityFilter: string;
  setCityFilter: (v: string) => void;
  handleResetFilters: () => void;
}

const DriversApprovals: React.FC<DriversApprovalsProps> = ({
  driversData,
  approvalsColumns,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  cityFilter,
  setCityFilter,
  handleResetFilters,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('drivers.newDriverApprovals')}</h2>
        <p className="text-gray-400">{t('drivers.newDriverApprovalsSubtitle')}</p>
      </div>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={t('filters.search')}
          className="flex-1 bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>{t('table.documentsStatus')}</option>
          <option>{t('filters.all')}</option>
          <option>{t('filters.complete')}</option>
          <option>{t('filters.incomplete')}</option>
        </select>
        <select
          className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option>{t('table.city')}</option>
          <option>{t('filters.all')}</option>
          <option>الرياض</option>
          <option>جدة</option>
          <option> بغداد</option>
        </select>
        <button
          className="bg-dark-200 text-white px-4 py-2 rounded-lg hover:bg-dark-100"
          onClick={handleResetFilters}
        >
          {t('filters.reset')}
        </button>
      </div>
      <Table
        columns={approvalsColumns}
        data={driversData}
        rowKey="id"
      />
    </div>
  );
};

export default DriversApprovals;