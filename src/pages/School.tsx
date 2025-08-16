import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchSchools } from '../store/slices/schoolSlices';
import type { RootState, AppDispatch } from '../store';
import type { School as SchoolType } from '../store/slices/schoolSlices';
import Table, { TableColumn } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import AddSchoolModal from '../components/schools/AddSchoolModal';
import DeleteSchoolModal from '../components/schools/DeleteSchoolModal';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const School: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { schools, loading, error, totalPages } = useSelector((state: RootState) => state.school);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPageParam = searchParams.get('page');
  const page = currentPageParam ? parseInt(currentPageParam, 10) : 1;
  const pageSize = 10;
  const [nameFilter, setNameFilter] = useState('');
  const [cityIdFilter, setCityIdFilter] = useState('');
  const [countryIdFilter, setCountryIdFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchoolForDelete, setSelectedSchoolForDelete] = useState<SchoolType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSchools({
      page,
      pageSize,
      name: nameFilter || undefined,
      cityId: cityIdFilter || undefined,
      countryId: countryIdFilter || undefined,
    }));
  }, [dispatch, page, pageSize, nameFilter, cityIdFilter, countryIdFilter]);

  const handleViewSchool = (school: SchoolType) => {
    navigate(`/school/${school.id}`);
  };

  const handleDeleteSchool = (school: SchoolType) => {
    setSelectedSchoolForDelete(school);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSchoolForDelete(null);
  };

  const columns: TableColumn<SchoolType>[] = [
    {
      key: 'name',
      title: t('school.table.name'),
      render: (value) => <span className="font-bold">{value}</span>,
    },
    {
      key: 'nameEn',
      title: t('school.table.nameEn'),
      render: (value) => <span className="text-gray-400">{value}</span>,
    },
    {
      key: 'address',
      title: t('school.table.address'),
      render: (value) => <span className="text-gray-400 text-xs">{value}</span>,
    },
    {
      key: 'actions',
      title: t('school.table.actions'),
      render: (_: any, record: SchoolType) => (
        <div className="flex items-center gap-2">
          <button
            className="text-primary-500 hover:text-primary-700 transition-colors"
            title={t('school.actions.viewDetails')}
            onClick={() => handleViewSchool(record)}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            className="text-red-500 hover:text-red-700 transition-colors"
            title={t('school.actions.deleteSchool')}
            onClick={() => handleDeleteSchool(record)}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{t('school.pageTitle')}</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('school.actions.addSchool')}
        </button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={t('school.filters.searchByName')}
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
        <input
          type="text"
          placeholder={t('school.filters.searchByCityId')}
          value={cityIdFilter}
          onChange={e => setCityIdFilter(e.target.value)}
          className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
        <input
          type="text"
          placeholder={t('school.filters.searchByCountryId')}
          value={countryIdFilter}
          onChange={e => setCountryIdFilter(e.target.value)}
          className="bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
      </div>
      
      {loading && <p className="text-gray-400">{t('common.loading')}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <Table
            columns={columns}
            data={schools}
            rowKey="id"
            hoverable={true}
            striped={false}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(page: number) => {
              setSearchParams({ page: page.toString() });
            }}
          />
        </>
      )}

      <AddSchoolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <DeleteSchoolModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        school={selectedSchoolForDelete}
      />
    </div>
  );
};

export default School; 