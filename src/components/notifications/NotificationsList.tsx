import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Bell, 
  Trash2, 
  Edit, 
  Eye, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Settings 
} from 'lucide-react';
import NotificationActions from './NotificationActions';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'warning' | 'info';
  date: string;
  category: string;
  status: 'read' | 'unread';
  priority: 'high' | 'medium' | 'low';
  recipient: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedNotifications: string[];
  onSelectNotification: (id: string) => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onMarkAsRead: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  searchTerm,
  setSearchTerm,
  selectedNotifications,
  onSelectNotification,
  onSelectAll,
  onDeleteSelected,
  onMarkAsRead,
  onEdit,
  onView,
  onDelete
}) => {
  const { t } = useTranslation();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Settings className="w-5 h-5 text-blue-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Bell className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-blue-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600/20 text-red-400';
      case 'medium':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'low':
        return 'bg-green-600/20 text-green-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return t('notifications.priority.high');
      case 'medium':
        return t('notifications.priority.medium');
      case 'low':
        return t('notifications.priority.low');
      default:
        return priority;
    }
  };

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      {/* <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('notifications.searchPlaceholder', 'البحث في الإشعارات...')}
            className="w-full bg-dark-400 border border-dark-200 rounded-lg pr-10 pl-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectAll}
            className="px-4 py-2 bg-dark-200 hover:bg-dark-100 text-white rounded-lg text-sm transition-colors"
          >
            {selectedNotifications.length === notifications.length 
              ? t('notifications.unselectAll') 
              : t('notifications.selectAll')
            }
          </button>
          
          {selectedNotifications.length > 0 && (
            <button
              onClick={onDeleteSelected}
              className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {t('notifications.deleteSelected')} ({selectedNotifications.length})
            </button>
          )}
        </div>
      </div> */}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-dark-200 rounded-xl p-6 border-r-4 ${
              notification.status === 'unread' ? 'border-primary-500' : 'border-gray-600'
            } hover:bg-dark-100 transition-colors`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => onSelectNotification(notification.id)}
                className="w-4 h-4 text-primary-600 bg-dark-400 border-dark-300 rounded focus:ring-primary-500 mt-1"
              />

              {/* Notification Icon */}
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-semibold ${notification.status === 'unread' ? 'text-white' : 'text-gray-300'}`}>
                      {notification.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                      {getPriorityText(notification.priority)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{notification.date}</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                  {notification.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`flex items-center gap-1 ${getTypeColor(notification.type)}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {notification.category}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <User className="w-4 h-4" />
                      {notification.recipient}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <NotificationActions
                      notificationId={notification.id}
                      onView={onView}
                      size="sm"
                    />
                    {notification.status === 'unread' && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-dark-300 rounded-lg transition-colors"
                        title={t('notifications.markAsRead')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(notification.id)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-dark-300 rounded-lg transition-colors"
                      title={t('common.edit')}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
          {t('notifications.noNotifications')}
        </h3>
        <p className="text-gray-500">
          {t('notifications.noNotificationsFound')}
        </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;