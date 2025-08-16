import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Table, { TableColumn } from '../components/ui/Table';
import { ViewAction } from '../components/ui/TableActions';
import UserAvatar from '../components/ui/UserAvatar';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAllUsers } from '../store/slices/usersSlices';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Pagination from '../components/ui/Pagination';

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error, totalItems, totalPages } = useAppSelector(state => state.users);

  const [roleFilter, setRoleFilter] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10; 

  useEffect(() => {
    dispatch(fetchAllUsers({
      role: roleFilter || undefined,
      userName: searchTerm || undefined,
      page,
      pageSize,
    }));
  }, [dispatch, roleFilter, searchTerm, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, searchTerm]);

  const handleViewDetails = (userId: string) => {
    console.log('View details:', userId);
  };

  const handleExportExcel = () => {
    // Prepare data (flatten nested objects if needed)
    const exportData = users.map(user => ({
      id: user.id,
      userName: user.userName,
      phone: user.phone,
      role: user.role,
      city: user.city?.name,
      country: user.country?.name,
      region: user.region,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Save file
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'users.xlsx');
  };

  const columns: TableColumn<typeof users[0]>[] = [
    {
      key: 'userName',
      title: 'اسم المستخدم',
      sortable: true,
      render: (_, record) => (
        <UserAvatar name={record.userName} email={record.userName} size="md" />
      )
    },
    {
      key: 'phone',
      title: 'رقم الهاتف',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'role',
      title: 'الدور',
      sortable: true,
      render: (value) => (
        <span className="text-gray-300">{value}</span>
      )
    },
    {
      key: 'city',
      title: 'المدينة',
      render: (value) => <span className="text-gray-300">{value?.name || '-'}</span>
    },
    {
      key: 'country',
      title: 'الدولة',
      render: (value) => <span className="text-gray-300">{value?.name || '-'}</span>
    },
    {
      key: 'region',
      title: 'المنطقة',
      render: (value) => <span className="text-gray-300">{value || '-'}</span>
    },
    {
      key: 'dateOfBirth',
      title: 'تاريخ الميلاد',
      render: (value) => <span className="text-gray-400 text-sm">{value ? new Date(value).toLocaleDateString('ar-EG') : '-'}</span>
    },
    {
      key: 'gender',
      title: 'الجنس',
      render: (value) => <span className="text-gray-300">{value === 'MALE' ? 'ذكر' : value === 'FEMALE' ? 'أنثى' : '-'}</span>
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <ViewAction onClick={() => handleViewDetails(record.id)} />
        </div>
      )
    }
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">
            قائمة المستخدمين
          </span>
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
            إجمالي المستخدمين: {totalItems}
          </span>
        </div>
      </div>

      <div className="bg-dark-300 rounded-xl p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              إضافة مستخدم جديد
            </button>
            <button
              className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              onClick={handleExportExcel}
            >
              تصدير إلى Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="البحث بالاسم..."
              className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="">فلترة حسب الدور</option>
              <option value="STUDENT">طالب</option>
              <option value="PARENT">ولي أمر</option>
              <option value="DRIVER">سائق</option>
            </select>
          </div>
          <button
            className="bg-dark-200 hover:bg-dark-100 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('');
            }}
          >
            إعادة تعيين الفلاتر
          </button>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={users}
          rowKey="id"
          hoverable={true}
          striped={false}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-200">
          <div className="text-sm text-gray-400">
            عرض {users.length} من أصل {totalItems} مستخدم
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Users;