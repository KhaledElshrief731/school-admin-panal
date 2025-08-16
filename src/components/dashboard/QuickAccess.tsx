import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, FileText, CreditCard, Users, School, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const QuickAccess: React.FC = () => {
  const { t } = useTranslation();
  
  const quickAccessItems = [
    { name: t('header.settings'), path: '/settings', icon: <Settings className="h-6 w-6 text-white" />, bg: 'bg-primary-700' },
    { name: t('navigation.reports', 'التقارير'), path: '/reports', icon: <FileText className="h-6 w-6 text-white" />, bg: 'bg-error-700' },
    { name: t('navigation.subscriptions'), path: '/subscriptions', icon: <CreditCard className="h-6 w-6 text-white" />, bg: 'bg-accent-700' },
    { name: t('navigation.agents'), path: '/agents', icon: <User className="h-6 w-6 text-white" />, bg: 'bg-secondary-700' },
    { name: t('navigation.users'), path: '/users', icon: <Users className="h-6 w-6 text-white" />, bg: 'bg-success-700' },
    { name: t('navigation.schools'), path: '/schools', icon: <School className="h-6 w-6 text-white" />, bg: 'bg-primary-700' },
  ];

  return (
    <div className="bg-dark-300 rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium flex items-center">
          {t('dashboard.quickAccess')}
          <svg
            className="h-5 w-5 mr-2 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </h3>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 md:grid-cols-6 gap-4"
      >
        {quickAccessItems.map((item, index) => (
          <QuickAccessItem key={index} item={item} variants={item} />
        ))}
      </motion.div>
    </div>
  );
};

const QuickAccessItem = ({ item, variants }) => {
  return (
    <motion.div variants={variants}>
      <Link to={item.path} className="quick-access-item">
        <div className={`rounded-full p-3 ${item.bg}`}>{item.icon}</div>
        <span className="text-sm mt-2">{item.name}</span>
      </Link>
    </motion.div>
  );
};

export default QuickAccess;