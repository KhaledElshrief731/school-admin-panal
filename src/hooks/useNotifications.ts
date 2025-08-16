import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  createNotification,
  fetchNotifications,
  fetchNotificationById,
  resendNotification,
  removeNotification,
  selectNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
  selectCreateNotificationLoading,
  selectCreateNotificationError,
  selectCreateNotificationSuccess,
  selectLastCreatedNotification,
  selectSelectedNotification,
  selectSelectedNotificationLoading,
  selectSelectedNotificationError,
  selectResendLoading,
  selectResendError,
  selectResendSuccess,
  selectRemoveLoading,
  selectRemoveError,
  selectRemoveSuccess,
  clearCreateError,
  clearCreateSuccess,
  resetCreateState,
  clearSelectedNotification,
  clearResendState,
  clearRemoveState,
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
  const selectedNotification = useAppSelector(selectSelectedNotification);
  const selectedNotificationLoading = useAppSelector(selectSelectedNotificationLoading);
  const selectedNotificationError = useAppSelector(selectSelectedNotificationError);
  const resendLoading = useAppSelector(selectResendLoading);
  const resendError = useAppSelector(selectResendError);
  const resendSuccess = useAppSelector(selectResendSuccess);
  const removeLoading = useAppSelector(selectRemoveLoading);
  const removeError = useAppSelector(selectRemoveError);
  const removeSuccess = useAppSelector(selectRemoveSuccess);

  const createNewNotification = async (notificationData: CreateNotificationRequest) => {
    return dispatch(createNotification(notificationData));
  };

  const fetchNotificationsList = (params?: { page?: number; pageSize?: number }) => {
    dispatch(fetchNotifications(params));
  };

  const getNotificationById = (id: string) => {
    return dispatch(fetchNotificationById(id));
  };

  const resendNotificationById = (id: string) => {
    return dispatch(resendNotification(id));
  };

  const removeNotificationById = (id: string) => {
    return dispatch(removeNotification(id));
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

  const clearSelectedNotificationData = () => {
    dispatch(clearSelectedNotification());
  };

  const clearResendData = () => {
    dispatch(clearResendState());
  };

  const clearRemoveData = () => {
    dispatch(clearRemoveState());
  };

  return {
    notifications,
    loading,
    error,
    createLoading,
    createError,
    createSuccess,
    lastCreatedNotification,
    selectedNotification,
    selectedNotificationLoading,
    selectedNotificationError,
    resendLoading,
    resendError,
    resendSuccess,
    removeLoading,
    removeError,
    removeSuccess,
    createNewNotification,
    fetchNotificationsList,
    getNotificationById,
    resendNotificationById,
    removeNotificationById,
    clearErrors,
    clearSuccess,
    resetState,
    clearSelectedNotificationData,
    clearResendData,
    clearRemoveData,
  };
};