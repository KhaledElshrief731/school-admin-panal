import React, { useState, useEffect } from 'react';
import {  Check, Bell, MessageSquare, Settings, BarChart2, Users, FileText,  User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import  { TableColumn } from '../components/ui/Table';
import { ViewAction } from '../components/ui/TableActions';
import StatusBadge from '../components/ui/StatusBadge';
import UserAvatar from '../components/ui/UserAvatar';
import StarRating from '../components/ui/StarRating';
import DriversControl from '../components/drivers/DriversControl';
import DriversReports from '../components/drivers/DriversReports';
import DriversNotifications from '../components/drivers/DriversNotifications';
import { configureStore } from '@reduxjs/toolkit';
import driversReducer from '../store/slices/driversSlice';
import { useDispatch } from 'react-redux';
import { fetchDrivers } from '../store/slices/driversSlice';
import type { AppDispatch } from '../store';
import DriversApprovalComponent from '../components/drivers/drivers-approvals/DriversApprovalComponent';
import DriversManagementComponent from '../components/drivers/drivers-management/DriversManagementComponent';
import DriversRatingsComponent from '../components/drivers/drivers-ratings/DriversRatingsComponent';

interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
  city: string;
  date: string;
  documents: 'complete' | 'incomplete';
  status: 'active' | 'suspended' | 'pending';
  trips: number;
  rating: number;
  classification: string;
  email: string;
  lastStatusUpdate: string;
  suspensionReason?: string;
}

interface DriverReport {
  id: string;
  name: string;
  complaints: number;
  commitmentRate: string;
  students: number;
  trips: number;
}

interface Notification {
  id: string;
  category: string;
  date: string;
  priority: 'urgent' | 'normal';
  message: string;
  status: 'confirmed' | 'pending' | 'rejected' | 'waiting';
}


const driversData: Driver[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    phone: '4567 123 750 964+',
    vehicle: 'تويوتا كامري - 2022 - أبيض',
    city: 'الرياض',
    date: '2023-08-10',
    documents: 'complete',
    status: 'active',
    trips: 120,
    rating: 4.2,
    classification: 'مجموعة مكتملة',
    email: 'ahmad@example.com',
    lastStatusUpdate: '8/15/2023'
  },
  {
    id: 2,
    name: 'سارة الأحمد',
    phone: '4321 765 750 964+',
    vehicle: 'هيونداي سوناتا - 2023 - أسود',
    city: 'جدة',
    date: '2023-08-11',
    documents: 'incomplete',
    status: 'suspended',
    trips: 45,
    rating: 2.8,
    classification: 'مجموعة مكتملة',
    email: 'sara@example.com',
    lastStatusUpdate: '9/5/2023',
    suspensionReason: 'تأخر متكرر في مواعيد النقل'
  },
  {
    id: 3,
    name: 'محمد العلي',
    phone: '2222 111 750 964+',
    vehicle: 'نيسان التيما - 2021 - فضي',
    city: 'الدمام',
    date: '2023-07-20',
    documents: 'complete',
    status: 'pending',
    trips: 78,
    rating: 1.8,
    classification: 'مجموعة مكتملة',
    email: 'mohammed@example.com',
    lastStatusUpdate: '7/20/2023',
    suspensionReason: 'مخالفة شروط السلامة'
  },
  {
    id: 4,
    name: 'خالد السعيد',
    phone: '4444 333 750 964+',
    vehicle: 'كيا سيراتو - 2022 - أبيض',
    city: 'الرياض',
    date: '2023-08-01',
    documents: 'complete',
    status: 'active',
    trips: 95,
    rating: 4.6,
    classification: 'مجموعة مكتملة',
    email: 'khalid@example.com',
    lastStatusUpdate: '8/1/2023'
  },
  {
    id: 5,
    name: 'علي كاظم',
    phone: '5555 444 750 964+',
    vehicle: 'هوندا أكورد - 2023 - أزرق',
    city: 'الرياض',
    date: '2023-08-05',
    documents: 'complete',
    status: 'active',
    trips: 120,
    rating: 4.5,
    classification: 'مجموعة مكتملة',
    email: 'ali@example.com',
    lastStatusUpdate: '8/5/2023'
  }
];

const reportsData: DriverReport[] = [
  {
    id: '1',
    name: 'علي كاظم',
    complaints: 2,
    commitmentRate: '92%',
    students: 120,
    trips: 35
  },
  {
    id: '2',
    name: 'محمد احسان',
    complaints: 3,
    commitmentRate: '87%',
    students: 98,
    trips: 28
  },
  {
    id: '3',
    name: 'كريم عبدالله',
    complaints: 1,
    commitmentRate: '95%',
    students: 145,
    trips: 42
  },
  {
    id: '4',
    name: 'حسين أحمد',
    complaints: 0,
    commitmentRate: '89%',
    students: 110,
    trips: 31
  },
  {
    id: '5',
    name: 'فاطمة محمد',
    complaints: 2,
    commitmentRate: '91%',
    students: 75,
    trips: 22
  }
];

const notificationsData: Notification[] = [
  {
    id: '1',
    category: 'توثيق',
    date: '09:30 2025-03-24',
    priority: 'urgent',
    message: 'سائق جديد يحتاج إلى مراجعة المستندات',
    status: 'confirmed'
  },
  {
    id: '2',
    category: 'عطيبة',
    date: '08:15 2025-03-24',
    priority: 'normal',
    message: 'تم تحرير الأوراق المحجوزة للسائق أحمد محمد',
    status: 'pending'
  },
  {
    id: '3',
    category: 'توثيق',
    date: '17:45 2025-03-23',
    priority: 'urgent',
    message: 'تم إنهاء رحلة مدرسة الأمل بواسطة السائق',
    status: 'rejected'
  },
  {
    id: '4',
    category: 'توثيق',
    date: '10:20 2025-03-23',
    priority: 'urgent',
    message: 'انتهاء صلاحية رخصة القيادة للسائق خالد العلي',
    status: 'waiting'
  },
  {
    id: '5',
    category: 'عطيبة',
    date: '14:30 2025-03-22',
    priority: 'normal',
    message: 'تم تقديم طلب توثيق جديد من السائق محمد العزيزي',
    status: 'confirmed'
  },
  {
    id: '6',
    category: 'توثيق',
    date: '11:00 2025-03-22',
    priority: 'normal',
    message: 'مدفوعات معلقة بحاجة إلى مراجعة',
    status: 'pending'
  },
  {
    id: '7',
    category: 'عطيبة',
    date: '07:10 2025-03-21',
    priority: 'normal',
    message: 'تأخر السائق عن موعد بدء الرحلة المدرسية',
    status: 'rejected'
  },
  {
    id: '8',
    category: 'توثيق',
    date: '16:20 2025-03-20',
    priority: 'normal',
    message: 'تم تحديث وثائق السائق وحاجة إلى مراجعة',
    status: 'waiting'
  },
  {
    id: '9',
    category: 'توثيق',
    date: '13:40 2025-03-20',
    priority: 'normal',
    message: 'تم رفض طلب توثيق السائق بدر القاسمي',
    status: 'confirmed'
  }
];

export const store = configureStore({
  reducer: {
    drivers: driversReducer,
  },
});

const Drivers: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('approvals');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('اختر...');
  const [dateRange, setDateRange] = useState('3/30/2025 - 3/1/2025');
  const [selectedDriverId, setSelectedDriverId] = useState('');

  const menuItems = [
    { icon: <FileText className="w-5 h-5" />, label: t('navigation.approvals'), key: 'approvals', count: null },
    { icon: <Users className="w-5 h-5" />, label: t('navigation.driversManagement'), key: 'management', count: null },
    { icon: <BarChart2 className="w-5 h-5" />, label: t('navigation.tracking'), key: 'tracking', count: null },
    { icon: <Settings className="w-5 h-5" />, label: t('navigation.control'), key: 'control', count: null },
    { icon: <MessageSquare className="w-5 h-5" />, label: t('navigation.ratings'), key: 'ratings', count: 3 },
    { icon: <Bell className="w-5 h-5" />, label: t('navigation.notifications'), key: 'notifications', count: 5 },
    { icon: <BarChart2 className="w-5 h-5" />, label: t('navigation.reports'), key: 'reports', count: null },
  ];

  // Table columns for driver control
  const driverControlColumns: TableColumn<Driver>[] = [
    {
      key: 'name',
      title: 'الاسم',
      render: (_, record) => <UserAvatar name={record.name} email={record.email} />
    },
    {
      key: 'phone',
      title: 'رقم الهاتف'
    },
    {
      key: 'status',
      title: 'الحالة',
      render: (value) => {
        const statusMap = {
          active: { text: 'نشط', variant: 'success' as const },
          suspended: { text: 'موقوف', variant: 'warning' as const },
          pending: { text: 'محظور', variant: 'error' as const }
        };
        const status = statusMap[value as keyof typeof statusMap];
        return <StatusBadge status={status.text} variant={status.variant} />;
      }
    },
    {
      key: 'suspensionReason',
      title: 'سبب الإيقاف',
      render: (value) => (
        <span className="text-sm text-gray-400">{value || '-'}</span>
      )
    },
    {
      key: 'lastStatusUpdate',
      title: 'آخر تحديث للحالة',
      render: (value) => (
        <div className="text-sm">
          <div>آخر تحديث للحالة</div>
          <div className="text-gray-400">{value}</div>
        </div>
      )
    },
    {
      key: 'rating',
      title: 'التقييمات',
      render: (value) => <StarRating rating={value} />
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: () => (
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          عرض التفاصيل
        </button>
      )
    }
  ];

  // Reports columns
  const reportsColumns: TableColumn<DriverReport>[] = [
    {
      key: 'name',
      title: 'الاسم',
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'complaints',
      title: 'الشكاوى',
      render: (value) => (
        <div className="flex items-center justify-center">
          <span className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
            ${value === 0 ? 'bg-green-600 text-white' : 
              value <= 2 ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'}
          `}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'commitmentRate',
      title: 'الالتزام بالمواعيد',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-dark-400 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                parseInt(value) >= 90 ? 'bg-green-500' : 
                parseInt(value) >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
              }`}
              style={{ width: value }}
            ></div>
          </div>
          <span className="text-sm font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'students',
      title: 'عدد الطلاب',
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'trips',
      title: 'عدد الرحلات',
      render: (value) => (
        <span className="font-medium">{value}</span>
      )
    }
  ];

  // Notifications columns
  const notificationsColumns: TableColumn<Notification>[] = [
    {
      key: 'status',
      title: 'الإجراءات',
      render: (value) => (
        <div className="flex items-center gap-2">
          {value === 'confirmed' && (
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">تأكيد</span>
            </div>
          )}
          <ViewAction onClick={() => console.log('View notification')} />
        </div>
      )
    },
    {
      key: 'date',
      title: 'التاريخ',
      render: (value) => (
        <span className="text-gray-400 text-sm">{value}</span>
      )
    },
    {
      key: 'priority',
      title: 'الأولوية',
      render: (value) => (
        <StatusBadge 
          status={value === 'urgent' ? 'عاجل' : 'عادي'} 
          variant={value === 'urgent' ? 'error' : 'info'} 
        />
      )
    },
    {
      key: 'message',
      title: 'الرسالة',
      render: (value) => (
        <span className="text-white">{value}</span>
      )
    },
    {
      key: 'category',
      title: 'الفئة',
      render: (value) => (
        <StatusBadge 
          status={value} 
          variant={value === 'توثيق' ? 'info' : 'warning'} 
        />
      )
    }
  ];


  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (activeTab === 'approvals') {
      dispatch(fetchDrivers({}));    }
  }, [activeTab, dispatch]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('pages.driversManagement')}</h1>
          <p className="text-gray-400 mt-1">{t('pages.driversSubtitle')}</p>
        </div>
      </div>

      <div className="bg-dark-300 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6 overflow-x-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === item.key 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.count && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'approvals' && (
          <DriversApprovalComponent/>
        )}
        {activeTab === 'management' && (
          <DriversManagementComponent/>
        )}
        {activeTab === 'control' && (
          <DriversControl
            driversData={driversData}
            driverControlColumns={driverControlColumns}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
        {activeTab === 'tracking' && (
          <div className="text-center py-12">
            <p className="text-gray-400">صفحة التتبع قيد التطوير</p>
          </div>
        )}
        {activeTab === 'ratings' && (
          <DriversRatingsComponent driverId="161914cb-37bc-4892-95f5-668c8282bf95" />
        )}
        {activeTab === 'notifications' && (
          <DriversNotifications
            notificationsData={notificationsData}
            notificationsColumns={notificationsColumns}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}
        {activeTab === 'reports' && (
          <DriversReports
            reportsData={reportsData}
            reportsColumns={reportsColumns}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        )}
      </div>
    </div>
  );
};

export default Drivers;