import React, { useState, useEffect } from 'react'; 
import { Plus } from 'lucide-react'; 
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next'; 
import Table, { TableColumn } from '../../components/ui/Table'; 
import { ViewAction } from '../../components/ui/TableActions'; 
import UserAvatar from '../../components/ui/UserAvatar'; 
import { useAppDispatch, useAppSelector } from '../../hooks/redux'; 
import { fetchAllUsers } from '../../store/slices/usersSlices'; 
import { getLocalizedRole, getLocalizedGender } from '../../utils/i18nUtils'; 
import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver'; 
import Pagination from '../../components/ui/Pagination'; 
 
const Users: React.FC = () => { 
  const { t } = useTranslation(); 
  const dispatch = useAppDispatch(); 
  const navigate = useNavigate(); 
  const { users, loading, error, totalItems, totalPages } = useAppSelector(state => state.users); 
  const [searchParams, setSearchParams] = useSearchParams(); 
  const currentPageParam = searchParams.get("page"); 
  const currentPage = currentPageParam ? parseInt(currentPageParam) : 1; 
 
  const [roleFilter, setRoleFilter] = useState('');  
  const [searchTerm, setSearchTerm] = useState(''); 
  const [page, setPage] = useState(currentPage); 
  const pageSize = 10;  
 
  // ✅ Debounced search + min 5 chars
  useEffect(() => { 
    const handler = setTimeout(() => { 
      if (searchTerm.length === 0 || searchTerm.length >= 4) { 
        dispatch(fetchAllUsers({ 
          role: roleFilter || undefined, 
          userName: searchTerm || undefined, 
          page: currentPage, 
          pageSize, 
        })); 
      } 
    }, 500); // 500ms debounce delay 
 
    return () => clearTimeout(handler); 
  }, [dispatch, roleFilter, searchTerm, currentPage, pageSize]); 
 
  // Update page when URL search params change 
  useEffect(() => { 
    const pageParam = searchParams.get("page"); 
    if (pageParam) { 
      const pageNum = parseInt(pageParam); 
      if (pageNum !== page) { 
        setPage(pageNum); 
      } 
    } else if (page !== 1) { 
      setPage(1); 
    } 
  }, [searchParams, page]); 
 
  const handleViewDetails = (userId: string) => { 
    navigate(`/users/${userId}`); 
  }; 
 
  const handleExportExcel = () => { 
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
 
    const worksheet = XLSX.utils.json_to_sheet(exportData); 
    const workbook = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users'); 
 
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }); 
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' }); 
    saveAs(data, 'users.xlsx'); 
  }; 
 
  const handleAddUser = () => { 
    navigate('/users/add'); 
  }; 
 
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => { 
    setRoleFilter(e.target.value); 
    setSearchParams({ page: "1" }); 
  }; 
 
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setSearchTerm(e.target.value); 
    setSearchParams({ page: "1" }); 
  }; 
 
  const handlePageChange = (page: number) => { 
    setSearchParams({ page: page.toString() }); 
  }; 
 
  const columns: TableColumn<typeof users[0]>[] = [ 
    { 
      key: 'userName', 
      title: t('users.userName'), 
      sortable: true, 
      render: (_, record) => ( 
        <UserAvatar name={record.userName} email={record.userName} size="md" /> 
      ) 
    }, 
    { 
      key: 'phone', 
      title: t('users.phoneNumber'), 
      sortable: true, 
      render: (value) => ( 
        <span className="font-mono text-sm">{value}</span> 
      ) 
    }, 
    { 
      key: 'role', 
      title: t('users.role'), 
      sortable: true, 
      render: (value) => ( 
        <span className="text-gray-300">{getLocalizedRole(value, t)}</span> 
      ) 
    }, 
    { 
      key: 'city', 
      title: t('users.city'), 
      render: (value) => <span className="text-gray-300">{value?.name || '-'}</span> 
    }, 
    { 
      key: 'country', 
      title: t('users.country'), 
      render: (value) => <span className="text-gray-300">{value?.name || '-'}</span> 
    }, 
    { 
      key: 'region', 
      title: t('users.region'), 
      render: (value) => <span className="text-gray-300">{value || '-'}</span> 
    }, 
    { 
      key: 'dateOfBirth', 
      title: t('users.dateOfBirth'), 
      render: (value) => <span className="text-gray-400 text-sm">{value ? new Date(value).toLocaleDateString('ar-EG') : '-'}</span> 
    }, 
    { 
      key: 'gender', 
      title: t('users.gender'), 
      render: (value) => <span className="text-gray-300">{value ? getLocalizedGender(value, t) : '-'}</span> 
    }, 
    { 
      key: 'actions', 
      title: t('users.actions'), 
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
          <h1 className="text-2xl font-bold">{t('users.title')}</h1> 
        </div> 
        <div className="flex items-center gap-3"> 
          <span className="text-gray-400 text-sm"> 
            {t('users.usersList')} 
          </span> 
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm"> 
            {t('users.totalUsers')}: {totalItems} 
          </span> 
        </div> 
      </div> 
 
      <div className="bg-dark-300 rounded-xl p-6 space-y-6"> 
        {/* Action Buttons */} 
        <div className="flex items-center justify-between"> 
          <div className="flex items-center gap-3"> 
            <button  
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" 
              onClick={handleAddUser} 
            > 
              <Plus className="w-4 h-4" /> 
              {t('users.addNew')} 
            </button> 
            <button 
              className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" 
              onClick={handleExportExcel} 
            > 
              {t('users.exportExcel')} 
            </button> 
          </div> 
        </div> 
 
        {/* Filters */} 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> 
          <div> 
            <input 
              type="text" 
              placeholder={t('users.searchByName')} 
              className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" 
              value={searchTerm} 
              onChange={handleSearchTermChange} 
            /> 
          </div> 
          <div> 
            <select 
              className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" 
              value={roleFilter} 
              onChange={handleRoleFilterChange} 
            > 
              <option value="">{t('users.filterByRole')}</option> 
              <option value="STUDENT">{t('users.student')}</option> 
              <option value="PARENT">{t('users.parent')}</option> 
              <option value="DRIVER">{t('users.driver')}</option> 
            </select> 
          </div> 
          <button 
            className="bg-dark-200 hover:bg-dark-100 text-white px-4 py-2 rounded-lg transition-colors" 
            onClick={() => { 
              setSearchTerm(''); 
              setRoleFilter(''); 
              setSearchParams({ page: "1" }); 
            }} 
          > 
            {t('users.resetFilters')} 
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
            {t('users.showing')} {users.length} {t('users.of')} {totalItems} {t('users.user')} 
          </div> 
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          /> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default Users;
