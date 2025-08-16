import React from 'react';
import Table, { TableColumn } from '../ui/Table';
import { Search } from 'lucide-react';




interface DriversNotificationsProps {
  notificationsData: any[]; // Replace 'any[]' with your actual type if available
  notificationsColumns: TableColumn<any>[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}

const DriversNotifications: React.FC<DriversNotificationsProps> = ({
  notificationsData,
  notificationsColumns,
  searchTerm,
  setSearchTerm,
}) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">الإشعارات والتنبيهات</h2>
      </div>
    </div>
    {/* Filters */}
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="البحث عن إشعار..."
          className="w-full bg-dark-400 border border-dark-200 rounded-lg pr-10 pl-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">الفئة</span>
        <select className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white min-w-[120px]">
          <option>الكل</option>
          <option>توثيق</option>
          <option>عطيبة</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">الأولوية</span>
        <select className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white min-w-[120px]">
          <option>الكل</option>
          <option>عاجل</option>
          <option>عادي</option>
        </select>
      </div>
      <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
        إعادة تعيين
      </button>
    </div>
    {/* Notifications Table */}
    <Table
      columns={notificationsColumns}
      data={notificationsData}
      rowKey="id"
      hoverable={true}
      emptyText="لا توجد إشعارات"
    />
  </div>
);

export default DriversNotifications; 