import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface AdsHeaderProps {
  onAddNew: () => void;
}

const AdsHeader: React.FC<AdsHeaderProps> = ({ onAddNew }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{t('pages.adsManagement')}</h1>
        <p className="text-gray-400 mt-1">{t('pages.adsSubtitle')}</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddNew}
        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
      >
        <Plus className="w-5 h-5" />
        {t('ads.actions.addNew')}
      </motion.button>
    </div>
  );
};

export default AdsHeader;

