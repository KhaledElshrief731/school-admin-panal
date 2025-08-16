import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  createNotification,
  fetchNotifications,
  selectNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
  selectCreateNotificationLoading,
  selectCreateNotificationError,
  selectCreateNotificationSuccess,
  selectLastCreatedNotification,
  clearCreateError,
  clearCreateSuccess,
  resetCreateState,
  type CreateNotificationRequest
} from '../store/slices/notificationsSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const loading = useAppSelector(selectNotificationsLoading);
  const error = useAppSelector(selectNotificationsError);
  const createLoading = useAppSelector(selectCreateNotificationLoading);
  const createError = useAppSelector(selectCreateNotificationError);
  const createSuccess = useAppSelector(selectCreateNotificationSuccess);
  const lastCreatedNotification = useAppSelector(selectLastCreatedNotification);

  const createNewNotification = async (notificationData: CreateNotificationRequest) => {
    return dispatch(createNotification(notificationData));
  };

  const fetchNotificationsList = (params?: { page?: number; pageSize?: number }) => {
    dispatch(fetchNotifications(params));
  };

  const clearErrors = () => {
    dispatch(clearCreateError());
  };

  const clearSuccess = () => {
    dispatch(clearCreateSuccess());
  };

  const resetState = () => {
    dispatch(resetCreateState());
  };

  return {
    notifications,
    loading,
    error,
    createLoading,
    createError,
    createSuccess,
    lastCreatedNotification,
    createNewNotification,
    fetchNotificationsList,
    clearErrors,
    clearSuccess,
    resetState,
  };
};