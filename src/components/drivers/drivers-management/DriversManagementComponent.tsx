import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers } from '../../../store/slices/driversSlice';
import { RootState } from '../../../store';
import type { AppDispatch } from '../../../store';
import { getLocalizedStatus } from '../../../utils/i18nUtils';
import { TableColumn } from '../../ui/Table';
import { useNavigate } from 'react-router-dom';
import DriversManagement from './DriversManagementTap';
import { Check, AlertTriangle } from 'lucide-react';
import Pagination from '../../ui/Pagination';
import { t } from 'i18next';

interface City {
  name: string;
  nameEn: string;
}

interface User {
  userName: string;
  image: string;
  city: City;
  country: { name: string; nameEn: string };
  region: string;
  gender: string;
  isVerified: boolean;
  dateOfBirth: string | null;
  phone: string;
}

interface DriverVehicle {
  id: string;
  driverId: string;
  modelYear: number;
  carModel: string;
  vehicleId: string;
  color: string;
  keyNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface Driver {
  id: string;
  homePicture: string[];
  drivingLicense: string[];
  personalCard: string[];
  isVerified: boolean;
  isPause: boolean;
  avgRate: number | null;
  vehicleId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  DriverVehicle: DriverVehicle[];
  user: User;
}

const DriversManagementComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: drivers, loading, error } = useSelector(
    (state: RootState) => state.drivers
  ) as { data: Driver[]; loading: boolean; error: string | null };
  const navigate = useNavigate();



  // Filters (local state)
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('اختر...');
  const [cityFilter, setCityFilter] = React.useState('اختر...');
  const [filteredDrivers, setFilteredDrivers] = React.useState<Driver[]>([]);
  const [page, setPage] = React.useState(1);
  const pageSize = 1; // or any default you want
  const totalPages = 2; // For demo/testing, or get from backend if available

  useEffect(() => {
    dispatch(fetchDrivers({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    if (!drivers) {
      setFilteredDrivers([]);
      return;
    }
    setFilteredDrivers(
      drivers
        .filter((driver) =>
          searchTerm === '' ||
          driver.user?.userName?.includes(searchTerm) ||
          driver.user?.phone?.includes(searchTerm)
        )
        .filter((driver) =>
          statusFilter === 'اختر...' ||
          (statusFilter === 'نشط' && !driver.isPause) ||
          (statusFilter === 'موقوف' && driver.isPause)
        )
        .filter((driver) =>
          cityFilter === 'اختر...' || driver.user?.city?.name === cityFilter
        )
    );
  }, [drivers, searchTerm, statusFilter, cityFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, cityFilter]);

  const handleViewDriver = (id: string) => {
    navigate(`/drivers/${id}`);
  };

  // Define columns for the table
  const driverManagementColumns: TableColumn<Driver>[] = [
    {
      key: 'userName',
      title: t('table.name'),
      render: (_: any, record: Driver) => record.user?.userName || '-',
    },
    {
      key: 'phone',
      title: t('table.phone'),
      render: (_: any, record: Driver) => record.user?.phone || '-',
    },
    {
      key: 'DriverVehicle',
      title: t('table.vehicleInfo'),
      render: (_: any, record: Driver) =>
        record.DriverVehicle && record.DriverVehicle.length > 0
          ? `${record.DriverVehicle[0].carModel} - ${record.DriverVehicle[0].modelYear} - ${record.DriverVehicle[0].keyNumber}`
          : '-',
    },
    {
      key: 'city',
      title: t('table.city'),
      render: (_: any, record: Driver) => record.user?.city?.name || '-',
    },
    {
      key: 'classification',
      title: t('table.classification'),
      render: () => <span className="text-green-400">مجموعة مكتملة</span>,
    },
    {
      key: 'isPause',
      title: t('table.status'),
      render: ( _: any, record: Driver) =>
        record.isPause ? (
          <div className="flex items-center gap-1 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            {t('filters.suspended')}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-400">
            <Check className="w-4 h-4" />
            {t('filters.active')}
          </div>
        ),
    },
    {
      key: 'rating',
      title: t('table.rating'),
      render: () => (
        <span className="text-yellow-400 font-bold">★★★★☆ (4.2)</span>
      ),
    },
    {
      key: 'trips',
      title: t('table.tripsCount'),
      render: () => <span className="font-medium">120</span>,
    },
    {
      key: "isVerified",
      title: t('table.verification'),
      render: (_: any, record: Driver) =>
        record.isVerified ? (
          <div className="flex items-center gap-1 text-green-400">
            <Check className="w-4 h-4" />
            {t('filters.verified')}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            {t('filters.notVerified')}
          </div>
        ),
    },
    {
      key: 'actions',
      title: t('table.actions'),
      render: (_: any, record: Driver) => (
        <div className="flex items-center gap-2">
          <button title="رفض" className="text-red-500 hover:text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button title="قبول" className="text-green-500 hover:text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
          <button
            title="عرض"
            className="text-gray-400 hover:text-gray-600"
            onClick={() => handleViewDriver(record.id)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0a3 3 0 016 0zm6 0c0 5-9 9-9 9s-9-4-9-9a9 9 0 0118 0z" /></svg>
          </button>
        </div>
      )
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DriversManagement
        driversData={filteredDrivers}
        driverManagementColumns={driverManagementColumns}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};

export default DriversManagementComponent;
