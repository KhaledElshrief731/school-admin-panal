import React from 'react';
import Table, { TableColumn } from '../ui/Table';


interface DriversControlProps {
  driversData: any[]; // Replace 'any[]' with your actual driver type if available
  driverControlColumns: TableColumn<any>[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
}

const DriversControl: React.FC<DriversControlProps> = ({
  driversData,
  driverControlColumns,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">التحكم في السائقين</h2>
      <p className="text-gray-400">إدارة حالات السائقين وتعديل أو إيقاف حساباتهم</p>
    </div>
    {/* Search and Filters */}
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="البحث عن سائق..."
        className="flex-1 bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white min-w-[120px]"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option>الحالة</option>
        <option>الكل</option>
        <option>نشط</option>
        <option>موقوف</option>
        <option>محظور</option>
      </select>
      <button className="bg-dark-200 text-white px-4 py-2 rounded-lg hover:bg-dark-100">
        إعادة تعيين
      </button>
    </div>
    <Table
      columns={driverControlColumns}
      data={driversData}
      rowKey="id"
    />
  </div>
);

export default DriversControl; 