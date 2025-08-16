import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTripGroups } from '../store/slices/groupsSlice';
import type { RootState, AppDispatch } from '../store';
import Table, { TableColumn } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Groups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tripGroups, loading, error, totalPages } = useSelector((state: RootState) => state.tripGroups);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const PAGE_SIZE = 10;

  // Filter states
  const [driverName, setDriverName] = useState('');
  const [groupType, setGroupType] = useState('');
  const [name, setName] = useState('');
  const [isCompleted, setIsCompleted] = useState('');
  const [gender, setGender] = useState('');

  const columns: TableColumn[] = [
    { key: 'name', title: 'الاسم' },
    { key: 'groupType', title: 'نوع المجموعة' },
    { key: 'NextTripType', title: 'نوع الرحلة التالية' },
    { key: 'inComing', title: 'وقت العودة' },
    { key: 'onGoing', title: 'وقت الذهاب' },
    { key: 'gender', title: 'الجنس' },
    { key: 'academicLevel', title: 'المرحلة الدراسية' },
    { key: 'isCompleted', title: 'مكتملة؟', render: (value) => value ? 'نعم' : 'لا' },
    { key: 'remainingSeats', title: 'المقاعد المتبقية' },
    {
      key: 'actions',
      title: '',
      render: (_, record) => (
        <button
          onClick={e => {
            e.stopPropagation();
            navigate(`/groups/${record.id}`);
          }}
          className="p-2 rounded-lg bg-dark-100 hover:bg-primary-600 text-gray-400 hover:text-white transition-colors"
          title="عرض التفاصيل"
        >
          <Eye className="w-5 h-5" />
        </button>
      ),
      align: 'center',
      width: '48px',
    },
  ];

  useEffect(() => {
    dispatch(fetchTripGroups({
      page: currentPage,
      pageSize: PAGE_SIZE,
      driverName: driverName || undefined,
      groupType: groupType || undefined,
      name: name || undefined,
      isCompleted: isCompleted !== '' ? isCompleted : undefined,
      gender: gender || undefined,
    }));
  }, [dispatch, currentPage, driverName, groupType, name, isCompleted, gender]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [driverName, groupType, name, isCompleted, gender]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ادارة المجموعات</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm mb-1 text-gray-300">اسم السائق</label>
          <input type="text" value={driverName} onChange={e => setDriverName(e.target.value)} className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[160px]" placeholder="اسم السائق" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">نوع المجموعة</label>
          <input type="text" value={groupType} onChange={e => setGroupType(e.target.value)} className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[160px]" placeholder="نوع المجموعة" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">اسم المجموعة</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[160px]" placeholder="اسم المجموعة" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">مكتملة؟</label>
          <select value={isCompleted} onChange={e => setIsCompleted(e.target.value)} className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[120px]">
            <option value="">الكل</option>
            <option value="true">نعم</option>
            <option value="false">لا</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">الجنس</label>
          <input type="text" value={gender} onChange={e => setGender(e.target.value)} className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[120px]" placeholder="الجنس" />
        </div>
        <button
          type="button"
          onClick={() => {
            setDriverName('');
            setGroupType('');
            setName('');
            setIsCompleted('');
            setGender('');
          }}
          className="bg-dark-100 text-white rounded-lg px-4 py-2 mt-6 transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          إعادة تعيين الفلاتر
        </button>
      </div>
      <Table
        columns={columns}
        data={tripGroups}
        loading={loading}
        emptyText={error || 'لا توجد بيانات'}
        rowKey="id"
        striped
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Groups; 