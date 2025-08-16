import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Send, Trash2, RotateCcw } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { showToast } from '../../store/slices/toastSlice';
import { useAppDispatch } from '../../hooks/redux';

interface NotificationActionsProps {
  notificationId: string;
  onView?: (id: string) => void;
  showViewButton?: boolean;
  showResendButton?: boolean;
  showRemoveButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  notificationId,
  onView,
  showViewButton = true,
  showResendButton = true,
  showRemoveButton = true,
  size = 'md'
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    resendNotificationById,
    removeNotificationById,
    resendLoading,
    resendError,
    resendSuccess,
    removeLoading,
    removeError,
    removeSuccess,
    clearResendData,
    clearRemoveData
  } = useNotifications();

  const getSizeClasses = () => {
    const sizes = {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-3'
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };
    return sizes[size];
  };

  const handleView = () => {
    if (onView) {
      onView(notificationId);
    }
  };

  const handleResend = async () => {
    try {
      await resendNotificationById(notificationId);
      if (resendSuccess) {
        dispatch(showToast({
          message: t('notifications.success.resent', 'تم إعادة إرسال الإشعار بنجاح'),
          type: 'success'
        }));
        clearResendData();
      }
    } catch (error) {
      dispatch(showToast({
        message: resendError || t('notifications.error.resendFailed', 'فشل في إعادة إرسال الإشعار'),
        type: 'error'
      }));
    }
  };

  const handleRemove = async () => {
    if (window.confirm(t('messages.deleteConfirm'))) {
      try {
        await removeNotificationById(notificationId);
        if (removeSuccess) {
          dispatch(showToast({
            message: t('notifications.success.deleted'),
            type: 'success'
          }));
          clearRemoveData();
        }
      } catch (error) {
        dispatch(showToast({
          message: removeError || t('notifications.error.deleteFailed'),
          type: 'error'
        }));
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      {showViewButton && (
        <button
          onClick={handleView}
          className={`${getSizeClasses()} text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors`}
          title={t('common.view')}
        >
          <Eye className={getIconSize()} />
        </button>
      )}

      {showResendButton && (
        <button
          onClick={handleResend}
          disabled={resendLoading}
          className={`${getSizeClasses()} text-green-400 hover:text-green-300 hover:bg-green-600/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          title={t('notifications.resend', 'إعادة إرسال')}
        >
          {resendLoading ? (
            <div className={`${getIconSize()} animate-spin rounded-full border-b-2 border-green-400`}></div>
          ) : (
            <Send className={getIconSize()} />
          )}
        </button>
      )}

      {showRemoveButton && (
        <button
          onClick={handleRemove}
          disabled={removeLoading}
          className={`${getSizeClasses()} text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          title={t('common.delete')}
        >
          {removeLoading ? (
            <div className={`${getIconSize()} animate-spin rounded-full border-b-2 border-red-400`}></div>
          ) : (
            <Trash2 className={getIconSize()} />
          )}
        </button>
      )}
    </div>
  );
};

export default NotificationActions;