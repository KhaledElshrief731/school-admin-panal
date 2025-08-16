import React from 'react';
import { useTranslation } from 'react-i18next';
import Table, { TableProps, TableColumn } from './Table';

interface LocalizedTableProps<T = any> extends Omit<TableProps<T>, 'emptyText'> {
  emptyTextKey?: string;
  defaultEmptyText?: string;
}

const LocalizedTable = <T extends Record<string, any>>({
  emptyTextKey = 'common.noData',
  defaultEmptyText = 'لا توجد بيانات',
  ...props
}: LocalizedTableProps<T>) => {
  const { t } = useTranslation();
  
  return (
    <Table
      {...props}
      emptyText={t(emptyTextKey, defaultEmptyText)}
    />
  );
};

export default LocalizedTable;