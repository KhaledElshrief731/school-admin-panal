import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table, { TableColumn } from '../ui/Table';
import StatusBadge from '../ui/StatusBadge';

// Mock data (replace with API call if available)
const mockPaymentsData = [
  {
    id: 'PAY-2023-001',
    subscriptionId: 'SUB-2023-001',
    payer: 'John Doe',
    amount: '199.99 د.ج',
    date: '1 يونيو 2023',
    paymentMethod: 'بطاقة ائتمان',
    status: 'ناجح'
  },
  {
    id: 'PAY-2023-002',
    subscriptionId: 'SUB-2023-002',
    payer: 'Jane Smith',
    amount: '299.99 د.ج',
    date: '2 يونيو 2023',
    paymentMethod: 'تحويل بنكي',
    status: 'قيد الانتظار'
  },
  {
    id: 'PAY-2023-003',
    subscriptionId: 'SUB-2023-003',
    payer: 'Robert Johnson',
    amount: '499.99 د.ج',
    date: '3 يونيو 2023',
    paymentMethod: 'بطاقة ائتمان',
    status: 'ناجح'
  },
  {
    id: 'PAY-2023-004',
    subscriptionId: 'SUB-2023-004',
    payer: 'Emily Davis',
    amount: '199.99 د.ج',
    date: '4 يونيو 2023',
    paymentMethod: 'تحويل بنكي',
    status: 'ناجح'
  },
  {
    id: 'PAY-2023-005',
    subscriptionId: 'SUB-2023-005',
    payer: 'Michael Wilson',
    amount: '399.99 د.ج',
    date: '5 يونيو 2023',
    paymentMethod: 'بطاقة ائتمان',
    status: 'ناجح'
  }
];

const PaymentsTab: React.FC = () => {
  const { t } = useTranslation();
  const [paymentsData] = useState(mockPaymentsData);
  const columns: TableColumn[] = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      render: (value) => <span className="font-mono text-sm text-blue-400">{value}</span>
    },
    {
      key: 'payer',
      title: t('table.payer'),
      sortable: true,
      render: (value) => <span className="font-medium text-white">{value}</span>
    },
    {
      key: 'subscriptionId',
      title: t('table.subscriptionId'),
      sortable: true,
      render: (value) => <span className="text-gray-300 font-mono text-sm">{value}</span>
    },
    {
      key: 'paymentMethod',
      title: t('table.paymentMethod'),
      render: (value) => <span className="text-gray-300 text-sm">{value}</span>
    },
    {
      key: 'date',
      title: t('table.date'),
      sortable: true,
      render: (value) => <span className="text-gray-400 text-sm">{value}</span>
    },
    {
      key: 'amount',
      title: t('table.amount'),
      sortable: true,
      render: (value) => <span className="font-semibold text-green-400">{value}</span>
    },
    {
      key: 'status',
      title: t('table.status'),
      sortable: true,
      render: (value) => {
        const variant = value === 'ناجح' || value === 'Success' ? 'success' : 'warning';
        return <StatusBadge status={value} variant={variant as any} localize={true} />;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('navigation.subscriptions')} - المدفوعات</h2>
      </div>
      <Table
        columns={columns}
        data={paymentsData}
        rowKey="id"
        hoverable={true}
        emptyText={t('pagination.noData')}
      />
      <div className="flex items-center justify-between pt-4 border-t border-dark-200">
        <div className="text-sm text-gray-400">
          {t('pagination.showing')} {paymentsData.length} {t('pagination.of')} {paymentsData.length} {t('pagination.results')}
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab; 