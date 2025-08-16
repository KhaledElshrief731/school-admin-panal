import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers } from '../../../store/slices/driversSlice';
import { RootState } from '../../../store';
import type { AppDispatch } from '../../../store';
import { getLocalizedStatus, getLocalizedGender } from '../../../utils/i18nUtils';
import DriversApprovals from './DriversApprovalsTab';
import { TableColumn } from '../../ui/Table';
import { useNavigate } from 'react-router-dom';
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

const DriversApprovalComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: drivers, loading, error } = useSelector(
    (state: RootState) => state.drivers
  ) as { data: Driver[]; loading: boolean; error: string | null };
  const navigate = useNavigate();

  // Filters (local state)
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('اختر...');
  const [cityFilter, setCityFilter] = React.useState('اختر...');

  // Fetch drivers from backend with filters
  useEffect(() => {
    const params: any = {};
    if (searchTerm) params.userName = searchTerm;
    if (statusFilter === 'مكتملة') params.isVerified = 'true';
    if (statusFilter === 'غير مكتملة') params.isVerified = 'false';
    if (cityFilter && cityFilter !== 'اختر...' && cityFilter !== 'المدينة' && cityFilter !== 'الكل') params.city = cityFilter;
    dispatch(fetchDrivers(params));
  }, [dispatch, searchTerm, statusFilter, cityFilter]);

  const handleViewDriver = (id: string) => {
    navigate(`/drivers/${id}`);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('اختر...');
    setCityFilter('اختر...');
  };

  // Define columns for the table
  const approvalsColumns: TableColumn<Driver>[] = [
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
      key: 'createdAt',
      title: t('table.applicationDate'),
      render: (_: any, record: Driver) => new Date(record.createdAt).toLocaleDateString('ar-EG'),
    },
    {
      key: 'documents',
      title: t('table.documentsStatus'),
      render: (_: any, record: Driver) => {
        // Calculate the total number of documents
        const totalDocs =
          (record.homePicture?.length || 0) +
          (record.drivingLicense?.length || 0) +
          (record.personalCard?.length || 0);

        const isComplete = totalDocs > 3;

        return (
          <span className={`flex items-center gap-1 text-sm font-medium ${isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
            {isComplete ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4" /></svg>
                {t('drivers.documentsComplete')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" /></svg>
                {t('drivers.documentsIncomplete')}
              </>
            )}
          </span>
        );
      }
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
    <DriversApprovals
      driversData={drivers}
      approvalsColumns={approvalsColumns}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      cityFilter={cityFilter}
      setCityFilter={setCityFilter}
      handleResetFilters={handleResetFilters}
    />
  );
};

export default DriversApprovalComponent;
