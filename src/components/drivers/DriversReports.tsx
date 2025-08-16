import React from 'react';
import Table, { TableColumn } from '../ui/Table';
import { BarChart2, AlertTriangle, Users, Download } from 'lucide-react';

interface DriversReportsProps {
  reportsData: any[]; // Replace 'any[]' with your actual type if available
  reportsColumns: TableColumn<any>[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  dateRange: string;
  setDateRange: (v: string) => void;
}

const DriversReports: React.FC<DriversReportsProps> = ({
  reportsData,
  reportsColumns,
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
}) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-primary-500" />
          التقارير والتحليلات
        </h2>
        <p className="text-gray-400 mt-1">عرض ومتابعة وحصائيات ومؤشرات الأداء المختلفة للسائقين</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm">نوع التقرير</span>
        <select className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white">
          <option>تقرير الأداء</option>
        </select>
      </div>
    </div>
    {/* Export Buttons */}
    <div className="flex items-center gap-3 mb-6">
      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
        <Download className="w-4 h-4" />
        تصدير PDF
      </button>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
        <Download className="w-4 h-4" />
        تصدير Excel
      </button>
    </div>
    {/* Search and Date Filter */}
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="البحث عن السائق..."
          className="w-full bg-dark-400 border border-dark-200 rounded-lg pr-10 pl-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">الفترة الزمنية</span>
        <input
          type="text"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white text-sm w-48"
        />
      </div>
    </div>
    {/* Statistics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">120,000</div>
            <div className="text-sm opacity-90">إجمالي المدفوعات</div>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm opacity-90">إجمالي الشكاوى</div>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">42</div>
            <div className="text-sm opacity-90">السائقين النشطين</div>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">150</div>
            <div className="text-sm opacity-90">إجمالي الرحلات</div>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
    {/* Reports Table */}
    <div className="bg-dark-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">جدول أداء السائقين</h3>
      <Table
        columns={reportsColumns}
        data={reportsData}
        rowKey="id"
        hoverable={true}
        emptyText="لا توجد تقارير"
      />
    </div>
  </div>
);

export default DriversReports; 