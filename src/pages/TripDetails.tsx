import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTripById } from '../store/slices/tripsSlices';
import type { RootState, AppDispatch } from '../store';
import Table, { TableColumn } from '../components/ui/Table';

function formatDate(dateString: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTrip, selectedTripLoading, selectedTripError } = useSelector((state: RootState) => state.trips);

  useEffect(() => {
    if (id) dispatch(fetchTripById(id));
  }, [dispatch, id]);

  if (selectedTripLoading) return <div className="p-6">جاري التحميل...</div>;
  if (selectedTripError) return <div className="p-6 text-red-500">{selectedTripError}</div>;
  if (!selectedTrip) return <div className="p-6">لا توجد بيانات</div>;

  const studentColumns: TableColumn[] = [
    {
      key: 'student.user.image',
      title: 'الصورة',
      render: (value, record) => (
        <img
          src={value ? (value.startsWith('http') ? value : `https://mahfouzapp.com${value}`) : '/default-avatar.png'}
          alt={record.student?.user?.userName}
          className="w-12 h-12 rounded-full object-cover border border-dark-100 shadow"
          onError={e => (e.currentTarget.src = '/default-avatar.png')}
        />
      ),
      align: 'center',
      width: '60px',
    },
    { key: 'student.user.userName', title: 'اسم الطالب' },
    { key: 'student.user.phone', title: 'رقم الهاتف' },
    { key: 'type', title: 'نوع الرحلة' },
    { key: 'statusLog', title: 'سجل الحالة', render: (value) => (
      <ul className="text-xs text-gray-300 space-y-1">
        {Array.isArray(value) && value.length > 0 ? value.map((log, idx) => (
          <li key={idx}>{log.status} - {formatDate(log.createdAt)}</li>
        )) : <li>—</li>}
      </ul>
    ) },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-dark-300 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary-400">تفاصيل الرحلة</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="mb-2 text-gray-400">اسم السائق</div>
            <div className="font-semibold text-white">{selectedTrip.driver?.user?.userName}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">هاتف السائق</div>
            <div className="font-semibold text-white">{selectedTrip.driver?.user?.phone}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">اسم المجموعة</div>
            <div className="font-semibold text-white">{selectedTrip.tripGroup?.name}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">الحالة</div>
            <div className="font-semibold text-white">{selectedTrip.status}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">نوع الرحلة</div>
            <div className="font-semibold text-white">{selectedTrip.type}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">تاريخ الإنشاء</div>
            <div className="font-semibold text-white">{formatDate(selectedTrip.createdAt)}</div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">الطلاب في الرحلة</h2>
        <Table
          columns={studentColumns}
          data={selectedTrip.tripStudents || []}
          emptyText="لا يوجد طلاب"
          rowKey="id"
          striped
        />
      </div>
    </div>
  );
};

export default TripDetails; 