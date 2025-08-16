import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchTrips } from '../../store/slices/tripsSlices';
import type { RootState, AppDispatch } from '../../store';
import Table, { TableColumn } from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import { Eye } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

const PAGE_SIZE = 10;

const Trips: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { trips, loading, error, totalPages } = useSelector((state: RootState) => state.trips);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPageParam = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState(currentPageParam ? parseInt(currentPageParam) : 1);

  // Filter states
  const [groupName, setGroupName] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [driverName, setDriverName] = useState('');
  // Get unique status values from trips
  const statusOptions = Array.from(new Set(trips.map(t => t.status))).filter(Boolean);

  const columns: TableColumn[] = [
    { key: 'driver.user.userName', title: t('table.driverName') },
    { key: 'driver.user.phone', title: t('table.phone') },
    { key: 'tripGroup.name', title: t('table.groupName') },
    { key: 'status', title: t('table.status') },
    { key: 'type', title: t('table.tripType') },
    { key: 'createdAt', title: t('table.createdAt'), render: value => formatDate(value) },
    {
      key: 'actions',
      title: t('table.actions'),
      render: (_, record) => (
        <button
          onClick={e => {
            e.stopPropagation();
            navigate(`/trips/${record.id}`);
          }}
          className="p-2 rounded-lg bg-dark-100 hover:bg-primary-600 text-gray-400 hover:text-white transition-colors"
          title={t('common.view')}
        >
          <Eye className="w-5 h-5" />
        </button>
      ),
      align: 'center',
      width: '48px',
    },
  ];

  useEffect(() => {
    dispatch(fetchTrips({
      page: currentPage,
      pageSize: PAGE_SIZE,
      groupName: groupName || undefined,
      status: status || undefined,
      date: date || undefined,
      driverName: driverName || undefined,
    }));
  }, [dispatch, currentPage, groupName, status, date, driverName]);

  // Update currentPage when URL search params change
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam);
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    } else if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchParams, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setSearchParams({ page: "1" });
  }, [groupName, status, date, driverName]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('pages.tripsManagement')}</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm mb-1 text-gray-300">{t('table.driverName')}</label>
          <input type="text" value={driverName} onChange={e => setDriverName(e.target.value)} className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[160px]" placeholder={t('table.driverName')} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">{t('table.groupName')}</label>
          <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[160px]" placeholder={t('table.groupName')} />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">{t('table.status')}</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[120px]"
          >
            <option value="">{t('trips.filters.all')}</option>
            {['BEGIN', ...statusOptions].map(option => (
              <option key={option} value={option}>
                {t(`trips.filters.${option}`)}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-sm mb-1 text-gray-300">{t('table.date')}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-dark-200 text-white border border-dark-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600 min-w-[150px]" />
        </div>
        <button
          type="button"
          onClick={() => {
            setDriverName('');
            setGroupName('');
            setStatus('');
            setDate('');
          }}
          className="bg-dark-100 text-white rounded-lg px-4 py-2 mt-6 transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          {t('filters.resetFilters')}
        </button>
      </div>
      <Table
        columns={columns}
        data={trips}
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

export default Trips;
