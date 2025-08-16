import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { fetchTripGroupById } from '../../store/slices/groupsSlice';
import type { RootState, AppDispatch } from '../../store';
import Table, { TableColumn } from '../../components/ui/Table';

const GroupsDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTripGroup, selectedTripGroupLoading, selectedTripGroupError } = useSelector((state: RootState) => state.tripGroups);

  useEffect(() => {
    if (id) dispatch(fetchTripGroupById(id));
  }, [dispatch, id]);

  if (selectedTripGroupLoading) return <div className="p-6">{t('loading')}</div>;
  if (selectedTripGroupError) return <div className="p-6 text-red-500">{selectedTripGroupError}</div>;
  if (!selectedTripGroup) return <div className="p-6">{t('noData')}</div>;

  const studentColumns: TableColumn[] = [
    {
      key: 'user.image',
      title: t('groups.image', 'الصورة'),
      render: (value, record) => (
        <img
          src={value ? (value.startsWith('http') ? value : `https://mahfouzapp.com${value}`) : '/default-avatar.png'}
          alt={record.user.userName}
          className="w-12 h-12 rounded-full object-cover border border-dark-100 shadow"
          onError={e => (e.currentTarget.src = '/default-avatar.png')}
        />
      ),
      align: 'center',
      width: '60px',
    },
    { key: 'user.userName', title: t('groups.studentName'), render: value => <span className="text-white font-medium">{value}</span> },
    { key: 'user.phone', title: t('groups.phoneNumber'), render: value => <span className="text-gray-300">{value}</span> },
    { key: 'school.name', title: t('groups.school'), render: value => <span className="text-gray-300">{value}</span> },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-dark-300 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary-400">{t('groups.groupDetails')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="mb-2 text-gray-400">{t('groups.groupName')}</div>
            <div className="font-semibold text-white">{selectedTripGroup.name}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">{t('groups.groupType')}</div>
            <div className="font-semibold text-white">{selectedTripGroup.groupType}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">{t('groups.driverName')}</div>
            <div className="font-semibold text-white">{selectedTripGroup.driver?.user?.userName}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">{t('groups.studentCount')}</div>
            <div className="font-semibold text-white">{selectedTripGroup.totalNumberOfStudents}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">{t('groups.holidays')}</div>
            <div className="font-semibold text-white">{selectedTripGroup.holidays?.join('، ') || '—'}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">{t('groups.tripRoute')}</div>
            <div className="font-semibold text-white">{selectedTripGroup.tripWay}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">{t('groups.minKmPrice')}</div>
            <div className="font-semibold text-white">{selectedTripGroup.lessKmPrice ?? '—'}</div>
          </div>
          <div>
            <div className="mb-2 text-gray-400">{t('groups.minStudentFee')}</div>
            <div className="font-semibold text-white">{selectedTripGroup.lessStudentFee ?? '—'}</div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-400">{t('groups.students')}</h2>
        <Table
          columns={studentColumns}
          data={selectedTripGroup.groupStudents?.map(gs => gs.student) || []}
          emptyText={t('groups.noStudents')}
          rowKey="id"
          striped
        />
      </div>
    </div>
  );
};

export default GroupsDetails;
