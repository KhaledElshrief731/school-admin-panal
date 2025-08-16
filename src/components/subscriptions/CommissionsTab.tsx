import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table, { TableColumn } from '../ui/Table';
import StatusBadge from '../ui/StatusBadge';

// Mock data (replace with API call if available)
const mockCommissionsData = [
  {
    id: 'COM-001',
    agentName: 'محمد عبد الله',
    subscriptionId: 'SUB-2023-001',
    amount: '120 د.ج',
    date: '20 يناير 2023',
    status: 'قيد الانتظار'
  },
  {
    id: 'COM-002',
    agentName: 'أحمد محمود',
    subscriptionId: 'SUB-2023-003',
    amount: '95 د.ج',
    date: '10 مارس 2023',
    status: 'مدفوع'
  },
  {
    id: 'COM-003',
    agentName: 'سارة أحمد',
    subscriptionId: 'SUB-2023-005',
    amount: '250 د.ج',
    date: '15 مايو 2023',
    status: 'قيد الانتظار'
  }
];

const CommissionsTab: React.FC = () => {
  const { t } = useTranslation();
  const [commissionsData] = useState(mockCommissionsData);
  const columns: TableColumn[] = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      render: (value) => <span className="font-mono text-sm text-blue-400">{value}</span>
    },
    {
      key: 'agentName',
      title: t('table.agentName'),
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
        const variant = value === 'مدفوع' || value === 'Paid' ? 'success' : 'warning';
        return <StatusBadge status={value} variant={variant as any} localize={true} />;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">العمولات</h2>
      </div>
      <Table
        columns={columns}
        data={commissionsData}
        rowKey="id"
        hoverable={true}
        emptyText={t('pagination.noData')}
      />
      <div className="flex items-center justify-between pt-4 border-t border-dark-200">
        <div className="text-sm text-gray-400">
          {t('pagination.showing')} {commissionsData.length} {t('pagination.of')} {commissionsData.length} {t('pagination.results')}
        </div>
      </div>
    </div>
  );
};

export default CommissionsTab; 