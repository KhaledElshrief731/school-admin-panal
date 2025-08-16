import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, User, GraduationCap, Car, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createUser } from '../../store/slices/usersSlices';
import { fetchCities } from '../../store/slices/citySlice';
import { fetchCountries } from '../../store/slices/countriesSlice';
import { fetchSchools } from '../../store/slices/schoolSlices';
import { fetchVehicles } from '../../store/slices/vehicleSlice';
import type { 
  CreateStudentRequest, 
  CreateParentRequest, 
  CreateDriverRequest,
  CreateUserRequest 
} from '../../store/slices/usersSlices';
import { showToast } from '../../store/slices/toastSlice';
import PaginatedDropdown from '../../components/ui/PaginatedDropdown';

const AddUser: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { createLoading, createError } = useAppSelector(state => state.users);
  const { cities, loading: citiesLoading } = useAppSelector(state => state.city);
  const { countries, loading: countriesLoading } = useAppSelector(state => state.countries);
  const { schools, loading: schoolsLoading } = useAppSelector(state => state.school);
  const { vehicles, loading: vehiclesLoading } = useAppSelector(state => state.vehicle);
  
  // Form state
  const [userType, setUserType] = useState<'STUDENT' | 'PARENT' | 'DRIVER'>('STUDENT');
  const [formData, setFormData] = useState<CreateUserRequest>({
    userName: '',
    phone: '',
    password: '',
    dateOfBirth: '',
    region: '',
    cityId: '',
    countryId: '',
    latitude: undefined,
    longitude: undefined,
    verifyCode: undefined,
    gender: 'MALE',
    role: 'STUDENT'
  });

  // Additional data for specific user types
  const [studentData, setStudentData] = useState({
    AcademicLevel: 'PRIMARY' as 'PRIMARY' | 'SECONDARY' | 'UNIVERSITY',
    AcademicYear: new Date().getFullYear().toString(),
    schoolId: ''
  });

  const [driverData, setDriverData] = useState({
    modelYear: new Date().getFullYear(),
    carModel: '',
    vehicleId: '',
    color: '',
    keyNumber: ''
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchCities({}));
    dispatch(fetchCountries());
    dispatch(fetchSchools({}));
    dispatch(fetchVehicles());
  }, [dispatch]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: userType }));
  }, [userType]);

  useEffect(() => {
    // Clear errors when form data changes
    setErrors({});
  }, [formData, studentData, driverData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic user validation
    if (!formData.userName.trim()) newErrors.userName = 'اسم المستخدم مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.password.trim()) newErrors.password = 'كلمة المرور مطلوبة';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'تاريخ الميلاد مطلوب';
    if (!formData.region.trim()) newErrors.region = 'المنطقة مطلوبة';
    if (!formData.cityId) newErrors.cityId = 'المدينة مطلوبة';
    if (!formData.countryId) newErrors.countryId = 'الدولة مطلوبة';

    // Student-specific validation
    if (userType === 'STUDENT') {
      if (!studentData.schoolId) newErrors.schoolId = 'المدرسة مطلوبة';
      if (!studentData.AcademicYear) newErrors.AcademicYear = 'السنة الدراسية مطلوبة';
    }

    // Driver-specific validation
    if (userType === 'DRIVER') {
      if (!driverData.carModel.trim()) newErrors.carModel = 'موديل السيارة مطلوب';
      if (!driverData.vehicleId) newErrors.vehicleId = 'المركبة مطلوبة';
      if (!driverData.color.trim()) newErrors.color = 'لون السيارة مطلوب';
      if (!driverData.keyNumber.trim()) newErrors.keyNumber = 'رقم المفتاح مطلوب';
      if (!formData.latitude) newErrors.latitude = 'خط العرض مطلوب';
      if (!formData.longitude) newErrors.longitude = 'خط الطول مطلوب';
      if (!formData.verifyCode) newErrors.verifyCode = 'رمز التحقق مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      let requestData: CreateStudentRequest | CreateParentRequest | CreateDriverRequest;

      if (userType === 'STUDENT') {
        requestData = {
          user: formData,
          student: studentData
        };
      } else if (userType === 'DRIVER') {
        requestData = {
          user: formData,
          driver: driverData
        };
      } else {
        requestData = { user: formData };
      }

      await dispatch(createUser(requestData)).unwrap();
      dispatch(showToast({ message: "تمت إضافة المستخدم بنجاح", type: "success" }));
      navigate('/users');
    } catch (error) {
      dispatch(showToast({ message: "حدث خطأ أثناء إضافة المستخدم", type: "error" }));
      console.error('Failed to create user:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStudentDataChange = (field: string, value: any) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const handleDriverDataChange = (field: string, value: any) => {
    setDriverData(prev => ({ ...prev, [field]: value }));
  };

  const fetchPaginatedSchools = async ({ page, search }: { page: number; search: string }) => {
    const pageSize = 10;
    const result = await dispatch(fetchSchools({ page, pageSize, name: search })).unwrap();
    // result.data is the array, result.totalItems is the total count
    return {
      data: result.data,
      hasMore: (page * pageSize) < (result.totalItems || 0)
    };
  };

    return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/users')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common.back')}
          </button>
          <h1 className="text-2xl font-bold">{t('pages.addNewUser')}</h1>
        </div>
      </div>

      <div className="bg-dark-300 rounded-xl p-6">
        {/* User Type Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">{t('users.userType')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setUserType('STUDENT')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'STUDENT'
                  ? 'border-primary-600 bg-primary-600/10 text-primary-600'
                  : 'border-dark-200 hover:border-primary-600/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{t('users.student')}</div>
                  <div className="text-sm text-gray-400">{t('common.student')}</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUserType('PARENT')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'PARENT'
                  ? 'border-primary-600 bg-primary-600/10 text-primary-600'
                  : 'border-dark-200 hover:border-primary-600/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{t('users.parent')}</div>
                  <div className="text-sm text-gray-400">{t('common.parent')}</div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUserType('DRIVER')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'DRIVER'
                  ? 'border-primary-600 bg-primary-600/10 text-primary-600'
                  : 'border-dark-200 hover:border-primary-600/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{t('users.driver')}</div>
                  <div className="text-sm text-gray-400">{t('common.driver')}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {createError && (
          <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400">
            {createError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('users.basicInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('users.userName')} *</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                    errors.userName ? 'border-red-500' : 'border-dark-200'
                  }`}
                  placeholder={t('users.userName')}
                />
                {errors.userName && <p className="text-red-400 text-sm mt-1">{errors.userName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('users.phoneNumber')} *</label>
                <input
                  type="tel"
                  autoComplete="off"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                    errors.phone ? 'border-red-500' : 'border-dark-200'
                  }`}
                  placeholder={t('users.phoneNumber')}
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.password')} *</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                    errors.password ? 'border-red-500' : 'border-dark-200'
                  }`}
                  placeholder={t('auth.password')}
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('users.dateOfBirth')} *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-dark-200'
                  }`}
                />
                {errors.dateOfBirth && <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('users.gender')} *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="MALE">{t('users.male')}</option>
                  <option value="FEMALE">{t('users.female')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('users.region')} *</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                    errors.region ? 'border-red-500' : 'border-dark-200'
                  }`}
                  placeholder={t('users.region')}
                />
                {errors.region && <p className="text-red-400 text-sm mt-1">{errors.region}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('users.city')} *</label>
                <select
                  value={formData.cityId}
                  onChange={(e) => handleInputChange('cityId', e.target.value)}
                  disabled={citiesLoading}
                  className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                    errors.cityId ? 'border-red-500' : 'border-dark-200'
                  }`}
                >
                  <option value="">{citiesLoading ? t('common.loading') : t('filters.selectCity')}</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
                {errors.cityId && <p className="text-red-400 text-sm mt-1">{errors.cityId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('users.country')} *</label>
                <select
                  value={formData.countryId}
                  onChange={(e) => handleInputChange('countryId', e.target.value)}
                  disabled={countriesLoading}
                  className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                    errors.countryId ? 'border-red-500' : 'border-dark-200'
                  }`}
                >
                  <option value="">{countriesLoading ? t('common.loading') : t('filters.selectCountry')}</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
                {errors.countryId && <p className="text-red-400 text-sm mt-1">{errors.countryId}</p>}
              </div>
            </div>
          </div>

          {/* Student-specific fields */}
          {userType === 'STUDENT' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                {t('users.studentInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('users.academicLevel')}</label>
                  <select
                    value={studentData.AcademicLevel}
                    onChange={(e) => handleStudentDataChange('AcademicLevel', e.target.value)}
                    className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                  >
                    <option value="PRIMARY">{t('users.primary')}</option>
                    <option value="SECONDARY">{t('users.secondary')}</option>
                    <option value="UNIVERSITY">{t('users.university')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('users.academicYear')} *</label>
                  <input
                    type="text"
                    value={studentData.AcademicYear}
                    onChange={(e) => handleStudentDataChange('AcademicYear', e.target.value)}
                    className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.AcademicYear ? 'border-red-500' : 'border-dark-200'
                    }`}
                    placeholder="2025"
                  />
                  {errors.AcademicYear && <p className="text-red-400 text-sm mt-1">{errors.AcademicYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('users.school')} *</label>
                  <PaginatedDropdown
                    fetchOptions={fetchPaginatedSchools}
                    value={schools.find(s => s.id === studentData.schoolId) || null}
                    onSelect={school => handleStudentDataChange('schoolId', school.id)}
                    getOptionLabel={school => school.name}
                    getOptionValue={school => school.id}
                    renderOption={(school, isSelected) => (
                      <span className={isSelected ? 'font-bold text-primary-600' : ''}>{school.name}</span>
                    )}
                    placeholder={schoolsLoading ? t('common.loading') : t('users.selectSchool')}
                    disabled={schoolsLoading}
                    className={errors.schoolId ? 'border-red-500' : ''}
                  />
                  {errors.schoolId && <p className="text-red-400 text-sm mt-1">{errors.schoolId}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Driver-specific fields */}
          {userType === 'DRIVER' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Car className="w-5 h-5" />
                {t('users.driverInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('table.latitude')} *</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value) || undefined)}
                    className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.latitude ? 'border-red-500' : 'border-dark-200'
                    }`}
                    placeholder="30.0444"
                  />
                  {errors.latitude && <p className="text-red-400 text-sm mt-1">{errors.latitude}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('table.longitude')} *</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value) || undefined)}
                    className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.longitude ? 'border-red-500' : 'border-dark-200'
                    }`}
                    placeholder="31.2357"
                  />
                  {errors.longitude && <p className="text-red-400 text-sm mt-1">{errors.longitude}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('users.verificationCode')} *</label>
                  <input
                    type="number"
                    value={formData.verifyCode || ''}
                    onChange={(e) => handleInputChange('verifyCode', parseInt(e.target.value) || undefined)}
                    className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.verifyCode ? 'border-red-500' : 'border-dark-200'
                    }`}
                    placeholder="1234"
                  />
                  {errors.verifyCode && <p className="text-red-400 text-sm mt-1">{errors.verifyCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('table.date')}</label>
                  <input
                    type="number"
                    value={driverData.modelYear}
                    onChange={(e) => handleDriverDataChange('modelYear', parseInt(e.target.value))}
                    className="w-full bg-dark-400 border border-dark-200 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('users.vehicleModel')} *</label>
                  <input
                    type="text"
                    value={driverData.carModel}
                    onChange={(e) => handleDriverDataChange('carModel', e.target.value)}
                    className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.carModel ? 'border-red-500' : 'border-dark-200'
                    }`}
                    placeholder="Hyundai Elantra"
                  />
                  {errors.carModel && <p className="text-red-400 text-sm mt-1">{errors.carModel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('table.type')} *</label>
                  <select
                    value={driverData.vehicleId}
                    onChange={(e) => handleDriverDataChange('vehicleId', e.target.value)}
                    disabled={vehiclesLoading}
                    className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.vehicleId ? 'border-red-500' : 'border-dark-200'
                    }`}
                  >
                    <option value="">{vehiclesLoading ? t('common.loading') : t('users.selectVehicle')}</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleType}</option>
                    ))}
                  </select>
                  {errors.vehicleId && <p className="text-red-400 text-sm mt-1">{errors.vehicleId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('users.vehicleColor')} *</label>
                  <input
                    type="text"
                    value={driverData.color}
                    onChange={(e) => handleDriverDataChange('color', e.target.value)}
                    className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.color ? 'border-red-500' : 'border-dark-200'
                    }`}
                    placeholder={t('common.white', 'أبيض')}
                  />
                  {errors.color && <p className="text-red-400 text-sm mt-1">{errors.color}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('users.keyNumber')} *</label>
                  <input
                    type="text"
                    value={driverData.keyNumber}
                    onChange={(e) => handleDriverDataChange('keyNumber', e.target.value)}
                    className={`w-full bg-dark-400 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                      errors.keyNumber ? 'border-red-500' : 'border-dark-200'
                    }`}
                    placeholder="KEY1234"
                  />
                  {errors.keyNumber && <p className="text-red-400 text-sm mt-1">{errors.keyNumber}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-dark-200">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {createLoading ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;