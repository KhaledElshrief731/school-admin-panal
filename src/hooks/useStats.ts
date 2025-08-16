import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  fetchDashboardStats, 
  fetchMonthlyUsers,
  fetchMonthlySubscriptions,
  selectDashboardStats, 
  selectStatsLoading, 
  selectStatsError,
  selectMonthlyUsers,
  selectMonthlyUsersLoading,
  selectMonthlyUsersError,
  selectMonthlySubscriptions,
  selectMonthlySubscriptionsLoading,
  selectMonthlySubscriptionsError,
  clearStatsError 
} from '../store/slices/statsSlice';

export const useStats = () => {
  const dispatch = useAppDispatch();
  const dashboardStats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectStatsLoading);
  const error = useAppSelector(selectStatsError);
  const monthlyUsers = useAppSelector(selectMonthlyUsers);
  const monthlyUsersLoading = useAppSelector(selectMonthlyUsersLoading);
  const monthlyUsersError = useAppSelector(selectMonthlyUsersError);
  const monthlySubscriptions = useAppSelector(selectMonthlySubscriptions);
  const monthlySubscriptionsLoading = useAppSelector(selectMonthlySubscriptionsLoading);
  const monthlySubscriptionsError = useAppSelector(selectMonthlySubscriptionsError);

  const refreshStats = () => {
    dispatch(fetchDashboardStats());
  };

  const refreshMonthlyUsers = () => {
    dispatch(fetchMonthlyUsers());
  };

  const refreshMonthlySubscriptions = () => {
    dispatch(fetchMonthlySubscriptions());
  };

  const clearError = () => {
    dispatch(clearStatsError());
  };

  useEffect(() => {
    if (!dashboardStats && !loading) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, dashboardStats, loading]);

  useEffect(() => {
    if (monthlyUsers.length === 0 && !monthlyUsersLoading) {
      dispatch(fetchMonthlyUsers());
    }
  }, [dispatch, monthlyUsers, monthlyUsersLoading]);

  useEffect(() => {
    if (monthlySubscriptions.length === 0 && !monthlySubscriptionsLoading) {
      dispatch(fetchMonthlySubscriptions());
    }
  }, [dispatch, monthlySubscriptions, monthlySubscriptionsLoading]);

  return {
    dashboardStats,
    loading,
    error,
    monthlyUsers,
    monthlyUsersLoading,
    monthlyUsersError,
    monthlySubscriptions,
    monthlySubscriptionsLoading,
    monthlySubscriptionsError,
    refreshStats,
    refreshMonthlyUsers,
    refreshMonthlySubscriptions,
    clearError,
  };
}; 