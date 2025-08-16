import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationStatsProps {
  totalNotifications: number;
  unreadCount: number;
  highPriorityCount: number;
  systemNotifications: number;
}

const NotificationStats: React.FC<NotificationStatsProps> = ({
  totalNotifications,
  unreadCount,
  highPriorityCount,
  systemNotifications
}) => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('notifications.stats.total', 'إجمالي الإشعارات'),
      value: totalNotifications,
      icon: <Bell className="w-6 h-6" />,
      color: 'bg-blue-600',
      textColor: 'text-blue-400'
    },
    {
      title: t('notifications.stats.unread', 'غير مقروءة'),
      value: unreadCount,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-yellow-600',
      textColor: 'text-yellow-400'
    },
    {
      title: t('notifications.stats.highPriority', 'عالية الأولوية'),
      value: highPriorityCount,
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-red-600',
      textColor: 'text-red-400'
    },
    {
      title: t('notifications.stats.system', 'إشعارات النظام'),
      value: systemNotifications,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-600',
      textColor: 'text-green-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.color} rounded-xl p-6 text-white relative overflow-hidden`}
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/20 rounded-full">
              {stat.icon}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.title}</div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationStats;